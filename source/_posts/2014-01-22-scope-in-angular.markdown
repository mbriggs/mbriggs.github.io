---
layout: post
title: "Scope in Angular"
date: 2014-01-22 14:34
comments: true
categories:
 - angular
 - javascript
author: Matt Briggs
---

Angular goes in a different direction then most other frameworks, by having the html you write drive the composition of UI components. This allows you to succinctly wire up components without boilerplate, but it also creates some issues. How do you share data? How to components get configured? How do components communicate with each other, or the outside world? The part of angular which answers these questions is scope.

## What is scope?

The purpose of scope is to hold shared UI state of an element and it's descendants. Since the UI is defined as a tree of nodes, the scope of an element is visible to all descendants of that element. When a descendant introduces a new scope, the new scope inherits properties of it's parent scope.

This is a very elegant solution to the problem, since the further you go down the DOM tree, the more specific the data requirements get.

As an example, here is an extremely basic employee directory, which allows people to add contacts to their personal directories.

{% plunker src:AsGQlxSpdOOhIlG9wi4u height:500px %}

There is 3 levels of scope in play here. The first is the root scope, which is defined automatically by the angular bootstrapping process. The second is the directory level, which is created by `ng-controller`. The third level is the employee elements, which are created by `ng-repeat`.

Each level inherits from the previous level as illustrated here

![scope tree](/images/scopes/scope_tree.png)

This inheritance is very important, as you can see with what is happening with the "add to my directory" button. `currentUser` being on the root scope means it is available to all child scopes, so even though most of what needs to happen at the employee scope level is satisfied with the `employee` object, it is still able to see `currentUser` if needed.

#### ZOMG global state!

This may be a bit terrifying, especially for JavaScript developers. The difference between this and global state is that the scope tree is directly linked to the DOM tree.

If two different nodes share a parent, usually there is a reason, and if you put state on that parent node, usually it is very applicable to both children. Those children don't make much sense without the parent, so it becomes unlikely they will be accidentally separated.

As long as you keep your state as localized as possible, having state inheritance is a very elegant solution to the very tricky problem of sharing data.

That being said, if you publish everything on `$rootScope`, yes that is global state, and yes, that is bad. Don't do that.

## Using scope in directives

Using scope is pretty straight forward when using things like `ng-controller` and `ng-bind`. But how about a directive which interacts with the scope?

Here is a directive which exposes a number from the scope, and whether or not the number is even or odd.

{% plunker src:SZ1VBX53EidtFEzV2SrD height:300px %}

The way angular achieves its data binding, is by constantly checking values on scopes to see if they have changed. This is accomplished by `scope.$watch`. Angular will automatically create `$watch` expressions for any data binding you give it, but you can also add custom ones. Every time angular thinks something may have changed, it will call the `$digest` method on the appropriate scopes, which cycles through watch expressions looking for changes. If an expression is found to have changed, angular will execute whatever the callback is.

Another interesting thing here is the `$parse` service. `$parse` is the way angular translates expressions (the things inside `{% raw %}{{}}{% endraw %}`) into javascript. Angular will automatically wrap an expression passed into `scope.$watch` as a string, but since we are going to assign a value to the same expression, it makes more sense to wrap it ourselves.

Most of the rest of the `link` function is around synchronizing the value of number from the outer scope to the inner scope. The reason for that is that this directive has a template which requires the number to be passed into it (via `ng-model`). Because of that, we need a fixed, known value for the scope.


## Isolate scope

Now, what we have here works, but there is quite a bit of "manual lifting" going on. It would be nice if the framework could handle that two way scope synchronization for you, wouldn't it? Well it can, using a feature called isolate scope.

Normally, scopes will inherit from their parent. But in the case of directives, this can be undesired. A directive is a generic piece of functionality, and the scope is full of application and context specific values. Isolate scope allows a directive to create a "scope sandbox", cutting it off from the rest of the scope tree, except for specific values. Here is the previous example re-done using isolate scope.

{% plunker src:riMUgeMoOGbe7DW6QTnB height:300px %}

It looks a lot nicer without the synchronization code. That is because we moved that into the `scope` part of the directive declaration.

The way that the `scope` property works is the key is name you want to publish on the local scope, the value is a symbol that signifies how the local scope and the outer scope values will get linked.

- `=` two way synchronization, by far the most common. This will link an outer scope property to an inner scope property, where the outer scope property is specified by what is in the attribute being referenced.
- `@` one way, this will copy the literal value from the attribute into the isolated scope. If the attribute value changes, the isolated scope property will be updated to reflect the change, but if the isolated property changes it doesn't get copied to the attribute.
- `&` will wrap the expression in a function, which can then be called as needed. If the expression is a function, you can inject arguments into it by passing a context object at the point of invocation. This may not make much sense, but see the next plunk for an example.

so for example, `scope: { foo: '=' }` means "Isolate scope for this directive, and set up two way synchronization between a property on the local scope called foo, and whatever expression was entered into the property `foo` on this directives element".

Often, it is fine to use the same name as the attribute, but if you want to use something different, you can name the key whatever you like, and put the attribute name after the symbol. So `scope: { foo: '=bar' }` would be synching between the expression in the attribute called `bar`, and the isolated scope property `foo`.

Here is an example of all 3 types of isolate scope declarations

{% plunker src:Sjm7MsqXbJjcn00yANvl height:800px %}


## Why would you ever not want to isolate scope in a directive?

The only reason you don't isolate all directives is that there can only be one scope per element, so only one directive per element can ask for scope isolation.

In practice, this isn't as limiting as you would expect. Usually there is at most one directive per element which requires complex integration into the rest of the ui state. If there are other directives, they tend to just do things like configure 3rd party libraries.

Unfortunately, you should only use this feature if you really need it. If you are writing library code, you should go to even greater lengths to avoid it, since it can potentially restrict situations where the directive can be used.

This is one of the things I find frustrating about the framework, the properties of isolate scope are so incredibly useful when writing directives, they really should be always available (in my opinion).

## A few words of warning

Scope enables most of the aspects that have made angular the most popular JavaScript framework today. But there are some gotchas that are good to be aware of

### Beware complex $watch expressions

Angular takes a brute force approach to dirty checking (until ES6 anyways), which means that your watch expression can be run many, many times. Slow `$watch`s are the most common source of performance problems in angular apps.

### If there isn't a "." in your binding expression, you are doing something wrong

This is obvious if you understand how inheritance works, but comes up surprisingly often in issues by newbies. If you read from a property that is on ancestor scope, there is no problem. But if you write to a property on an ancestor scope, you will just end up adding the property to your local scope. By publishing objects on the scope instead of values, JavaScript will first have to find the object before writing, bypassing the problem.

Here is an example of the problem

{% plunker src:zoGNvPsYHo5FnvS7OXn3 height:500px %}

In general, just stick with the rule of thumb that binding expressions always need a dot in them.


### Think carefully before publishing on $rootScope

It is a quick way to make something globally accessible, but there are several tradeoffs.

- It will make it hard to change in the future, since it is not apparent what is using the variable (since any view code could potentially be using it)
- You are increasing the chance of a name collision. If something further down the page uses the same name, you could introduce a very subtle bug.
- When properties are referenced on the `$rootScope`, it is not terribly clear where they come from.

There is a time and place for `$rootScope`, but publishing to it should be done with thought and care.


### Debugging

The [Angular Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?hl=en) is an incredibly helpful tool for exploring the current state of the scope on an element. It should be the first thing you reach for when scope isn't behaving the way you think it should
