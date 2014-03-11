---
layout: post
title: "How I Learned to Stop Worrying, and Love Dart"
date: 2014-03-10 21:04:28 -0400
comments: true
categories: dart
---

[Darts][dartlang] history is a little spotty, to put it lightly. When it came out, Google billed it as the JavaScript killer (which it's not), followed by saying it's not the JavaScript killer, it's going to be the dominant mobile platform. Then it wasn't about mobile, or replacing JS anymore, it was a compile-to-js language, and that would be its future.

As someone who tries hard to stay ahead of the curve when it comes to web technology, it was on my radar, but I wasn't terribly interested. It is not exactly an exciting or super interesting language (like [clojurescript][cljs] or [roy][roy]), and it seemed to have a questionable future -- Google itself didn't seem to know what it was good for. Finally, the JS interop seemed kind of "meh", so using it pretty much meant giving up on the JS eco-system.

Fast forward a few years, and it's situation is dramatically different. It managed to break 1.0, which is always a good sign for a language. Google is starting to push it quite a bit internally, which means it will have an investment in its continuing growth and improvement. There are hard plans for it to get into chrome. The `dart2js` compiler is approaching vanilla javascript speeds.  And finally, you can build really cool web applications with it, as [AngularDart][angulardart] is nearing 1.0.

I think at this point, there is a good chance that dart will be a "thing". Dart killing JavaScript? That outcome is too far in the future to be predicted. But it doesn't have to kill JavaScript to develop a viable community and infrastructure of its own.

# Dart, The Language

The first thing to talk about is types. The dynamic revolution has happened, static types are definitely not "in". However, what most people rail against in type systems is essentially the Java implementation. Dart takes a very different, more tasteful approach.

First, there is no runtime type checking. The type system is only there to catch a certain class of compile time errors for you, provide documentation, and give you the tools to express protocols and interfaces explicitly. If you don't want to use static typing for something, you don't have to. In fact, the official Dart style guide says type annotations should only be used in method / class signatures. What that means is that we are going from building out documentation like this

{% codeblock lang:javascript %}
/**
 * @description
 * It foos the bar.
 *
 * @param {string} bin
 * @param {string[]} baz
 * @returns boolean
 */
function foobar(bin, baz){
}
{% endcodeblock %}

to this

{% codeblock lang:dart %}
/**
 * It foos the bar
 */
bool foobar(String bin, String[] baz){
}
{% endcodeblock %}

You are expressing the exact same information, only

- it is easier to read
- it is easier for your editor to parse
- it will throw compile time errors for you when you do something dumb

I understand that people don't want to code in Java anymore. I dig it, I don't really like the Java language either. This isn't Java, and by unilaterally panning anything with any form of static type checking, you are really doing yourself a disservice. Darts optional type system gives you another tool to help find bugs during dev mode, while maintaining the flexibility and readability of dynamic languages.

# Classes and their Interfaces

Classes are pretty straight forward in Dart. The first thing I read about them that was interesting is the way constructors are handled.

{% codeblock lang:dart %}
class Foobar {
  String foo; // class field

	// default constructor
  Foobar(){
    this.foo = "Something";
  }

	// named constructor which takes a string, and assigns it to the foo field
	Foobar.withValues(this.foo);
}

var foo = new Foobar(); // invokes the first constructor
var foo2 = new Foobar.withValues("hi!"); // invokes the second constructor
{% endcodeblock %}

The `this.foo` assignment syntax is actually really, really cool. I do my best to keep complex logic out of constructors, so this style of constructor lets me move away from `left_hand = right_hand` style code. That kind of code is pure boilerplate, and can hide a surprising amount of bugs if there is enough of it.

Since Dart does not support overloading, multiple constructors could potentially be a problem. Dart solves this with named constructors, which actually solve the issue in an interesting way. You can have multiple constructors for different purposes, and actually give a name to why you have them.

One property that is really cool about Dart classes are that they have an implicit interface. So lets say we have a `Vehicle` class, which takes an `Engine`.

{% codeblock lang:dart %}

class Vehicle {
	Engine engine;

	Vehicle(this.engine);
}

class Engine {
	start(){
		print("vroom!");
  }
}

var vehicle = new Vehicle(new Engine());

{% endcodeblock %}

Later on, you want to be able to pass different types of engines into a vehicle. There are several different ways you can go, but implicit interfaces allow you to do a type of pattern that is very similar to duck typing in dynamic languages.

{% codeblock lang:dart %}

class Vehicle {
	Engine engine;

	Vehicle(this.engine);
}

class Engine {
	start(){
		print("vroom!");
  }
}

class RocketEngine implements Engine {
	start(){
		print("to the moon!");
  }
}

var vehicle = new Vehicle(new RocketEngine());

{% endcodeblock %}

You can keep `Engine` as a basic, default implementation. By having `RocketEngine` implement `Engine`, it means that it can be used in places `Engine` can be used. This allows for a code structure that is very similar to what you would find in dynamic languages. The difference is that in Dart, if `RocketEngine` ever falls out of sync with the `Engine` interface, the type checker will let you know.

# `this` and `function`, I will not miss you at all.

One of the most irritating things about the javascript syntax is that you end up typing `this` and `function`. You type them a lot. A hell of a lot. Often, multiple times per line.

In Dart, `this` becomes optional when referring to class / instance members. Most functions you write will be methods, when you are doing anonymous functions, you can use the `() => ` syntax instead.

{% codeblock lang:dart %}
[1, 2, 3].map((n) => n * 2); //=> [2, 4, 6]
{% endcodeblock %}

# What is better then Angular? AngularDart, thats what.

AngularDart takes the good parts of angular, and cleans up some of the cruft. For example, there is a unified model for injectable components. So instead of having directives be a strange psudo-dsl, controllers be constructor functions, and services be functions that return objects, they are all implemented as classes. Each class has it's angular specific functionality configured via class annotation.

Another key difference is that instead of element and attribute directives, directives are now explicitly encouraged only for attributes. If you want to implement an element, you probably want to use the new primitive of "Component", which is implemented using web components and the shadow DOM.

AngularDart compared to AngularJS is a fairly involved topic, and I doubt I could do as good a job explaining as my friend [Victor Savkin does here][savkin].

AngularDart brings a level of practicality to Dart. It is a modern, top tier framework for building web applications in a productive and maintainable fashion. Realistically, for Dart to start gaining traction in the mainstream, this was required. Now it is here.

# Dart is here, and you should pay attention to it.

With ES6 coming down the pipe, many of the warts and problems with JavaScript will be addressed. However, many will not, as JavaScript needs to maintain backwards compatibility. However, that is not a cross that Dart has to bear, allowing for a very clean (albeit a bit boring) javascript-y language that will run in browsers. The benefits you see are in a much cleaner DOM API, promises used consistently for async, and an extensive, full featured standard library.

Dart is still not my favourite language in the world, but it is a good, consistent, clean language. Which is something we are sorely lacking in the world of the browser.

[cljs]: https://github.com/clojure/clojurescript/wiki
[dartlang]: https://www.dartlang.org/
[roy]: http://roy.brianmckenna.org/
[angulardart]: https://angulardart.org/
[savkin]: http://victorsavkin.com/post/72452331552/angulardart-for-angularjs-developers-introduction-to