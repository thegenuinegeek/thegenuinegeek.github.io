---
title: "GG Tools: A Serverless Content Idea Capture System on AWS"
description: "I built a serverless idea capture system on AWS for $0.40/month because good ideas don't wait for you to sit down at a desk."
pubDate: 2026-04-02
tags: ["aws", "serverless", "opentofu", "lambda", "side-project"]
series: "GG Tools"
---

Ideas don't care about your schedule.

They show up in the car. During a meeting. While you're fishing with your kids. And by the time you actually sit down to create something, half of them are gone. A notes app doesn't cut it because notes apps become graveyards. You dump things in, never look at them again, and three months later you've got 200 entries and zero action.

I needed something different. Something I could fire an idea into from my phone in five seconds, that would organize it, remind me about it, and give me a dashboard I could actually use.

So I built one. In a morning. On AWS. For less than the cost of a gumball.


## The Architecture

The whole system is five pieces working together.

**Android phone** sends ideas via HTTP Shortcuts. One tap, type the idea, hit send. That's it.

**API Gateway** receives the request, validates the API key, and routes it to Lambda.

**Lambda functions** (Python 3.12) handle all the logic. One function for CRUD operations on ideas. One for rendering the dashboard. One for sending a weekly email digest.

**DynamoDB** stores everything. Pay-per-request billing, schemaless, zero maintenance. The table has one item per idea with fields for title, category, tags, status, and timestamps.

**S3 + CloudFront** serves the dashboard as static HTML, secured behind Google OAuth via Lambda@Edge.


## How It Works

The lifecycle of an idea is dead simple.

**Capture.** I'm on my phone, I think of something. Open HTTP Shortcuts, type it in, pick a category, hit send. A POST hits API Gateway, Lambda writes it to DynamoDB. Done in under five seconds.

**Review.** The dashboard shows all ideas grouped by category. Each one has a status indicator. Tilde for captured, arrow for in progress, hash for posted. Posted ideas dim to 35% opacity so the focus stays on what I haven't acted on yet.

**Digest.** Every Monday at 8am Eastern, a Lambda scans DynamoDB for unactioned ideas and sends me an email via SNS. How many are sitting there. What's new from the past week. A guilt trip delivered on schedule.


## What Got Deployed

This is the full inventory of AWS resources.

**API Gateway** - REST API with API key and usage plan. The secure front door for all requests.

**Lambda: gg-tools-content-ideas** - Handles POST, GET, and PATCH for ideas. Create, list, filter, update status.

**Lambda: gg-tools-ideas-dashboard** - Reads DynamoDB, renders a full HTML dashboard, drops it in S3.

**Lambda: gg-tools-weekly-digest** - Scans for unactioned ideas, formats them, sends the digest via SNS.

**Lambda@Edge: gg-tools-edge-auth** - Google OAuth gate sitting in front of CloudFront. Only I can see the dashboard.

**DynamoDB: gg-tools-content-ideas** - The ideas table. Pay-per-request, no capacity planning needed.

**S3: gg-tools bucket** - Hosts the static dashboard HTML that CloudFront serves.

**CloudFront** - HTTPS distribution with Origin Access Control. Serves the dashboard with caching and the OAuth layer.

**SNS: gg-tools-ideas-digest** - Email subscription for the weekly digest.

**EventBridge** - Two scheduled rules. Daily dashboard refresh at 8am Eastern. Weekly digest on Mondays at 8am Eastern.


## The Dashboard

The dashboard matches the Genuine Geek Media aesthetic. Green on black. IBM Plex Mono. CRT scanlines. It looks like it belongs in a terminal from 1987 and I love it.

Ideas are grouped by category and sorted by date. Each entry shows the title, tags, capture date, and status. Posted ideas fade out so you're always looking at what needs attention.

The whole thing is static HTML. No JavaScript frameworks. No React. No build step. Lambda renders it directly and drops the file in S3. CloudFront serves it. That's the entire frontend stack.


## The API

Four endpoints handle everything.

**POST /ideas** - Capture a new idea. Send a title, category, and optional tags. Lambda stamps it with a UUID, sets status to captured, and writes it to DynamoDB.

**GET /ideas** - List ideas. Supports filtering by category and status via query parameters.

**PATCH /ideas/{id}** - Update an idea's status. Move it from captured to in_progress, or from in_progress to posted.

**POST /dashboard** - Manually trigger a dashboard refresh. EventBridge handles the daily auto-refresh, but sometimes you want it now.


## Infrastructure as Code

Everything is managed with OpenTofu. One `tofu apply` and the entire stack comes up. One `tofu destroy` and it's gone.

I chose OpenTofu over CDK or SAM because I already think in Terraform and OpenTofu is the open-source fork. No vendor lock-in on the tooling that manages my vendor lock-in. There's some irony there.

The state file lives in an S3 backend with DynamoDB locking. Standard setup.


## The Cost

This is my favorite part.

The entire system costs **$0.40 per month.**

That's it. One Secrets Manager secret storing the Google OAuth credentials. Forty cents.

Everything else is free tier. DynamoDB gives you 25 GB and 25 read/write capacity units always free. Lambda gives you a million requests per month always free. S3, CloudFront, SNS, EventBridge, all covered.

Your content idea system costs less than a single gumball.


## What's Next

This is the first tool in what I'm calling the **gg-tools** umbrella. The architecture is designed to grow.

**Voice capture** is the next big add. A Telegram bot backed by an AI agent (Claude or Gemini) that listens to voice notes, transcribes them, auto-categorizes, and writes the idea to DynamoDB. No typing required.

**Android home screen widget** using the HTTP Shortcuts app. One tap from the home screen to capture an idea without opening anything.

**More tools.** The API Gateway, Lambda, DynamoDB pattern scales horizontally. New tools get their own Lambda functions and DynamoDB tables behind the same API Gateway. The auth layer, the dashboard pattern, the IaC structure, all reusable.


## The Genuine Geek Take

I built this because I was losing ideas. Not because they were bad ideas, but because the friction between "I just thought of something" and "I wrote it down somewhere useful" was too high.

The whole thing took a morning. OpenTofu makes the infrastructure trivial. Lambda makes the compute free. DynamoDB makes the storage schemaless and maintenance-free. CloudFront and Lambda@Edge make it secure without running a server.

If you're a content creator, a builder, or just someone with too many ideas and not enough time, you don't need a fancy app. You need an API, a database, and a reminder system. The cloud will run it for the cost of a gumball.

Build the tool that solves your problem. That's the genuine geek way.
