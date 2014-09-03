---
layout: post
title: "First Impressions: Using Clojure at Work"
date: 2014-09-03 09:31:47 -0400
comments: true
categories: clojure
---

TL;DR: I am a developer with a Java / C# / JavaScript / Rails background, and am building a small piece of infrastructure with Clojure at work. So far it has been a joy, and exceeded expectations.

I feel like I need to set the stage for this blog post. The first Clojure book I read was [Stuart Sierra’s][ssierra] excellent [Programming Clojure][pClojure] book back in 2009. At that point I had zero professional experience with functional, dynamic, or declarative styles of programming, and Clojure blew my mind. It fit well with how I like to think about programming, and shaped a lot of my ideals about the properties of good code.

Soon after, I left the C#/Java world behind, and worked at a company doing enterprise Ruby on Rails. Clojure helped me understand a lot of what ruby was trying to accomplish. It also paved the way to using [emacs][emacs], and learning [elisp][elisp]. During this time, I also became a card-carrying member of Rich Hickey’s cult of personality. It is hard not to hero worship the guy, after listening to him talk about [how he thinks about big problems][hdd], or [how he defines simplicity, and advocates its usage][sme]. I think [most of his talks][rhickeytalks] should be mandatory for people practicing software development, they are just that good.

So this is not from the perspective of a total newcomer to Clojure. This is from the perspective of a developer who has used rails for years, and yearned to be working on the other side of the fence.

## “But who wants to deal with all those parenthesis?”

This has been the mantra of the lisp hater for the last 50 years. [Lisp doesn’t look like anything else out there][xkcd], and has huge amount of parens as its primary form of syntax. This property may be off-putting at first, but it turns out that lisp parenthesis are a problem that has been solved pretty much completely. Once you get used to them and the tools which exist to interact with them, eventually you miss them when they are not there in other languages.

### Only read the opening parens

There is a reason that people stack up all the closing parens at the end, because they are there for the [lisp reader][reader], and for your editor. Lisp strikes an amazing balance between being very terse, and being extremely explicit. Balanced parens are a big part of what allows for that.

### Learn how to read code “inside out” at the same time as reading it “outside in”

I found this the biggest hurdle when learning lisp. Logically, code is structured outside in, but it will execute inside out. This is “normal” as programming languages go, what isn’t normal is that idiomatic Clojure is built using nested expressions — a [declarative style of programming][declarative]. [Python comprehensions][comprehensions] are a similar thing, you need to learn how to read it properly. Before you do that, its foreign gibberish. Afterwards, they become a great, concise way to express common code.

### Use something capable of structural editing

Your choice of editor is extremely important here. What you want is something that will allow you to extend / retract the scope of an s-expression (depth editing), enforce paren balancing, allow you to select your current expression easily, split it apart / splice it together, etc. If you have these capabilities ([structural editing][structural]), then all those parens are a joy to work with. If you don’t have them, they will be the chore that they appear to be at first glance.

This may seem to be a pain at first, but proper tooling makes it a more joyful experience to work with parens then without them.

If you are looking for an IDE, [cursive][cursive] seems to be the best bet. If you are using [emacs][emacs], its [paredit][paredit] or [smartparens][smartparens]. If  you are using [vim][vim], it is [paredit.vim][parvim].

## Using Clojure at work

There is a huge difference using something from a hobbyist point of view, and using it 8+ hours a day. Some of my challenges were

- logging
- wrapping my head around “interactive development”
- common “new platform” issues (basic syntax / idioms that need to be fully grasped)

I am building a fairly simple application which watches the end of a queue, and perform actions on external resources based on the message. It is currently sitting at ~400loc, and is the sort of thing where if it breaks 1000loc it will be way overdue to be broken apart into smaller apps.

It is not that much output for the time I put into it, but it was my first time building something serious on the platform, as well as the first time I worked with AMQP.

### Logging

Clojure inherits Java’s insanely complex logging legacy, and understanding what the hell is going on took me easily more then half a day. At first, there was no logging frameworks for Java, so IBM released log4j, which is incredibly powerful, and does pretty much everything you could want from a logging framework. Sun didn’t really like how everyone was using a vital piece of infrastructure like logging from IBM, so they built java.util.Logging, not quite as good, but built into the platform.

