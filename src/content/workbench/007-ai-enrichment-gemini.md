---
title: "Adding AI Enrichment to the Content Pipeline with Gemini"
description: "I added a Gemini-powered Lambda to my idea capture tool. Not to write for me. To kill the tedium so I can focus on saying what I actually think."
pubDate: 2026-04-02T14:00:00
tags: ["aws", "ai", "gemini", "lambda", "side-project"]
image: "/images/ai-is-a-tool-use-it-gemini-enrichment.jpg"
series: "GG Tools"
share: true
---

I built a content idea capture tool on AWS. You can read the [full build story here](/workbench/006-gg-tools-idea-capture). The short version: I type an idea into my phone, it lands in DynamoDB, and a dashboard shows me everything I haven't acted on yet.

It worked great for capturing. But capturing isn't the hard part.

The hard part is everything between "I had a thought" and "I'm actually writing about it." Sitting down, staring at a one-line idea like "blog post about AI enrichment," trying to remember what I was thinking and why I cared. Then formatting frontmatter. Then figuring out a structure. Then finally, maybe, getting to the part where I say what I actually think.

Most of my ideas die in that gap. Not because they're bad ideas. Because the tedium kills the momentum before I get to the good part.

So I added a brain.


## What Gemini Does

When I capture an idea, I can now hit an "enrich" button that sends the raw idea to a Lambda function. That function calls Google's Gemini API with the idea title, category, and any tags I added. Gemini comes back with a structured framework: a description, talking points, suggested resources, and a recommended platform.

The whole round trip takes a few seconds. The enriched version gets written back to DynamoDB and shows up on the dashboard alongside the original idea.

I also added an export function. One click and a Lambda generates the full idea as Markdown, ready to paste into my site's content directory. That's literally how this article started. I exported the enriched idea, pasted it into Claude Code, and started writing.


## The Pipeline

The workflow now looks like this:

**Capture.** Idea hits me. I open HTTP Shortcuts on my phone, type it in, send it. Five seconds.

**Enrich.** When I'm ready to think about it, I hit the enrich button on the dashboard. Gemini generates a framework I can work from.

**Export.** One click generates Markdown. I paste it into my writing environment.

**Write.** I take the framework and rewrite it in my own voice. The AI gave me scaffolding. The thoughts are mine.

That last step is the whole point.


## This Is Not AI-Generated Content

I want to be clear about something because this matters to me.

I'm not using AI to write my articles. I'm using AI to get rid of the stuff that isn't writing. The formatting. The outlining. The "what sections should this have" busywork that burns 30 minutes before I type a single real sentence.

Here's what Gemini gave me for this article:

*"Discover Genuine Geek Media's proprietary AI enrichment process and how we leverage Google's Gemini AI to transform raw ideas into compelling, high-quality content."*

That's not how I talk. That's not how anyone talks. That's how a marketing deck talks. If I published that, I'd deserve every "this is AI slop" comment I got.

But Gemini also gave me a list of talking points I hadn't thought of. It reminded me to connect this article back to the capture tool piece. It suggested structuring the pipeline as a step-by-step flow. That structural thinking saved me time and let me get to the part that matters faster: saying what I actually think about the thing I built.

The enrichment doesn't replace my voice. It removes the blank page so my voice has somewhere to go.


## The Technical Bits

The enrichment Lambda is Python 3.12, same as the rest of the stack. It reads the idea from DynamoDB, builds a prompt with the title, category, and tags, sends it to Gemini's API, and writes the structured response back.

The export Lambda reads the enriched idea and formats it as Markdown with frontmatter, description, talking points, and resource links. Clean enough to paste directly into a content file.

Both functions sit behind the same API Gateway as everything else. Same API key. Same usage plan. The Gemini API key lives in Secrets Manager alongside the Google OAuth credentials, so the total infrastructure cost went from $0.40/month to $0.80/month. Two gumballs.

OpenTofu manages all of it. One `tofu apply` and the enrichment pipeline exists. One `tofu destroy` and it's gone.


## What's Next

The enrichment prompt needs work. Right now it's generic. I want to feed it examples of my actual writing style so the frameworks it generates feel closer to how I'd naturally structure an article. Less "discover our proprietary process" and more "here's a thing I built, here's why."

Voice capture is still on the roadmap. A Telegram bot that takes a voice note, transcribes it, and auto-captures it as an idea. Combined with enrichment, I could ramble into my phone while driving and have a structured article framework waiting for me by the time I get home.

The goal has never been to have AI write for me. It's to shrink the gap between "I had an idea" and "I'm expressing my actual opinion about it." Every friction point I remove is one more article that gets written instead of dying in my head because I didn't feel like setting up frontmatter at 10pm.


## The Genuine Geek Take

There's a version of AI content creation that people are rightfully skeptical about. Paste a topic into ChatGPT, copy the output, publish it, call it a day. That's not what this is. That produces content nobody needs from a voice that doesn't exist.

What I built is closer to what I do at work every day. Identify waste, automate the tedious parts, keep the humans focused on the work that actually requires a human. At work, that means my engineers spend time on architecture instead of ticket formatting. Here, it means I spend time on opinions instead of YAML frontmatter.

The capture tool eliminated the waste of lost ideas. The enrichment step eliminated the waste of staring at a blank page. The export eliminated the waste of manual formatting.

None of it writes the article. None of it has opinions. None of it knows what it's like to play Horizon Zero Dawn in byte-sized chunks on a Steam Deck after the kids go to bed. That's my job. The pipeline just makes sure I get to do my job faster.

Two Lambda functions, one API call, and $0.40 more per month. That's the cost of never starting from zero again.
