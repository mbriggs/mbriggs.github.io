---
layout: post
title: "Understanding Angular Directives"
author: Matt Briggs
date: 2014-01-14 11:34
comments: true
published: false
categories: [angular javascript]
---

Angular is the hottest JavaScript framework out there right now, and for good reason. It is a very powerful, flexible, and well designed framework for building web applications. However, like many projects, one of its major weaknesses is both the quantity, and quality, of its documentation. Because of that, Angular can be exceptionally difficult to learn.

Thankfully, a lot of Angular is pretty straightforward once you have a basic understanding of the concepts and some of the pitfalls. However, there is one topic that is definitely *not* straight forward at all, and is essential for any non trivial Angular work. That is directives.

This blog post is written with the assumption that you know basic Angular knowledge (things like `ng-if`, what a service is, what scope is). Also, when I talk about HTML, I am referring to the markup language, when I talk about the DOM, I am referring to an active, living tree of UI elements that is running in a browser.

## What is a directive?

The tagline of Angular is "Teach HTML New Tricks", and directives are the mechanism you use to make that happen. I would even go so far as to say that directives *are* Angular, the rest of the framework (with very few exceptions) is there to support the usage of directives.

In a more practical sense, directives are HTML artifacts which handle all DOM manipulation and interaction. This can be everything from jQuery style "DOM enhancement" code, to HTML control flow (like `ng-if` or `ng-switch`), to data binding (`ng-bind` / `ng-model`). Unfortunately, with that power and flexibility comes a substantial amount of complexity.

## Comparisons to Backbone Views

The idea of a directive sort of lines up with a Backbone view, in that it is the place that you put code that interacts with the DOM. 

A key difference, is that a Backbone view usually has a one to one relationship with a DOM element. In the case of Angular, it is quite common for multiple directives to be attached to the same DOM element. 

Another difference is that in Backbone, there is a substantial amount of code required to wire together, views, the DOM, and the models/collections. In Angular, the wiring up is done by the framework, according to HTML annotations and dependancy injection. 

This dramatically reduces the amount of code required to build a complex view. When people talk about writing less code in Angular, the majority of it comes from the lack of this code, which is pure boilerplate 90%+ of the time. However, it also means less flexibility in how to coordinate interactions between components. This is a double edged sword, having a single, well understood way of doing things makes the code easier to understand, but when you are doing something that pushes the framework, it means you have less tools at your disposal.

## Simple directives

Let's look at what goes into building a simple directive. This directive will make an alert box pop up when you click on an element, which will say "Hello, world!". If a name is provided when applying the directive, it will use that instead of "world".

{% plunker src:QExEdgNZkEDcwcJwkpuN height:500px %}

It is important to note that Angular will translate the name `myGreeting` which is properly cased JavaScript, into dashed case `my-greeting`, which is proper for html/css.

The first thing to look at is `restrict`, which determines how your directive will be used. This can be a combination of the following codes

- `A`: restrict to attributes. `<input type="text" my-greeting/>`
- `E`: restrict to elements. `<my-greeting></my-greeting>`
- `C`: restrict to class. `<button class="my-greeting">Greet!</button>`
- `M`: restrict to comment. `<!-- directive: my-greeting -->`


Now four choices in how to apply directives may seem to be a lot. In reality, it is considered to be a best practice to use the first two, since comments and classes are there for edge cases which very rarely occur. Typically, you will have more attribute directives then elements, since those are easier to compose.

## link function

The next thing we will look at is the `link` function. To understand why it is named `link` only becomes clear after understanding the directive life cycle, but for now, think of it as the place where you put your DOM manipulation code. 

You can see that we have three arguments being passed in -- `scope`, `element`, and `attrs` (there are an additional two arguments which can be used, but they are for more advanced situations, which we will explore in future posts). 

- `scope` is the current scope of the element. It is hard to list all the ways a scope reference can be used in Angular. But in the context of directives, the core use case is to translate what is in the DOM into JavaScript properties, and apply DOM changes based on JavaScript properties. The best way to think of scope is the glue between the world of the view (HTML) and the world of the rest of your application (JavaScript).

- `element` is the DOM node on which the directive is applied, wrapped in jQuery. You can do anything to it that you would otherwise be able to do with jQuery. A good rule of thumb is that a directive should only ever really be modifying its own element. I would consider it a very strong code smell if a directive was doing DOM traversal to change other elements, or even worse, looking up other parts of the DOM by id or css.

- `attrs` is an instance of `ng.Attributes`. This is primarily useful for reading the properties of other attributes on `element`. It can also be used to react to an attribute changing (`attrs.$observe`), or to set a value on an attribute (`attrs.$set`). A nice property of `attrs` is that it will do the same casing normalization as what happens with directives -- so if you were looking up the value of `my-attr="foo"` on an element, you would do it by checking `attrs.myAttr`.


## The Angular directive lifecycle

If you have made it this far, you already understand how to use a directive in a simple fashion. However, to fully understand directives, you have to understand how Angular uses them. 

When you start your Angular application, you provide two pieces of information to the framework: A top level module, and a root element. The module is loaded, so that its dependancies can be registered for injections. The DOM node then gets passed to the `$compile` service for compilation.

`$compile` walks the DOM tree, looking for nodes which have directives it knows about. Once it has this list built, it begins processing each one in turn.

To compile a node, Angular needs to know how to combine the world of HTML (the DOM node) with the world of Angular. When you provide a `link` function in a directive definition, you are telling Angular how to accomplish that task -- how to link the two worlds together. This is also the point at which directive templates are compiled and inlined into the DOM.

Angular gets these linking functions by calling the `compile` function on each directive, in order of `priority`. `compile` defaults to whatever function is provided by the `link` property of the directive definition, if present. These linking functions are then combined into a composite linking function for that element.

Once all the linking functions are gathered, Angular will start linking from the bottom of the tree going up. 

## compile vs link

So that begs the question, when should you use `compile`, and when should you use `link`?

The easy answer is that you should just use `link`, unless you need to do something (like manipulate the child DOM nodes) before the linking process starts. Since `compile` happens before the scope really comes into play, its uses are dramatically limited to cases where you need control over the DOM *template* rather then the fully realized directive. If you are in a case where you do need `compile`, you must return your own linking function, since the `link` property of the directive definition will be ignored.


## Putting it all together

Let's take [the classic FizzBuzz interview question](http://c2.com/cgi/wiki?FizzBuzzTest), and modify it to be about directives.

> Write a directive that will be applied to an element with 
> children, each containing a number. The directive will then
> modify the child elements to apply a directive. When the
> child element contains a number divisible by 3, apply a
> `fizz` directive. When the number is divisible by 5, apply
> a `buzz` directive. When it is divisible by both 3 and 5, 
> apply a `fizz-buzz` directive.
>
> Each of those directives will change the element to display
> the appropriate text ('Fizz', 'Buzz', or 'FizzBuzz'), and
> increment a counter on the page.

{% plunker src:fuCL1gTR0nQl5dYGsxU4 height:500px %}

Directives are one of the most complex parts of Angular, but hopefully this post gives you a good foundation to build your knowledge on. There are more advanced properties and techniques available, but using what was described here will take you very far. 