Since logging is something that things like libraries need to do quite frequently, this split become quite nightmarish. So people started using a logging abstraction frameworks, the most recent of which is slf4j.

Now, Java interop in Clojure is absolutely fantastic, and it is not uncommon to use Java libraries directly. So Clojure adds another layer to the onion — clojure.tools.logging, which is an abstraction layer over the java abstraction layers…

Long story short: if you are building a new project, what you want is [clojure.tools.logging][ctlogging] with [slf4j][slf4j] and [logback][logback]. This is the current “recommended stack”, and is incredibly powerful, if quite complex.

### Interactive Development

Lisp developers practice something called “interactive development”, where they are constantly interacting with a running instance of their application. If you are a rails developer, you may be saying “no big deal, we have rails console!”. Imagine a console that is always attached to the development _instance_ of your application, not as its own process. Now, imagine your editor could send it commands, like “run all the tests”, or “load changed code” or “reload application configuration”, and it would perform these tasks _instantly_. Imagine your editor could query the repl very quickly and efficiently for auto-completions and for symbol locations in the codebase. Imaging your editor could ask it for function documentation and method signatures. Imagine that the repl was embedded into your editor, living side by side with your code, always ready to give immediate feedback on the code you wrote or are debugging.

This is interactive development.

Modern IDEs approach this level of quality of life, but only for languages which are friendly to tooling. But they tend to lose a lot of their power, and sometimes downright lie when it comes to dynamic languages.

#### Interactive Development vs TDD

Clojure folks are known for their disdain of Test Driven Development. TDD comes at a high cost; writing, running, and maintaining a comprehensive test suite can become a substantial portion of the cost of building and maintaining an application. But that test suite gives you a benefit that makes it worthwhile, it allows you close to instant feedback on whether a change did what you thought it was going to do.

Getting that feedback is extremely difficult in Object Oriented languages. The reason for that is that most methods interact with state, so to reliably get feedback on a change, you need to get feedback on that function running against an object with as many variations of state it is likely to have.

By contrast, in clojure you usually have a lot of small functions that take inputs and return outputs, a few functions that perform side effects, and then “abstraction” functions which tie everything together and do something interesting. Because the pieces are much more granular, and state is treated as a dangerous property rather then tied into the most fundamental building blocks of the language, it turns out getting quick feedback on a function is typically incredibly simple.

Here is an example of interactive development of a small function which takes a clojure keyword and turns it into something ruby would expect from a hash key

{% codeblock lang:clojure %}
user> (message/rubyify-keyword :hi-buddy)
::hi-buddy
:reloading (poops.message poops.message-test poops.core poops.core-test user)
user> (message/rubyify-keyword :hi-buddy)
":hi_buddy"
:reloading (poops.message poops.message-test poops.core poops.core-test user)
user> (message/rubyify-keyword :hi-buddy)
"hi_buddy"
{% endcodeblock %}

that whole process took in the range of 5-10 seconds, which is FAR less then I would expect if I had test driven it. What I am missing from this is that if I want to test it in the future, I have to repeat what I wrote in the repl. But that is totally fine, this function has no dependancies (which unit tests suck at testing anyways if they live outside the class under test), and it either works or it doesn’t work.

This this is not to say that unit tests have no place in a clojure project, or that test driving code is something which is never useful on the platform — both still have their place. But the properties of the language design coupled with the incredible power you get from interactive development changes the value proposition of using these practices for the majority of code you write.

#### Unit Testing can still make sense in clojure

So where does unit testing still make sense? It’s very easy — listen to the code! In my opinion, the prime lesson of TDD is never make a change without getting feedback on it, the tighter that feedback cycle the better. If you find it starting to be a pain to get feedback through the REPL, write a test! This is what they are good at, taking the effort away and shrinking that feedback loop.

I am far from an expert, and my view on these things will probably change over time, but these are some examples of situations where the REPL probably wouldn’t cut it.

