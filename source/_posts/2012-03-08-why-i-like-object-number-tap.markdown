---
layout: post
title: "Why I like Object#tap"
date: 2012-03-08 01:28
comments: true
categories: ruby
---

In a recent [Destroy All Software](http://www.destroyallsoftware.com) screencast, Gary mentioned how he really doesn't like `Object#tap`. He was using it in this sort of context

{% codeblock lang:ruby %}
class StoreCache
  def self.for_term(term)
	begin
    CachedScore.for_term(term)
  rescue CachedScore::NoScore
	  RockScore.for_term(term).tap do |score|
      CachedScore.save_score(term, score)
    end
	end
end
{% endcodeblock %}

He said he didn't understand why people like that syntax so much, when you could just as easily do

{% codeblock lang:ruby %}
class StoreCache
  def self.for_term(term)
	begin
    CachedScore.for_term(term)
  rescue CachedScore::NoScore
	  score = RockScore.for_term(term)
    CachedScore.save_score(term, score)
    score
	end
end
{% endcodeblock %}

with the differences being that the name of the variable is on the left side, and the return is more explicit. I sort of get where he is coming from, but I would not use tap that way.

## What `Object#tap` means to me

I think he (and many others) see `Object#tap` as meaning "fancy method that give me a 1 character placeholder variable and implicit return". I see tap as meaning "tap into the object initialization", or more practically "This entire expression is related to object initialization."

Typically, I wont use `tap` unless there is a high degree of locality, and you are talking about left-side = right-side type code. Something like this

{% codeblock lang:ruby %}
def build_foo
  Foo.new do |f|
    f.bar = "Hi"
    f.baz = "Baz"
  end
end
{% endcodeblock %}

Building out values on an object is an incredibly common pattern that is logically a single thing. Visually, tap is grouping the code for that pattern. Also, I find it reduces density in a place where the additional verbosity really doesn't add anything in terms of clarity. At work, we are still using 1.8.7 ree, so when we need ordered hashes (often as identifiers for keys on objects), we have a lot of code that looks like this

{% codeblock lang:ruby %}
UNIT_OF_MEASURES = ActiveSupport::OrderedHash
UNIT_OF_MEASURES[1] = "Eaches"
UNIT_OF_MEASURES[2] = "Cases"
UNIT_OF_MEASURES[3] = "Pallets"
{% endcodeblock %}

I think the move from that to tap style is a significant improvement

{% codeblock lang:ruby %}
UNIT_OF_MEASURES = ActiveSupport::OrderedHash.tap |uom|
  uom[1] = "Eaches"
  uom[2] = "Cases"
  uom[3] = "Pallets"
end
{% endcodeblock %}

The last thing is the fact that its a single expression. I love implicit returns in ruby where your entire method is a single expression, it feels kind of lispy. Something like this

{% codeblock me likey lang:ruby %}
def foo
  some_predicate? ? "Hi!" : "Bye"
end
{% endcodeblock %}

However, I am really not a fan of implicit returns when you just end a function with a bare word. If you are writing imperative style of code, I think each statement should actually be a statement that says what it does. Something like this just sort of feels like a mis-use of a language feature.

{% codeblock ugh lang:ruby %}
def foo
  thing = build_thing
  thing.some_method
  thing
end
{% endcodeblock %}

This is something that I think falls squarely into personal style. But because of how I enjoy writing more expression oriented code, having an expression for a common pattern is a big plus for me.

Another interesting thing to note is that in rails-land, it is very common to use hash initializers for this kind of thing. While that syntax is very minimal, I actually prefer the `Object#tap` way, because I find it gives a clearer separation between plain old method arguments, and object initialization.

## Not Hatin On Gary

The dude is awesome, and everyone who is a professional ruby developer really should subscribe to his podcasts. IMO the guy is a master of OO, and his screencasts are far more valuable then 10$ and 15mins of your life per month.
