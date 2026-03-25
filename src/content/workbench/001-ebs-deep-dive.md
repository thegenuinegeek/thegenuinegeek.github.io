---
title: "EBS Optimization Deep Dive"
description: "A hands-on walkthrough of identifying and eliminating wasted EBS spend across your AWS fleet."
pubDate: 2025-03-22
tags: ["aws", "ebs", "cost-optimization", "tutorial"]
series: "Cloud Cost Masterclass"
---

EBS volumes are the silent budget killer in most AWS environments. They don't show up in the "top 5 most expensive services" dashboards because the waste is spread across hundreds of small volumes. A $15 volume here, a $40 volume there. Multiply that across a few hundred instances and you're bleeding thousands a month on storage nobody is using.

In this deep dive, we walk through the exact process our SBCO team uses to audit, rightsize, and eliminate orphaned EBS volumes. These aren't theoretical recommendations. This is the playbook.

## The Anatomy of EBS Waste

EBS waste falls into three categories. Every single engagement we run hits all three.

**Orphaned Volumes** - Volumes that aren't attached to any instance. Someone terminated an EC2 instance but left "Delete on Termination" unchecked. The instance is gone. The volume lives on. You're paying for it every hour.

**Over-Provisioned Volumes** - A developer spun up a 500GB gp3 volume "just in case" and the application uses 43GB. That's 457GB of storage you're paying for that holds nothing but empty blocks.

**Wrong Volume Type** - io2 volumes running workloads that don't need provisioned IOPS. gp2 volumes that should have been migrated to gp3 two years ago (gp3 is cheaper *and* faster at baseline). Magnetic volumes that somehow still exist in 2025.

## Step 1: Find the Orphans

This is the lowest-hanging fruit in all of cloud cost optimization. Unattached volumes cost you money and deliver zero value.

Pull every volume in the account and filter for `state: available` (not `in-use`). Here's the CLI one-liner:

```bash
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].{ID:VolumeId,Size:Size,Type:VolumeType,Created:CreateTime}' \
  --output table
```

On a recent engagement with a mid-size SaaS company, this query returned **147 orphaned volumes** totaling 12.4TB. That's roughly **$1,200/month** sitting in available state doing absolutely nothing.

Before you delete anything, check for snapshots. Some teams leave volumes around as a "backup" instead of using proper snapshots. Confirm there's a recent snapshot or that the data is genuinely abandoned, then terminate.

**Pro tip:** Tag every volume you find with `OrphanedDate` and the current date. Give the team two weeks to claim anything. Whatever's unclaimed gets deleted. This avoids the "who approved deleting my volume" conversation.

## Step 2: Audit Volume Utilization

This is where CloudWatch becomes your best friend. Every EBS volume reports these metrics:

- `VolumeReadBytes` / `VolumeWriteBytes` - actual throughput
- `VolumeReadOps` / `VolumeWriteOps` - IOPS consumed
- `VolumeQueueLength` - how backed up the disk is

Pull 14 days of CloudWatch data for every attached volume. What you're looking for:

**Storage utilization** - CloudWatch doesn't tell you how full a disk is (that's an OS-level metric). You need the CloudWatch Agent or SSM to pull filesystem usage. But you can infer a lot from I/O patterns. A 1TB volume with near-zero read/write bytes over two weeks is either massively over-provisioned or attached to something that's effectively idle.

**IOPS consumption vs. provisioned** - If you're running io2 volumes provisioned at 10,000 IOPS and your peak usage over two weeks is 800 IOPS, you're paying for 9,200 IOPS you'll never use. Drop to gp3, set the IOPS to 3,000 (the free baseline), and pocket the difference.

On the same engagement, we found **23 io2 volumes** that averaged under 1,000 IOPS. Migrating those to gp3 saved **$3,400/month** with zero performance impact.

## Step 3: The gp2 to gp3 Migration

If you still have gp2 volumes in your environment, stop reading and go fix that first. Seriously.

gp3 gives you:
- 3,000 IOPS baseline (gp2 gives you 3 IOPS per GB, so you need a 1TB volume to match)
- 125 MB/s baseline throughput (gp2 caps at 250 MB/s but only on large volumes)
- **20% cheaper per GB** than gp2

The migration is non-destructive. You can modify a gp2 volume to gp3 in-place with zero downtime:

```bash
aws ec2 modify-volume \
  --volume-id vol-0123456789abcdef0 \
  --volume-type gp3
```

The volume stays attached. The instance keeps running. AWS handles the conversion in the background. You can't modify the same volume again for six hours, so batch your changes accordingly.

On this engagement, the customer had **312 gp2 volumes** across three accounts. Converting all of them to gp3 saved **$2,800/month**. The entire migration took one afternoon.

## Step 4: Rightsize What's Left

Now that you've cleaned up orphans, fixed volume types, and tuned IOPS, look at raw storage allocation.

Sort your remaining volumes by size descending. The top 20% of volumes by size typically represent 80% of your storage spend. Focus there.

For each large volume, answer two questions:
- How full is the filesystem? (Pull from CloudWatch Agent or SSM)
- What's the growth rate over the last 90 days?

If a 500GB volume is 15% full and growing at 2GB/month, it doesn't need to be 500GB. It needs to be 100GB with a calendar reminder to check it in six months.

EBS volumes can be expanded in-place but **cannot be shrunk**. To rightsize a volume down, you need to:
1. Create a snapshot
2. Create a new, smaller volume from the snapshot
3. Swap the volumes on the instance
4. Extend the filesystem if needed

It's more work than a type conversion, so prioritize the biggest offenders. A 2TB volume that's 8% full is worth the effort. A 100GB volume that's 60% full is not.

## The Scoreboard

Here's the final tally from that engagement:

| Action | Volumes Affected | Monthly Savings |
|--------|-----------------|----------------|
| Orphan cleanup | 147 | $1,200 |
| io2 to gp3 migration | 23 | $3,400 |
| gp2 to gp3 conversion | 312 | $2,800 |
| Volume rightsizing | 18 | $1,100 |
| **Total** | **500** | **$8,500/mo** |

That's **$102,000 in annualized savings** from EBS alone. The entire audit and remediation took less than two weeks. No application changes. No architecture redesign. Just cleaning up storage that should have been managed years ago.

## The Genuine Geek Take

EBS optimization isn't glamorous. Nobody's writing conference talks about deleting orphaned volumes. But dollar for dollar, it's consistently the highest-ROI activity in cloud cost optimization.

Every environment we touch has this waste. Every single one. The volumes accumulate slowly, a dev environment here, a failed deployment there, a "temporary" volume from 2023 that's still running. Nobody notices because no single volume is expensive enough to trigger an alarm.

The fix isn't a tool or a platform. It's a process. Run this audit quarterly. Tag your volumes. Set up a CloudWatch alarm for unattached volumes older than 7 days. Make gp3 the default in your IaC templates.

The cloud doesn't clean up after itself. That's your job.
