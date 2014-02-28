---
layout: post
title: "Sometimes, It's OK to Leave a Mess"
date: 2013-04-19 15:18
author: Matt Briggs
specialstylesheet: sometimes-its-ok-to-leave-a-mess
published: true
comments: true
categories: Development
---

##Recently...

we watched the excellent lunch and learn video from [Hashrocket][1], where [Sandi Metz][2] [talks about test design][3]. While the whole video is worth watching, one thing that stood out to me was her term "Omega Mess".

The first time I heard someone refer to this concept was pairing with [Victor Savkin][4], where he referred to parts of the code as his "Dirty little secrets". While this is still my favourite name for the concept, I think Sandi's name of Omega Mess, meaning a mess that is at the end of everything, is far more apt, so I have used it ever since.

## The Boyscout Rule

[Uncle Bob][5] tells us that as professional software developers, we need to practice the Boyscout Rule, meaning always leave things in a cleaner state then when you arrive.

Imagine you are a developer, and you pick up a support task to fix a corner case bug in some crazy calculation. Now, this calculation is in a part of the application which is the stuff of legend on your team. It consists of a few thousand lines of code spread across a dozen different files with methods that have [cyclomatic complexities][6] reaching the levels of the national debt. You make a cup of coffee, put on some high energy music, and dig in.

Several hours later, you are pretty sure you understand the problem, and the interactions in code around that problem. You write a unit test to expose the issue, and go about fixing it. All you really need to do is add another `if` (in code already indented twelve levels deep), so you do it, the tests go green, and you breath a sigh of relief.

## The Choice

It is at this point the boyscout rule comes into play. You have a choice; close the task, go to a bar, and drink until you no longer remember the pain of the day, OR, using the understanding you have gained over your long day of work, try do something that will make this horror slightly less horrific.

The programmer that believes the bar is the better option is putting his short term pain ahead of the long term maintainability of the application. They will say, "I already wasted a whole day on this BS, time to move on to something new so that I can be productive!"

The wise programmer knows that typing keys is not the only measure of productivity, and by not utilizing the knowledge gained to chip away at the vital task of improving the maintainability of this core part of the application, they are basically wasting a hard days worth of work, and not moving forward on a task which could one day become so important that the business dies because of it.

## The Omega Mess

That cautionary tale may seem like I am overly stating the importance of [constant refactoring][7], but software shops fail all the time because they don't do it.

Sometimes, the costs don't work out. Sometimes, it isn't worth putting in the time to clean things up. Those cases are when you are faced with code which a) basically works, and b) has a very low probability of change. Code that fits this profile is always at the end of a chain of method calls which is why "Omega Mess" is such a great name; it is a mess at the end of all the things.

One day you will probably want to clean it up when you have the free time, but there is also a pretty good chance that the only reason this code will ever change is because it is being re-written. If you are working on a large enough app, this is a relatively common occurrence. In this situation, being a good boyscout is a bad thing; you are wasting your company's time for very little benefit, and you are introducing the possibility of regressions for very little reason.

## How to determine probability of change

This is really an experiential thing, but I would recommend asking yourself the following three questions

*Is this code stable?* Some code gets written once, and then stays the same for years. While other code gets touched every few weeks or months. An omega mess is something that doesn't change much.

*Does this code touch other code?* If your code is executing other code, there is now two possible reasons for this code to change. If the code it calls invokes other code, this can be an exponential thing. If code is not at the "end of the line", chances are, it is not an Omega Mess.

*How many places is this code called from?* An Omega Mess sits at the periphery of the system. If this code is called from 100 places in your application, it is important and needs to be fixed.

 [1]: http://hashrocket.com/
 [2]: http://sandimetz.com/
 [3]: http://vimeo.com/48106365
 [4]: http://victorsavkin.com/
 [5]: https://twitter.com/unclebobmartin
 [6]: http://en.wikipedia.org/wiki/Cyclomatic_complexity
 [7]: http://c2.com/cgi/wiki?RefactorMercilessly