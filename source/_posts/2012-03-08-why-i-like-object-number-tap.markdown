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

Typically, I wont use `tap` unless there is a high degree of locality, and you are talking about left-side = right-side type code. So

{% codeblock lang:ruby %}
def build_foo
  Foo.new do |f|
    f.bar = "Hi"
    f.baz = "Baz"
  end
end
{% endcodeblock %}

In this case I think Gary's first objection doesn't really apply -- the name in this case is nowhere near as important as the thing that I am building. So it is actually a benefit to see that on the left side rather then the right, since the placeholder var is inconsiquencial. Additionally, with a glance I am able to tell the purpose of all the code in that level of indentation. The third benefit is that the block evaluates to the object being built. I like most things in ruby, but I find implicit returns that are not part of a larger expression to be sort of ugly. By that I mean that something like this I find the implicit return elegant

{% codeblock me likey lang:ruby %}
def foo
  some_predicate? ? "Hi!" : "Bye"
end
{% endcodeblock %}

where something like this, I find it ugly

{% codeblock ugh lang:ruby %}
def foo
  thing = build_thing
  thing.some_method
  thing
end
{% endcodeblock %}

and will usually do an explicit return, even though it is not strictly nessicary. 

This is something that I think falls squarely into personal style, but because of where I fall on that, `Object#tap` to me makes the pattern of initialization of an object more elegant.

Another interesting thing to note is that in rails-land, it is very common to use hash initializers for this kind of thing. While that syntax is very minimal, I actually prefer the `Object#tap` way, because I find it gives a clearer separation between arguments and that kind of initialization pattern.

## Not Hatin On Gary

The dude is awesome, and everyone who is a professional ruby developer really should subscribe to his podcasts. IMO the guy is a master of OO, and his screencasts are far more valuable then 10$ and 15mins of your life per month.
