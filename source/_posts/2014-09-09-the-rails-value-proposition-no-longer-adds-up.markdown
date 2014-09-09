---
layout: post
title: "The Rails Value Proposition No Longer Adds Up"
date: 2014-09-09 09:28:57 -0400
comments: true
categories: rails
---

In 2005, [Ruby on Rails][rails] was a [breath of fresh air][blogin10],
and brought a revolution in how we build applications on the web. It
had cutting edge ideas, and real solutions to the problems people were
facing at the time. That was 8 years ago. If rails were to launch in
todays world, would anyone even notice?

## What makes rails amazing

In 2005, most people making (serious) web applications were doing it
using [Java][java] and [struts][struts]. Rails changed that, and it
did that by being amazing.

- [Convention over configuration][coc]. Instead of spending your first
  weeks building structure, configuring infrastructure, and arguing
  about how to architect your application, you have a fully functional
  stack ready to go in seconds.
- Great HTML generation. Rails has “AJAX” out of the box, without
  having to build reams of nasty javascript yourself. It also has form
  helpers, which make HTML make a bit more sense. It uses the
  philosophy of paving over the rough parts of web technology when it
  is possible, giving you more understandable and consistent mental
  models to work with.
- Rails ships with a test suite built in, and ways to test every layer
  of the application.
- Rails lets you quickly generate a scaffolding to give you a
  functional base to start iterating on in seconds.
- Rails has [plugins][rubygems] for pretty much all problems you will
  ever run into with web development.
- Rails uses [Ruby][ruby], which is a beautiful OO language, FAR more
  powerful than Java.

This is a pretty impressive list, many of these features were down
right revolutionary when they came out. The only serious downside, is
that rails is slow as a dog and eats ram like potato chips. But hey,
what is more expensive, building new features, or adding server
hardware? Adding more servers is a great problem to have, it means you
have a lot of clients giving you money who need service. Rails and
ruby are _Fast Enough_.

## Node.JS… the first cracks

In 2005, [AJAX][ajax] was a brave new world. “Smartphone” still meant
either [Blackberry][bb], or [Windows Mobile 6][winmo]. By 2008, things
were starting to change. “Normal” people were interacting with online
services constantly throughout the day, no matter where they were.

[Node][node] arrived with a bang. It had the right capabilities at the
right time.

- Node is simple, and allows you to expose blocking services to the
  web extremely easily.
- Node is fast, and non-blocking, allowing you to leverage some of the
  [more interesting][websocket] [features][sse] available in modern
  browsers.
- Node is written in JavaScript, not as well designed a language as
  ruby, but faster to build things with than Java, and known well by a
  large percentage of web developers. JavaScript is asynchronous at
  its core, and cheap asynchrony is what enables us to build the type
  of things we are building today.

You could still make an argument for rails, in that it was a very good
_framework_, while node takes more of a routing library approach to
building web applications. But even with rails maintaining a lot of
relevance, there was quite a big “brain drain” from the rails world to
the node world.

## Go and Clojure, where we are today.

We are steadily approaching 2015, and the world of web application
development is continuing the steady shift that has been happen for
the last 7 years. Even though JavaScript allows for fast and easy
asynchrony, being limited to the reactor pattern can make certain
types of problems quite challenging. JavaScript isn’t the greatest
language at building large apps, and things like visibility, tuning,
and stability are forcing people to look for alternatives. The folks
at the cutting edge of the field are starting to move to alternatives,
and are finding them in one of two places — Google’s [golang][go], and
[Clojure][clojure], a lisp dialect for the JVM.

Both of these are incredible languages for many reasons, two key
things they have in common is they are both exceptional at
asynchronous programming, and they are both very, very fast.

Let’s revisit the value proposition of rails.

- Convention over Configuration. It turns out the world hasn’t stood
  still. Smart defaults and sane conventions are the norm in web
  frameworks today. Java still kind of sucks, but
  [Java 8 with the Play! framework][playjava] is actually not that far
  behind the Ruby on Rails experience in developer productivity.
- The only people still doing HTML generation for a new application
  nowadays are folks building web “sites” instead of web “apps”. And
  even there, a good front end developer will be frequently asking for
  APIs over templated HTML.
- Testing has taken the world by storm. People don’t talk about _if_
  they test, they talk about _how_ they test.
- Maybe it is just folks I know, but experienced ruby developers tend
  to wince nowadays when opening a colossal [Gemfile][gemfile] in a
  rails app for the first time. Each gem you add will change rails,
  sometimes in a quite unexpected way. Not only that, but many are
  poorly supported, and it is extremely rare to find one with
  documentation. (beyond a README and method signature stubs)
- Ruby is no longer in competition with Java. It is in competition
  with other languages as productive and powerful, if not more so.

And what about our big downside of performance? It turns out
performance is extremely, sometimes vitally important for us to build
the services we are asked to build today.

## What is so good about these other platforms?

It is awesome to be able to build an application that crunches
reports, and give visibility into its data on demand. What is better
is an application that tells you about things you care about before
you even ask. Being able to push messages to your clients is an
amazingly powerful thing, and it is available today, on mature, well
tested platforms.

The other point is that performance really does matter in web
development. A company who spends
[a fraction of the cost on hardware][webappperf] is going to have
higher margins, and be able to buy more / better developers. When
rails was so far beyond its competition in terms of productivity, that
tradeoff was worth it. Nowadays, rails has serious competition in
terms of easy of use and productivity, and that tradeoff is very hard
to still justify.

## It no longer adds up.

Rails is not a terrible framework, but its time has passed. There are
a lot of folks with a heavy rails investment, it probably doesn’t make
sense to move off of the platform for them, and they are the ones who
will keep the eco-system moving. But for new development, I think
rails should no longer be in the running. You are limiting the
capabilities and future of your product, and not getting enough in
return.


[rails]: http://rubyonrails.org/
[blogin10]: http://www.youtube.com/watch?v=Gzj723LkRJY&feature=youtu.be
[java]: http://www.oracle.com/technetwork/java/index.html
[struts]: http://struts.apache.org/
[coc]: http://en.wikipedia.org/wiki/Convention_over_configuration
[rubygems]: http://rubygems.org/
[ruby]: https://www.ruby-lang.org/en/
[ajax]: http://en.wikipedia.org/wiki/Ajax_(programming)
[bb]: http://mobilesphonez.blogspot.ca/2011/12/blackberry-models-pictures.html
[winmo]: https://www.google.ca/search?q=windows+mobile+6&es_sm=119&tbm=isch&tbo=u&source=univ&sa=X&ei=A3QOVKLEIMGRgwTGkoHoCg&ved=0CCcQsAQ&biw=1585&bih=1164
[node]: http://nodejs.org/
[websocket]: https://developer.mozilla.org/en/docs/WebSockets
[sse]: https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events
[go]: http://golang.org/
[clojure]: http://clojure.org/
[playjava]: https://www.playframework.com/
[gemfile]: http://bundler.io/
[webappperf]: http://www.techempower.com/benchmarks/#section=data-r9&hw=peak&test=query
