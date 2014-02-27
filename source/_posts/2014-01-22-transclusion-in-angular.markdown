---
layout: post
title: "Transclusion in Angular"
date: 2014-01-22 14:54
comments: true
author: Matt Briggs
categories:
- angular
- javascript
---

Transclusion is almost a gift to people criticizing Angular. It sounds incredibly complicated and computer-science-y. The spotty documentation around the topic and mysterious API only adds to the illusion of what a complicated concept this is. In practice, transclusion is a fairly simple concept, and one that is necessary if you are writing more advanced directives in angular.

In this post, when I talk about the "end user", I am referring to the developer using the directive (not the user who uses the application).

## So WTF does it mean anyways?

The wikipedia definition of transclusion is really pretty simple.

> In computer science, transclusion is the inclusion of a document or part of a document into another document by reference.

So in the context of angular, transclusion would be the embedding of an end user template into the directive template, or the directive template into the end user template. To put it more simply, have a directive (with a template) that either wraps, or is wrapped by end user code.

## Basic Transclusion

Basic transclusion is when you are simply wrapping end user code. Let's say, for some reason, you are building a blog where each post needs to be programmed in (I know, kind of silly, but just work with me here :) The post would have meta information as attributes, and the content of the directive would become the post body.

{% plunker src:NSgVfO6PsgmeK9BO83TU height:500px %}

There are two key pieces that make transclusion happen. First, `transclude: true` in the directive declaration tells angular we are performing transclusion.

The second piece is the presence of the `ng-transclude` directive in the `post` template. This tells angular where to embed the end user template.

## Gotcha: Transclusion and scope

A big thing to keep in mind is that since this is the end users code, it requires the context of the scope tree, not the isolated scope of the directive. Because of that, transcluded content scope is **not** the child of the directive scope, it is instead a child of the directives parent scope, effectively making it like the directive scope does not exist in the inheritance chain.

## transclude: element

`transclude: true` allows us to wrap a user's template with our template. But what about when we want to wrap *everything* in a template? For example, we are building a directive that displays a panel under an input box. The easiest way to do this sort of positioning is when you have a wrapper to position against. Here is a quick example

{% plunker src:PwcrFh6OSpqwxQ7drpxe height: 500px %}

If you look at the compiled DOM, you will see something like this

{% codeblock lang:html %}
<div class="drop-panel is-active" type="text" drop-panel="">
  <span ng-transclude="">
		<input type="text" drop-panel="" class="ng-scope">
	</span>
  <div class="drop-panel-panel">
    This is some panel content
  </div>
</div>
{% endcodeblock %}

`transclude: element` means that the entire element was transcluded into the `ng-transclude` placeholder (rather then just the elements children). `replace: true` allows us to define a new root node for the directive, so this is also necessary for wrapping to work.

## Transclude linker function for ultimate power

`transclude` gives a lot of power, but what happens when you need total control over the transclusion process? This is very rare, but can be needed if you need to transclude the end users template multiple times, or need to choose where to transclude based on some kind of logic (maybe as part of compile). For these cases, angular provides the transclude linker function, which lets you do pretty much anything you want.

Let's say you were building a directive which duplicated it's content a specified amount of times. Each duplication will have access to an `$index` property on the scope, that will tell it what number it is in the list.

{% plunker src:eMCl0kygah7dPzqKP0W8 height:500px %}

If you understand this, you understand the core of how `ng-repeat` works, which is one of the most complex directives that ships with angular.

For this one, since we aren't defining a new root element, we don't need `replace: true`. When `replace` is set to `false` (the default), and `transclude: 'element'` is set, what is actually inserted into the dom is a comment. The way this duplicate directive works is that each "duplication" is inserted after the previous one, and the first one is inserted after that comment.

You may also notice that `priority` is set very high. This is because we want our duplication to happen before any other directive gets applied.

Finally, since we are not using `ng-transclude`, we need to take care of what scope we want our duplication to link to. We do this by manually creating inherited scopes, and setting the `$index` property accordingly.

## Keys to the City

Transclusion is considered an advanced topic, but as you can see, there is nothing to be scared of. Even at its most complex, as long as you understand how scope and linking works, transclusion is very easy to understand. This is what I believe to be one of the strengths in the design of angular, everything in the framework is built on top of a handful of core abstractions. If you have a good foundational understanding, advanced topics come very easily.
