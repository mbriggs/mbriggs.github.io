---
layout: post
title: "The Many Faces of Ruby Callables"
date: 2012-05-05 15:58
comments: true
categories: ruby
---

One of the most valuable ideas from functional programming is the idea of _Higher Order Functions_, or functions that take functions as an argument. It is such a good idea that it has become part of pretty much every modern language, whether functional or not. Amoung the OO imperative languages that have embraced this idea, the ruby community has probably gone the furthest, where it is the first tool a library writer will reach for more often then not. 

The language feature required for this style of programming is known as _first class functions_, meaning functions that can be defined as a variable, passed around, and called by other parts of code. Ruby has four constructs for this, which are all similar, but have slight differences.

The Block
---------

The idea behind blocks is sort of a way to implement really light weight strategy patterns. A block will define a coroutine on the function, which the function can delegate control to with the yield keyword. We use blocks for just about everything in ruby, including pretty much all the looping constructs. Anything outside the block is in scope for the block, however the inverse is not true, with the exception that return inside the block will return the outer scope. They look like this

{% codeblock lang:ruby %}
def foo
  yield 'called foo'
end

#usage
foo {|msg| puts msg} #idiomatic for one liners

foo do |msg| #idiomatic for multiline blocks
  puts msg
end
{% endcodeblock %}

Proc
----

The best way to think of a proc is that it is the more general form of a block. A block is tied to a specifc function (the whole coroutine thing), while a proc is just a variable. This means that you can easily convert a block to a proc.

An interesting use is that you can pass a proc in as a replacement for a block in another method. Ruby has a special character for proc coercion which is `&`, and a special rule that if the last param in a method signature starts with an `&`, it will be a proc representation of the block for the method call. Finally, there is a builtin method called `block_given?`, which will return `true` if the current method has a block defined. It looks like this


{% codeblock lang:ruby %}
def foo(&block)
  return block
end

b = foo {puts 'hi'}
b.call # hi
{% endcodeblock %}

To go a little further with this, there is a really neat trick that rails added to `Symbol` (and got merged into core ruby in 1.9). That `&` coercion does its magic by calling `to_proc` on whatever it is next to. So adding a `Symbol#to_proc` that calls itself on whatever is passed in lets you write some really terse code for any aggregation style function that is just calling a method on every object in a list.

{% codeblock lang:ruby %}
class Foo
  def bar
    'this is from bar'
  end
end

list = [Foo.new, Foo.new, Foo.new]

list.map {|foo| foo.bar} # returns ['this is from bar', 'this is from bar', 'this is from bar']
list.map &:bar # returns _exactly_ the same thing
{% endcodeblock %}

This is fairly advanced stuff, but I think it illustrates the power of this construct.


Lambdas
-------

The purpose of a lambda is pretty much the same as the first class functions in other languages, a way to create an inline function to either pass around, or use internally. Like blocks and procs, lambdas are closures, but unlike the first two it enforces arity, and return from a lambda exits the lambda, not the containing scope. You create one by passing a block to the lambda method, or to -> in ruby 1.9

{% codeblock lang:ruby %}
l = lambda {|msg| puts msg} #ruby 1.8
l = -> {|msg| puts msg} #ruby 1.9

l.call('foo') # => foo
{% endcodeblock %}

Methods
-------

Only serious ruby geeks really understand this one :) A method is a way to turn an existing function into something you can put in a variable. You get a method by calling the `method` function, and passing in a symbol as the method name. You can re bind a method, or you can coerce it into a proc if you want to show off. A way to re-write the previous method would be

{% codeblock lang:ruby %}
l = lambda &method(:puts)
l.call('foo')
{% endcodeblock %}

What is happening here is that you are creating a method for puts, coercing it into a proc, passing that in as a replacement for a block for the lambda method, which in turn returns you the lambda. One thing I often use this for is debugging in concert with tap.

{% codeblock lang:ruby %}
[1, 2, 3].map {|i| i * 2}.reduce(:+)
{% endcodeblock %}

This code maps an array of integers to an array of integers that have been doubled, and then sums them. If you want to see the result of the map, you can do something like this

{% codeblock lang:ruby %}
[1, 2, 3].map {|i| i * 2}.tap(&method(:puts)).reduce(:+)
{% endcodeblock %}
    
`tap` will yield the thing that it is called on to a block, and then return the original thing. So what I am doing is saying turn `puts` (which takes a single argument) into a method, coerce it into a block, and give it as the implementation for `tap`, meaning just puts out the value. Since tap returns the original thing, the rest of the method chain will be undisturbed.

## Going Deeper with &:symbol

Lets say you are really digging the trick of `&:sym`, and you have a case where the block is going to yield additional arguments, but you actually WANT those arguments to be passed in as well when the `Obj.send :sym` happens. `Symbol#to_proc` is basically implemented like this

{% codeblock lang:ruby %}
class Symbol
  def to_proc
    Proc.new { |obj, *args| obj.send(self, *args) }
  end
end
{% endcodeblock %}

So, `&:sym` is going to make a new proc, that calls `.send :sym` on the first argument passed to it. If any additional args are passed, they are globbed up into an array called `args`, and then splatted into the `send` method call.

## Ruby is pretty awesome

A lot of these capabilities exist in other languages, but very few imperative OO communities have run with them the way that rubyists have. A deep understanding of the tools available is an important part of any ruby developers journey to becoming an expert at the language. Back when I was looking for some new language to try and was trying to decide whether to roll with ruby or python first, rubys block obsession was what made me go ruby.
