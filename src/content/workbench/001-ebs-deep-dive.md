---
title: "EBS Optimization Deep Dive"
description: "A hands-on walkthrough of identifying and eliminating wasted EBS spend across your AWS fleet."
pubDate: 2025-03-22
tags: ["aws", "ebs", "cost-optimization", "tutorial"]
series: "Cloud Cost Masterclass"
---

EBS volumes are the silent budget killer in most AWS environments.

They don't show up in your "top 5 most expensive services" dashboard because the waste is spread thin. A $15 volume here. A $40 volume there. Multiply that across a few hundred instances and you're bleeding thousands a month on storage nobody is using.

This is the exact playbook our SBCO team runs on every engagement. Not theory. Process.

## The Anatomy of EBS Waste

EBS waste falls into three categories. Every engagement we run hits all three.

**Orphaned Volumes** - Volumes not attached to any instance. Someone terminated an EC2 box but left "Delete on Termination" unchecked. The instance is gone. The volume lives on. You're paying for it every hour.

**Over-Provisioned Volumes** - A developer spun up a 500GB gp3 volume "just in case." The app uses 43GB. You're paying for 457GB of empty blocks.

**Wrong Volume Type** - io2 volumes running workloads that don't need provisioned IOPS. gp2 volumes that should have been migrated to gp3 two years ago. Magnetic volumes that somehow still exist in 2025.

## Step 1: Find the Orphans

Lowest-hanging fruit in all of cloud cost optimization. Unattached volumes cost money and deliver zero value.

Pull every volume in the account and filter for `state: available`:

```bash
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].{ID:VolumeId,Size:Size,Type:VolumeType,Created:CreateTime}' \
  --output table
```

On a recent engagement with a mid-size SaaS company, this returned **147 orphaned volumes** totaling 12.4TB.

That's roughly **$1,200/month** sitting in available state doing absolutely nothing.

Before you delete anything, check for snapshots. Some teams leave volumes around as a "backup" instead of using proper snapshots. Confirm there's a recent snapshot or that the data is genuinely abandoned, then terminate.

**Pro tip:** Tag every orphan with `OrphanedDate` and the current date. Give the team two weeks to claim anything. Whatever's unclaimed gets deleted. This avoids the "who approved deleting my volume" conversation entirely.

## Step 2: Audit Volume Utilization

CloudWatch is your best friend here. Every EBS volume reports:

- `VolumeReadBytes` / `VolumeWriteBytes` - actual throughput
- `VolumeReadOps` / `VolumeWriteOps` - IOPS consumed
- `VolumeQueueLength` - how backed up the disk is

Pull 14 days of data for every attached volume.

### What to look for: Storage

CloudWatch doesn't tell you how full a disk is. That's an OS-level metric, so you need the CloudWatch Agent or SSM for filesystem usage.

But you can infer a lot from I/O patterns. A 1TB volume with near-zero read/write bytes over two weeks? Either massively over-provisioned or attached to something that's effectively idle.

### What to look for: IOPS

If you're running io2 volumes provisioned at 10,000 IOPS and your peak over two weeks is 800 IOPS, you're paying for 9,200 IOPS you'll never touch.

Drop to gp3. Set IOPS to 3,000 (the free baseline). Pocket the difference.

On this engagement, we found **23 io2 volumes** averaging under 1,000 IOPS. Migrating those to gp3 saved **$3,400/month** with zero performance impact.

## Step 3: The gp2 to gp3 Migration

If you still have gp2 volumes in your environment, stop reading and go fix that first. Seriously.

gp3 gives you:

- 3,000 IOPS baseline (gp2 needs a 1TB volume to match that)
- 125 MB/s baseline throughput
- **20% cheaper per GB** than gp2

Better performance. Lower price. There is no reason to stay on gp2.

The migration is non-destructive. Modify in-place, zero downtime:

```bash
aws ec2 modify-volume \
  --volume-id vol-0123456789abcdef0 \
  --volume-type gp3
```

Volume stays attached. Instance keeps running. AWS handles the conversion in the background.

One caveat: you can't modify the same volume again for six hours, so batch accordingly.

This customer had **312 gp2 volumes** across three accounts. Converting them all saved **$2,800/month**. The entire migration took one afternoon.

## Step 4: Rightsize What's Left

Orphans cleaned. Volume types fixed. IOPS tuned. Now look at raw storage allocation.

Sort your remaining volumes by size, descending. The top 20% by size typically represents 80% of your storage spend. Focus there.

For each large volume, two questions:

- How full is the filesystem?
- What's the growth rate over the last 90 days?

A 500GB volume that's 15% full and growing at 2GB/month doesn't need to be 500GB. It needs to be 100GB with a reminder to revisit in six months.

Important: EBS volumes can be expanded in-place but **cannot be shrunk**. To rightsize down:

1. Create a snapshot
2. Create a new, smaller volume from the snapshot
3. Swap the volumes on the instance
4. Extend the filesystem if needed

More work than a type conversion, so prioritize the biggest offenders. A 2TB volume at 8% utilization is worth it. A 100GB volume at 60% is not.

## The Scoreboard

Final tally from that engagement:

| Action | Volumes | Monthly Savings |
|--------|---------|-----------------|
| Orphan cleanup | 147 | $1,200 |
| io2 to gp3 migration | 23 | $3,400 |
| gp2 to gp3 conversion | 312 | $2,800 |
| Volume rightsizing | 18 | $1,100 |
| **Total** | **500** | **$8,500/mo** |

**$102,000 in annualized savings.** From EBS alone. In under two weeks.

No application changes. No architecture redesign. Just cleaning up storage that should have been managed years ago.

## The Genuine Geek Take

EBS optimization isn't glamorous. Nobody's writing conference talks about deleting orphaned volumes.

But dollar for dollar, it's consistently the highest-ROI work in cloud cost optimization.

Every environment we touch has this waste. Every single one. The volumes accumulate slowly. A dev environment here. A failed deployment there. A "temporary" volume from 2023 that's still running.

Nobody notices because no single volume is expensive enough to trigger an alarm.

The fix isn't a tool. It's a process:

- Run this audit quarterly
- Tag your volumes
- Set up a CloudWatch alarm for unattached volumes older than 7 days
- Make gp3 the default in your IaC templates

The cloud doesn't clean up after itself. That's your job.