- Functions which have a high number code paths without being “coordinators” (who should be end to end tested, not unit tested)
- Functions which perform a calculation that depends on more then a single property of their arguments. Testing these would require multiple calls for every change, probably better to automate it.
- Functions that deal with money calculations. I tend to pay attention to this type of code as much as I possibly can, because I am terrified of screwing it up.

This type of code should also be minimized, and isolated if at all possible. The ideal function takes an argument, and returns a value, it is good to keep to that ideal as much as possible.

#### Interactive Development vs Acceptance Testing

“Acceptance” testing is very different then Unit testing, but clojure has you covered here too. The `user` namespace is basically there to be decked out with functions and tools to make your life easier. In my case, I was dealing with inputs coming from a RabbitMQ queue, and outputs getting published to different queues.

Rabbit has a great feature that lets you create transient queues which disappear when the connection closes. I use those during development, and have a few helper functions which will test my whole code base.

{% codeblock lang:clojure %}
(defn watch
  []
  (core/watch-for-assets system))

(defn publish-bad-message
  []
  (queue/publish (:print-assets-q system) {:fart "butt"}))

(defn publish-test-message
  ([]
     (publish-test-message 366))

  ([id]
     (queue/publish (:print-assets-q system)
                    {:id 1 :artwork_id id :device_id 2 :product_type "type"})))
{% endcodeblock %}

Again, getting end to end feedback means typing `(watch)` followed by `(publish-test-message)` in my repl.

Unlike unit tests, this is most definitely not a scalable replacement. It will however take you surprisingly far.

### Expected “Platform Issues”

Surprisingly, the switch from Object Oriented code to clojure was quite simple for me. You end up with similar separations of code, just the code isn’t attached to the data. So an object with functions maps easily to a namespace with functions which operate on similar (or the same) data-structures.

Most of my time dealing with the new platform was either in basic syntax (there is no implicit `do` in a `catch` expression, anything after the first expression is treated as `finally`, as an example. Or `slurp` and `spit` only work with text, not binary data).

Using [Langohr][langohr] for [RabbitMQ][rabbit] probably added some time, since it doesn’t try to hide [AMQP][amqp] behind layers of sugar. But at this point I feel pretty comfortable in my understanding of what is going on, so that was probably time well spent.

## Overall impressions

I went into this **extremely** prepared, and very biased in favour of clojure. What I am working on will probably not be enough to hit the major pain points of using the language, so I am still in the “honeymoon” phase of using a new platform.

That being said, I have found the development experience to be absolutely delightful. I find in general, clojure libraries, and developers, seem to be very high quality. My big take away is how profoundly awesome interactive development can be. I am a big fan of testing, and have spent a large part of my career learning how to do it well. As someone with a huge investment in testing culture, I would call life without the constant need to write tests downright freeing.

[ssierra]: http://stuartsierra.com/
[pClojure]: https://pragprog.com/book/shcloj/programming-Clojure
[hdd]: http://www.youtube.com/watch?v=f84n5oFoZBc
[sme]: http://www.infoq.com/presentations/Simple-Made-Easy
[emacs]:http://www.gnu.org/software/emacs/
[elisp]:http://en.wikipedia.org/wiki/Emacs_Lisp
[rhickeytalks]:http://thechangelog.com/rich-hickeys-greatest-hits/
[xkcd]:http://xkcd.com/297/
[reader]:http://en.wikipedia.org/wiki/Lisp_reader
[declarative]:http://en.wikipedia.org/wiki/Declarative_programming
[comprehensions]:http://www.pythonforbeginners.com/basics/list-comprehensions-in-python
[structural]:https://cursiveclojure.com/userguide/paredit.html
[cursive]:https://cursiveclojure.com/
[paredit]:http://clojure.jr0cket.co.uk/perfect-environment/paredit-guide
[smartparens]:https://github.com/Fuco1/smartparens
[vim]:http://www.vim.org/
[parvim]:https://github.com/vim-scripts/paredit.vim
[ctlogging]:https://github.com/clojure/tools.logging
[slf4j]:http://www.slf4j.org/
[logback]:http://logback.qos.ch/
[langohr]:http://clojurerabbitmq.info/
[rabbit]:http://www.rabbitmq.com/
[amqp]:http://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol
