---
layout: post
title: "data-attributes are an anti-pattern"
date: 2012-08-10 10:32
comments: true
categories: html design
---

HTML5 has a lot of cool things in it, but the one thing I wish I could remove are data-attributes, because of the crimes against clean front-end code that it seems to encourage.

## What is this clean web code you speak of?

We have 3 technologies that go into building a web app, HTML, CSS, and JavaScript. All three operate on an abstract concept called the DOM, in their own ways.

- *css*
This is the language we use to declaratively set the visual properties of our UI. It consists of a path matching syntax, and a series of rules. Clean css is a) readable, b) doesn't repeat itself too much, and c) is modular (i.e. you shouldn't have styles intended for one thing leak into another thing) CSS is very hard (and frustrating) to learn, and even harder to write well.

- *javascript*
This is the language we use to specify the behaviour of our application. Up until the last 2 years there wasn't a lot of guidance on how to do this properly, but nowadays there is a tonne. Clean javascript is worthy of a book rather then a half paragraph, but for the purpose of this blog post, clean javascript is keeping your behaviour in javascript and your javascript out of the html. Also, that your DOM centric code should be segregated from the more abstract code.

- *html*
Html is the language we use to form the base structure of the DOM. Many people confuse HTML with being the DOM, but that usually comes from not much javascript experience. The HTML should be expressing the structure of your interface in a very abstract way. For example, if you have a navigation sidebar, it may look something like this

```html
<nav>
  <header>Pages</header>
  <ul>
    <li><a href="foo.html>foo</a></li>
    <li><a href="foo.html>foo</a></li>
    <li><a href="foo.html>foo</a></li>
    <li><a href="foo.html>foo</a></li>
  </ul>
</nav>
```

There is nothing talking about whether this sits at the left, right, or bottom of the page. There is nothing that talks about how the links should be pjaxing the main content div of the app. All it describes is a navigation widget at a very high level.

- *the DOM*
This is where all of those things come together. The DOM is the in memory representation of your UI. It has event handlers bound to elements, it has styles, and it changes dynamically. When you hit view source in your browser, you are looking at the html. When you open the web inspector, you are looking at the DOM (made to look html, due to how confused people are about these things). 

## The role of data attributes

Data attributes are a new way of serializing information into a DOM node about what it represents, so that you are not forced to use the class attribute improperly. For example, a blog post could look like this

```html
<article class='video' data-publish-date="2012-08-10">
</article>
```

We are using an article tag to represent the post, its class tells us what type of post it is (a video), and the data attribute is used to tell us something about it. This seems pretty obvious to me, class is for type of thing being represented, data is for that things data.

Now, with the rails 3 javascript helpers, to send some data to the server via AJAX, you do something like this

```html
<form action="/posts" method="POST" data-remote="true" data-confirm="are you sure you want to post this?">
	<input type="text" name="[post]title" />
	<textarea name="[post]body"></textarea>

  <input type="submit" data-disable-with="Loading…" />
</form>
```

Now, this looks like a very elegant solution to a common problem. But it's not really using data attributes the way they are intended to be used.

First we have the `data-remote="true"`. Why would you use a data attribute for something that obviously should be a class? `data-disable-with` and `data-confirm` are even worse, since they have a) nothing to do with data, and b) have no business being in the HTML.

## Why does it matter that rails co-opts data attributes?

In the small scale, it really doesn't matter at all. More then that, it works very well. You can make arguments about purity and aesthetics, but at the end of the day, we are co-opting technology that was intended to model papers and blog posts, and using it to build applications. Rails as a whole is meant to build things like base camp, which is the smaller end of mid-sized application, so if you are building that kind of app then they will serve you well (just like the rest of the default rails stack).

If you are building highly dynamic apps, or larger scale apps, things start to break down. When people are taught by rails that data attributes are a way to configure javascript libraries, you end up with stuff like this

```html
<%= text_field_tag "text_field_import_scenario_#{scenario.id}", "", :style => "width:346px;", :size => 24, :'data-autocomplete-path' => search_scenarios_quote_scenario_path(scenario.quote, scenario), :'data-autocomplete-raw-html' => true, :'data-autocomplete-send-form' => true, :'data-autocomplete-select' => "$j('#import_error_message').html('');$j('#text_field_import_scenario_#{scenario.id}').val(ui.item.name); $j('#object_id_#{scenario.id}').val(ui.item.value);", :'data-autocomplete-after-update-bad' => "$j('#import_link_#{scenario.id}').show(); resizePopup('import_pop_up_#{scenario.id}');" %>
```

or completely baffling things, like this

```html
data-print-action="check_sku:selected_skus:Item"
```

One reason we strive for clean code is because it is easy to read. Since HTML is already a very verbose language, this becomes more important. Keeping things simple and focused is the heart of clean HTML, and the previous two examples are almost the antitheses of that. After 10 years we have finally gotten people to stop using inline styles, and the rails community is replacing that with something much worse to maintainable html, inline behaviour.

## Ok fine, rails is doing it wrong, but there are still valid use cases, right?

The valid use case for data attributes are when you are doing relatively simple front end work, and jQuerying your way to victory. The javascript community has found that jQuerys DOM centric approach to code structure is a nightmare passed small scale, but if you are in the jQuery sweet spot, then you are also in the data-attribute sweet spot.

If you are doing more complex behaviours and interactions, making the DOM the source of truth is a bad idea. Your source of truth should be objects that wrap data structures and handle synching those data structures to a server. Beyond that, most of your UI will be rendered by javascript anyways, so you duplicating information that will not stay in synch.

## TL;DR;

Data attributes are data, not javascript configuration. The rails way of using them works well in trivial cases, but gets exponentially worse the more complex your use cases get.