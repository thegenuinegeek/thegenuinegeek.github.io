---
title: "AWS re:Invent 2025 Rapid Recap"
description: "The biggest announcements from re:Invent 2025 that actually matter for your cloud bill."
pubDate: 2025-12-15
tags: ["aws", "cloud", "cost-optimization", "reinvent"]
share: true
---

Let's cut through the keynote fluff. re:Invent 2025 dropped a ton of announcements, but most of them won't change your monthly bill. These will.

Here are the three biggest cost-impacting launches and what you should actually do about them.

## Database Savings Plans Are Finally Here

This one's been on every FinOps team's wish list for years. AWS launched **Database Savings Plans** that cover *seven* services under one commitment: Aurora, RDS, DynamoDB, DocumentDB, Neptune, ElastiCache, and Timestream.

The numbers: **up to 35% savings** with flexible, cross-service commitments. That means you're not locked into one database engine. If you migrate from RDS PostgreSQL to Aurora next quarter, your savings plan follows you.

**What to do right now:** Pull your last 30 days of database spend from Cost Explorer. If you're running steady-state database workloads (and you probably are), this is free money. Start with a conservative 1-year commitment on your baseline usage and layer on from there.

On top of that, AWS announced **up to 55% lower costs for RDS SQL Server** on the new M7i and R7i instance families using optimized CPU configurations. If you're still paying full vCPU licensing on older instance types, that's a migration worth scheduling this quarter.

## S3 Intelligent-Tiering for S3 Tables (and S3 Vectors)

S3 Tables now supports **Intelligent-Tiering**, which automatically moves your data through three access tiers without you touching a thing:

- **Frequent Access** - your default tier
- **Infrequent Access** - kicks in after 30 days with no access, **40% cheaper**
- **Archive Instant Access** - after 90 days, **68% cheaper** than Infrequent

No performance impact. No operational overhead. It just watches your access patterns and moves data down the tiers automatically.

They also launched **S3 Vectors**, the first cloud object storage with native vector data support. Sub-100ms queries on 2 billion vectors. If you're running a vector database for AI/ML workloads and paying for a separate service to store embeddings, this could cut that storage cost by **up to 90%**.

**What to do right now:** Audit your S3 buckets. If you have tables or datasets that don't use Intelligent-Tiering yet, turn it on. There's no retrieval fee for Frequent and Infrequent tiers, so there's essentially no downside.

## Graviton5 and the New Instance Families

AWS dropped **Graviton5** (yes, they skipped ahead) with the new M9g instances in preview, plus GA'd a stack of Graviton4 instance types:

- **M8gn** - up to 600 Gbps network bandwidth (highest of any network-optimized EC2 instance)
- **M8gb** - up to 150 Gbps EBS bandwidth for storage-heavy workloads
- **C8gb** - compute-optimized with the same 150 Gbps EBS bandwidth

Graviton4 delivers **30% better compute performance** over Graviton3. That's 30% more headroom on the same instance size, or the same performance on a smaller (cheaper) instance.

**What to do right now:** If you're still running on Intel or AMD instances and haven't tested Graviton, this is the generation to make the jump. The performance gap is real, and the price-performance advantage compounds fast at scale. Start with your stateless workloads (web servers, API layers, containers) where migration is lowest risk.

## The Genuine Geek Take

The theme of re:Invent 2025 wasn't AI (okay, it was also AI). But the real story for anyone managing cloud spend is that AWS is finally giving us the tools to save money *without* re-architecting everything.

Database Savings Plans alone could have saved some of our clients six figures annually if they'd existed a year ago. S3 Intelligent-Tiering on Tables removes one of the last excuses for not optimizing storage. And Graviton keeps widening the gap between "we should migrate" and "we can't afford not to."

The best part? None of these require a massive engineering effort. They're knobs you can turn this week.

Stop reading, go check your Cost Explorer.

---

*Sources:*
- *[Top Announcements of AWS re:Invent 2025](https://aws.amazon.com/blogs/aws/top-announcements-of-aws-reinvent-2025/)*
- *[AWS Cloud Financial Management re:Invent 2025 Launches](https://aws.amazon.com/blogs/aws-cloud-financial-management/aws-cloud-financial-management-key-reinvent-2025-launches-to-transform-your-finops-practice/)*
- *[re:Invent 2025 Hidden CFM Announcements Guide](https://aws.amazon.com/blogs/aws-cloud-financial-management/reinvent-2025-hidden-cfm-announcements-guide/)*
