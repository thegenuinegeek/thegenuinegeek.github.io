---
title: "Building High Octane HQ: A Car Community Platform from a Guy Who Isn't a Developer"
description: "I'm building a platform to fix how car people find events, showcase builds, and connect with their local scene. Here's why, how, and what's next."
pubDate: 2026-04-20T14:00:00
tags: ["side-project", "cars", "app-development", "opinion"]
image: "/images/highoctanehq-car-show-where.jpg"
share: true
---

The car community has a platform problem.

Events are scattered across Facebook groups that nobody checks unless their wife tags them in something. Car meets get posted as flyers on Instagram stories that disappear in 24 hours. Club info lives on forums that haven't been updated since 2019. And the only way to find out what's happening this weekend is to text the one guy in your crew who somehow always knows.

I asked a tester recently about using Facebook to find car events. His answer: "I only get on there for cars and when my wife tags me in something."

That's the whole problem in one sentence. The car community lives on a platform nobody wants to be on, because there's nowhere else to go.

So I'm building somewhere else.


## What High Octane HQ Is

[High Octane HQ](https://highoctanehq.com) is a car community platform built around one core idea: make it dead simple to find local events, see who's showing up, and showcase your build.

The centerpiece is what I'm calling the Digital Car Show. When you register for an event, your vehicle shows up in The Paddock, a public list of who's bringing what. Think of it as the car show field before you get there. You can browse the registered vehicles, see the builds, and decide if this is your kind of event before you ever leave the house.

This solves the "empty parking lot" problem that kills car meets. You've been there. You drive 45 minutes to a meet that got hyped on Instagram, pull in, and there are six cars in a Walmart parking lot. With The Paddock, you see exactly what's registered. Real vehicles, real people, real builds. That visibility creates the FOMO that drives actual attendance.

Beyond events, the platform has groups for car clubs and crews to organize together. Activity feeds. Build updates so you can follow someone's project over time. Sponsor and vendor application workflows with shareable URLs so organizers can manage their events without a spreadsheet.

And because nobody wants to type in event details manually, I built AI-powered event creation. Organizers upload their flyer image and Gemini extracts the event name, date, time, location, and details automatically. Lower friction means more events on the platform, which means more value for everyone.

The whole thing is a Progressive Web App, so it installs from the browser like a native app. No App Store. No Play Store. Just open the site, tap install, and it's on your home screen.


## How I Got Here

I need to be honest about something. I'm not a developer.

I'm a Professional Services Manager at an IT company. I manage a team of cloud engineers. I spend my days in meetings, reviewing metrics, and coaching people. My technical background is in infrastructure, not software development.

I started this project to learn. I wanted to understand GitHub, the software development lifecycle, and what it actually takes to deploy a real application end to end. I picked Next.js because it's what the industry is building on. I found Supabase for the database because Postgres is solid and Supabase makes it approachable. I deployed on Vercel because it made shipping almost frictionless.

What started as a learning exercise turned into something real. The tools are that good now. Supabase handles auth, database, and storage. Vercel handles deployment. Tailwind handles styling. And Claude Code has been my development partner through all of it, helping me plan features, write code, debug issues, and ship iteratively.

I'm a solo builder with an AI copilot, building something for a community I've been part of for over 20 years. It's not backed by a startup. It's not funded. It's a side project built after bedtime by a dad with a project car and too many ideas.


## Where It Stands

The platform is in alpha right now with a small group of real users. Friends, mostly. People I trust to break things and tell me about it.

The feedback so far has been encouraging. People love the idea. Everyone agrees that the car community needs a dedicated place to find events that isn't Facebook. The Digital Car Show concept resonates because everyone has driven to a dead meet and everyone hates it.

But I'm at a point where I need to be careful.

It's easy to stay in builder mode forever. Keep adding features. Keep polishing. Keep finding reasons not to put it in front of strangers. I wrote about [the voice in my head](/workbench/008-the-guy-who-says-not-enough) that says things aren't ready yet. That voice is loud when it comes to this app.

The truth is, I don't know what the market actually wants yet. I know what I think it wants. I know what my friends say when I show them something I built. But I don't know what an event organizer in a city I've never been to needs. I don't know what a car club president's actual pain points are. I don't know what would make someone switch from the Facebook group they've been using for five years.


## What's Next

I'm shifting from builder mode to listener mode.

I've been reading The Mom Test, which is about asking questions that give you real answers instead of polite encouragement. The next phase is talking to organizers, drivers, and vendors I don't already know. Understanding their workflow. Finding out where the real friction is, not where I assume it is.

The features I build next should come from those conversations, not from my feature backlog at midnight.

Eventually, the platform needs to connect sponsors and vendors with organizers. That's where the business model lives. But that's down the road. Right now, the priority is making the core experience good enough that people come back on their own.


## The Genuine Geek Take

I've been in the car community since I was 15 years old. I've owned the same Trans Am for over 20 years. I've been to the meets, the shows, the cruises, the forums, all of it. The community is incredible. The tools are not.

Building High Octane HQ has taught me more about software development in a year than I learned in a decade of IT management. It's taught me about product thinking, user experience, and the gap between "I built a thing" and "people actually use the thing."

It's also taught me that the hardest part isn't the code. It's the courage to put it out there and ask people what they think.

So I'm asking.

What would make you actually use a platform like this? What's missing from how you find and share car events today? What would get you off Facebook and onto something built specifically for the car community?

Check it out at [highoctanehq.com](https://highoctanehq.com) and tell me what you think. I'm building this for the community, and the community should shape what it becomes.
