---
layout: post
title: "Mixins are not always a refactoring anti-pattern"
date: 2012-05-07 17:59
comments: true
categories: ruby oo
---

Steve Klabnik just posted an interesting [post about mixins](http://blog.steveklabnik.com/posts/2012-05-07-mixins--a-refactoring-anti-pattern). Steve is a really smart guy, and I usually agree with him, but I think his justification is a little bit weak in this case.

## Mixin Refactoring through Class Gutting

Oh man, he is so right that this is an anti-pattern. It happens a lot in ruby, someone says "Hey, this thing is doing too much. The only method of code reuse I really believe in is mixins, so I'll just take the implementation, and dump it into a mixin."

By doing that, you haven't decreased complexity, you have actually increased it by breaking locality. Steve introduces the idea of reducing complexity through ecapsulation (right on), and talks about Data Mapper and Repository. Very OOP, and great solutions, especially in larger systems. Still diggin what Steve has to say.

## Method Count as a metric of complexity

Here is where we part ways. Lets take the Enumerable module in the ruby standard library. It adds 94 methods on to a given thing, with the requirement that that "thing" provides an each method.

But enumerable is an "idea", and if something is enumerable, you sort of know how to work with it -- through those 94 methods. 

Steve talks about how encapsulation reduces complexity of the implementation, well Enumerable encapsulates the "idea" of enumerating. So that means that when providing a public interface, a data structure can focus on its fairly simple implementation, and only provide the most low level and simplist of methods (each), while bringing in Enumerable and let it do the heavy lifting to give the rich interface that people expect from a ruby data structure.

How is that increasing complexity? When I look at Enumerable, it is talking about a single concept. When I look at array, it is talking about a single concept. The only thing I can change to break the implicit protocol between the two is to break the each method at a fundamental level.

Composition would have been a terrible choice here, I think providing 94 stub methods and an internal enumerator object would just increase the complexity, not reduce it. Providing an enumerator as an external thing would have made the api much more of a pain to work with. Inheritance would be better then composition or separation, but the problem is that Array is a datastructure, it is not an "Enumerable". Enumeration is an ability, not the root of a concept. I think the best choice here is mixin, and that it is fairly obviously the best choice. And I think most people who have implemented data structures in ruby would agree.

So what we have is something that is close to inheritance, but more of a "vertical slice" of functionality. An "ability" rather then a "thing". This is what mixins give up, the ability to model "abilities" in a concise way. 

## What is complexity

Rich Hickey defines complexity as an interleaving of ideas. I think that is a great definition. In the case of Enumerable, you are providing significant functionality through providing a simple implementation, the only interleaving is that each method. Sure, the runtime method count is 94 methods higher, but who cares? When you are calling methods on array, you are thinking of it as a single thing. When you are maintaining array, you don't have to worry about any interations with enumerable outside of each.

I think that the amount, and shape, of a mixins interaction with its containing class is a good measure of complexity. The amount and shape of a classes interactions with the internals of a mixin is a great metric of complexity. The only thing the number of runtime methods is telling you is that maybe you should be looking at those other things, which isn't that great a smell. 

### The important thing here is interactions.

Large classes often become complex. But it isn't a property of their runtime method count, or even inherant to their lines of code. It is because large classes and large methods tend to interact in ways that are hard to understand. Small classes can get complex too for the same reasons, but the larger the class, the easier it is to get to that place.

## Why "Gut the class and dump" it into a mixin doesn't work

It doesn't work because you haven't tackled the complexity of the interactions in the code. Maybe it needs to get pulled into another class, maybe methods need to get merged together. Or maybe you are just talking about an inherantly complex thing, and doing the earlier things will make it worse. In any case it is not the runtime method count that will tell you this, it is analysis of how the class interacts with itself and others.

## Complexity Smells

Steve wasn't writing about complexity smells in a general way, but since I have spent so much time talking about what isn't a smell, I sort of feel compelled to talk about what is. I am sure he would agree with most, if not all of the following

- When a mixin mucks with class internals. 
- When a mixin mucks with other mixins. 
- When you read the inheritor of a class, and can't understand it without reading its parent
- When you read an inherited class, but can't understand it without its children
- When there are so many interactions with other things that you have to read many classes to understand how a single thing works
- When classes do too many things
- When classes have too many dependancies
- When classes are aware of too many other objects
- When too many other objects are aware of a class

And that is just the tip of the iceburg. I would say that a significant percentage of our job is managing complexity in code, it is a huge and nuanced topic. Mixins are also not a simple thing, and are extremely easy to use in the wrong ways.