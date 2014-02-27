---
layout: post
title: "Code Organization in Angular"
date: 2014-01-22 14:57
comments: true
author: Matt Briggs
categories:
- angular
- javascript
---

The number one question I see over and over with programmers new to angular is "how do I organize my code?". I think that this is because the way you organize sample code is completely different then simple code, which again, is totally different then a complex application, and those transitions are not self-evident.

## Sample Code - aka One Big File

This is how you see most code on the internet

{% codeblock lang:javascript %}
angular.module('foobar', []).

controller('MyCoolController', function(){
  // controller
}).

directive('evenCoolerDirective', function(){
 // directive
});
{% endcodeblock %}

This makes a lot of sense when you are showing some sample code. But it will very quickly become unwieldy and difficult to work with if you are building anything even slightly complex. I would not recommend using this for anything you would check into source control.

## Simple App - aka The Angular-Seed Method

The angular project published a sample "boilerplate" project called "angular-seed", as a way to help developers new to angular get rolling without having to do a bunch of grunt work.

The way angular-seed organizes it's files is by type. In a nutshell, it looks like this

{% codeblock lang:javascript %}
// in app.js
angular.module('app', ['app.directives', 'app.services', 'app.controllers', 'app.filters']);

// in app.directives.js
angular.module('app.directives', []).
directive('myDirective', function(){
// stuff
});

// in app.services.js
angular.module('app.services', []).
factory('myService', function(){
// stuff
});


// in app.controllers.js
angular.module('app.controllers', []).
directive('myController', function(){
// stuff
});


// in app.filters.js
angular.module('app.filters', []).
directive('myFilters', function(){
// stuff
});

{% endcodeblock %}

This has the advantage of at least giving you *some* precision when trying to locate a given piece of code. It will also scale up well enough so that it is still usable by the time you finish building a simple application.

The problem here is what happens if you are not building a simple application? What happens if you have dozens of directives, and hundreds of controllers and services? At that point, 5 files won't help much.

## Splitting your application up into modules

This is widely considered to be the best way to organize non-trivial angular code. The idea is instead of thinking of your application as one giant thing, think of it as a number of small, independent modules that come together to form a giant application.

The benefit to structuring your code this way extends beyond being able to find things easily. People get into trouble when building large scale code bases by not thinking about dependancies. When everything in your app can "talk to" anything else in your app, those dependancies are everywhere. This means that even small, innocuous changes can impact things you couldn't foresee, causing bugs. It also means when you want to re-design something, it is extremely difficult, because it means changing how it is used everywhere in the rest of your application.

This is a very large and complex topic, but as a general rule of thumb, thinking of your application as a group of small, self-contained modules with a limited API used to communicate with each other will go a long way towards the long term health and maintainability of your codebase.

Thankfully, angular has a module construct. Unfortunately, it is extremely primitive, and most of this "encapsulation" will have to exist in your own head.

When splitting your application apart this way, every module is given its own folder, which contains all the code required for that section of the codebase. These modules should be as small as possible, and should be as self contained as possible. It helps a lot with the containment if you use require.js.

## Angular and Require.js

Do you even need require if you have angular? There is a lot of division on this topic, many people feel that since angular takes care of most application dependancy issues for you, that you can use a simpler build system and punt on require all together.

I think the real power in require (compared to other module loaders) comes from how you are divorcing dev-time file loading from production-time loading. Since angular has no story at all on file loading (only dependancy management), I think the need for that power is inevitable. You can embrace it immediately, or wait until you feel the pain, but hundreds of files coming down at the same time when the application loads will be brutal to develop against.

But beyond that, since there is no such thing as a module level injectable in angular (all dependancy injection draws from the same pool), it means if you want to have a module level model or service, it is impossible to control visibility. When you use require, you can have source level dependancies which are not published to the rest of the system, and use the angular dependancy injection for exposing an API.

This has worked great for me so far, with the sole exception that it is fairly common that I want to use `$http` for repository classes (would be the same issue if you wanted to use `$resource`). In these cases, I will pull that dependancy out of angular, and keep a reference in some sort of shared utility file (or base class). This can be done fairly easily

{% codeblock lang:javascript %}
var injector = angular.injector(['ng']);
var http = injector.get('$http');
// .instanciate can also be used if you want it to "new" something for you
{% endcodeblock %}

The main purpose of dependancy injection in angular is so that you can wire up UI code declaratively, while keeping everything easy to test. Since services like `$http` are on the edges of the system, I don't think it is going against the spirit of the framework to pull them out. Hopefully, the angular team will add module level visibility in the future, and the whole issue will just go away.

## Choosing what is right for your project

Since angular has taken such a hands off approach to the subject of code organization, there really is no "right" answer on what you should use. I have described some common (and less common) ways that people have found work for them, but it really comes down to a project by project choice.
