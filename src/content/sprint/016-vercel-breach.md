---
title: "The Vercel Breach Hit My Saturday Night"
description: "Vercel got breached through a compromised AI tool. I spent my evening rotating API keys for a production app instead of gaming. Here's what happened and what you should do."
pubDate: 2026-04-20T10:00:00
tags: ["security", "aws", "industry", "opinion"]
image: "/images/security-breach-vercel-hero.jpg"
share: true
---

I was winding down for the evening. Kids were settled. Steam Deck was calling. Then I made the mistake of actually reading an article instead of just the headline.

Vercel got breached. And my production app runs on Vercel.


## What Happened

A threat actor posted on BreachForums claiming to have stolen data from Vercel and demanding $2 million in ransom. Vercel confirmed the breach and traced it back to a compromised third-party AI tool called Context.ai that had been integrated into their environment with Google Workspace OAuth access.

The attacker got in through the AI tool, not through Vercel's infrastructure directly. Context.ai had deployment-level access that gave the attacker a privileged foothold once that platform was compromised.

Vercel says environment variables marked as "Sensitive" were encrypted and protected. But standard environment variables, the ones most developers set up without thinking twice about that checkbox, were potentially exposed.

The claimed stolen data includes access keys, source code, database content, and API tokens tied to internal deployments. Vercel has engaged external incident response firms and notified law enforcement.


## My Saturday Night

Here's where this stopped being an industry news story and became my problem.

High Octane HQ, my car community app, runs on Vercel. I have environment variables in there for Resend (email delivery) and my Gemini API key (AI parsing of event flyers). When I read deeper into the breach details, one line jumped out: if your environment variables weren't marked as sensitive, treat them as exposed.

Were mine marked as sensitive? I honestly couldn't remember. And that uncertainty is the whole problem.

The Gemini key was the one that worried me most. If someone grabbed that key and started running requests against Google's API, I'm the one paying the bill. Unlimited API calls on my credit card because an AI tool I've never heard of got compromised on a platform I trust to host my code.

So instead of gaming, I spent the evening rotating keys. New Resend API key. New Gemini API key. Updated the environment variables in Vercel. Redeployed. Tested. Made sure emails still send. Made sure event flyer parsing still works.

The public keys (things like my Supabase anon key) I left alone since those are visible in browser dev tools by design. They're meant to be public.

The whole process took about an hour. Not the end of the world. But it's an hour I wouldn't have needed to spend if a third-party AI integration hadn't been the weak link in the chain.


## The AI Tool Problem

This is the part that should make every developer uncomfortable.

The breach didn't happen because Vercel's security was bad. It happened because an AI tool that Vercel integrated with got compromised. Context.ai had OAuth scopes that gave it access to things it probably shouldn't have had access to. When Context.ai got popped, everything it could reach was exposed.

This is the supply chain risk that everyone talks about in the abstract but doesn't think about when they click "Authorize" on that OAuth popup. Every integration you add to your development environment is an attack surface. Every AI tool, every analytics platform, every "connect your GitHub" button is another door someone could walk through.

I use AI tools in my workflow. I literally built an AI enrichment pipeline for this blog. But there's a difference between calling an API from your own Lambda function with a key stored in Secrets Manager and granting a third-party tool deployment-level OAuth access to your entire workspace.

The first is a controlled connection. The second is handing someone your house keys and hoping they don't get mugged.


## What You Should Do

If you have anything deployed on Vercel, here's the checklist:

**Rotate your secrets.** Any API key, token, or credential stored as a standard (non-sensitive) environment variable should be treated as compromised. Generate new keys, update your env vars, redeploy. Don't wait.

**Mark everything as sensitive.** Here's the thing that got me: Vercel's "Sensitive" flag on environment variables is opt-in. It's off by default. So unless you specifically checked that box when you added your API key, your secret is stored as a standard variable and was potentially exposed in this breach. For a newb like me, this was a wakeup call. When you add the new keys, check the "Sensitive" box. This encrypts the value at rest and hides it from the dashboard. There's no reason not to do this for anything secret.

**Audit your integrations.** Go through your Vercel project settings, your GitHub org, your Google Workspace. Remove any third-party OAuth apps you don't actively use. If you don't recognize it, revoke it.

**Watch your logs.** For the next few weeks, keep an eye on your API usage dashboards. Unexpected spikes or unfamiliar IP addresses hitting your endpoints are signs that a leaked key is being used.

**Check your billing.** Set up billing alerts on any service where a stolen API key could generate charges. Google Cloud, AWS, Resend, whatever you're using. A $5 alert is cheaper than a $500 surprise.


## The Genuine Geek Take

This is the reality of modern development. Your app can be perfectly secure and still get exposed because a tool three layers removed from your code got compromised.

I did everything right with High Octane HQ. My code is clean. My authentication is solid. But I stored an API key in a Vercel environment variable without checking a box, and now I'm rotating credentials on a Saturday night because an AI startup I've never used got breached.

The lesson isn't "don't use Vercel." Vercel is a great platform and they handled the disclosure well. The lesson is that every integration is trust, and trust is an attack surface.

Mark your secrets as sensitive. Rotate your keys regularly. Audit your third-party access. And maybe, just maybe, think twice before clicking "Authorize" on the next AI tool that promises to make your workflow 10% faster.

My keys are rotated. My app is running. My Saturday night is gone. But at least nobody is running up my Gemini bill.
