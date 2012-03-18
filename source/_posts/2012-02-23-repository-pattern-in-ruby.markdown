---
layout: post
title: "Repository Pattern In Rails"
date: 2012-02-23 22:59
comments: true
categories: ruby design-patterns oop
---

I have been working a lot on an app using MongoDB as the datastore, and Mongoid as the OR/M (or ODM to be more specific). In a relational database, you keep your data as segregated as reasonably possible, and then join it together in appropriate ways when you need it. The up side to this is that it is incredibly flexible, and chances are you wont hit a situation where you need your data in a form that your datastore can't give to you. The down side is that often, your data has a "natural" way that is joined together, and even though 99.9% of the time you are joining it together in that way, you still pay the cost every time.

In Mongo, your data is stored in that "natural" way in a json format. That means it is harder to shape the data in different ways, but it is free to get the data in the way it is intended to be used.

The Problem
-----------

This app was developed using a state-based testing approach, where every test sets up a situation, performs an action, and then asserts on the new state of the world. An interesting side effect of the Mongo way of storing data is that it makes it much harder to test smaller objects in isolation -- if a comment is a hash in an array in a post, it is impossible to save without first saving the post. In more complex scenarios, the problem gets much worse, and I am finding that tests that should be rather simple are requiring far more setup then I would expect.

A Solution: The Repository
--------------------------

When it comes to data access, the book Domain Driven Design advocates using a repository layer that separates your domain objects from your data access strategy. This has several benefits:

 - Your domain objects stay simple. Rails developers tend to follow the "Thin controller, fat model" heuristic fairly religiously. There is nothing wrong with that per se, but it sort of implies it is ok to have massive classes that do dozens (if not hundreds) of things, so long as it is the model. The problem with that is that as the complexity of the application grows, these "God" models tend to become harder and harder to maintain -- everything interacts with them, and they interact with everything. That kind of situation is what causes even small changes to cause ripples through your entire applications, and makes even simple maintenance tasks become quite daunting.
 - You segregate your interaction with third party code (ActiveRecord, or in my case Mongoid) from the rest of your application. You may say "Why is that necessary when you rarely, if ever change your data storage strategy?" The reason is that you don't have control over that code, it is managed by a third party. So if they change something, and you are calling their code directly all through your application, your entire application needs to change. I work on quite a large enterprise rails app, and the 2.x -> 3.x upgrade was a huge undertaking, mostly for this reason.
 - By following the Single Responsibility Principal, mocking in tests is a joy. This is going to address the pain I am feeling doing state based testing with a document datastore, and I believe that mockist testing will directly address these problems (I also much prefer mocking, so it is not exactly a direction I am resisting)

First Challenge: Mapping
------------------------

I have worked on systems in C# with manual object mapping in repositories, and it is a bit of a nightmare. You end up with hundreds of lines of `right_side.property = left_side.property` code, which apart from being horribly tedious to write, is actually a terrible source of hard to find bugs. Since we don't have a true data mapper library in ruby, the only way I will even attempt this is if I can automate the process through some clever meta-programming. The first part of that is that I need to be able to retrieve attributes from my domain objects in a simple way, without complicating the objects too much. I also need to be able to get the "schema" out of my model, so I am able to infer what it wants to save and retrieve.

This is going to be a lot of work
---------------------------------

The app is currently ~1k loc on the server side, which means it is going to take some time, but is really not an insurmountable task yet. The first step will be figuring out how to tackle the domain model side of the mapping problem, and extracting a domain model out of the current mongoid model. Stay tuned for more!
