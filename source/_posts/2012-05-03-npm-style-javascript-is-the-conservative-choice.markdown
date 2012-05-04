---
layout: post
title: "NPM style Javascript is the conservative choice"
date: 2012-05-03 17:40
comments: true
categories: javascript
---

I am sick of talking about semicolons. But after reading some comments on Tom Dale's recent post on best practices, I think I need to talk about the reasoning behind NPM style, and what it does to your code. It is not about being "cool", it is about dealing with two of the three types of bugs that are the hardest things to debug in the language.

*I don't care if you use semi-colons or not, that is not what this blog post is about*

What this post is about is

 - The problems NPM style is trying to address
 - How NPM style addresses them
 - Some very good reasons why you do not want to use NPM style

Even if you don't want to use this style of coding, hopefully this post will give you some ideas on how to develop your own techniques for dealing with some of these issues.

## The Problem With Commas

Even though we are talking about semi-colons so much, I find you run into bugs with commas in JS far more often. We had a deployment about a year ago that made the app unusable for most of our customers for more then the half day it took for us to find the issue and fix it. It was caused by code that looks something like this

{% codeblock lang:javascript %}
var foo = [
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "foo", id: 123, description: "lorem ipsum"},
];
{% endcodeblock %}

Can you spot the problem? It's the last comma inside the array.

There are two huge issues with misplaced commas. First, it is a really easy to introduce bug. Let's say you are working with backbone, and have something like this

{% codeblock lang:javascript %}
MyModel = Backbone.Mode.extend({
  initialize: function(){
    //do some stuff
  },

  canTransistionState: function(newState){
    return this.get("state") == "new" && newState == "published";
  },

  transitionState: function(newState){
    this.set({state: newState});
  }
});
{% endcodeblock %}

You are looking at the code, and think "You know, canTransistion is lower level then transition, how about I move it down?" You highlight canTransition, and press the button in your editor that moves the function down one

{% codeblock lang:javascript %}
MyModel = Backbone.Mode.extend({
  initialize: function(){
    //do some stuff
  },

  transitionState: function(newState){
    this.set({state: newState});
  }

  canTransistionState: function(newState){
    return this.get("state") == "new" && newState == "published";
  },
});
{% endcodeblock %}

You just got hit by the bug. What is worse, is lets say you fix that one, but then decide to delete the last function

{% codeblock lang:javascript %}
MyModel = Backbone.Mode.extend({
  initialize: function(){
    //do some stuff
  },

  transitionState: function(newState){
    this.set({state: newState});
  },
});
{% endcodeblock %}

Now you are hit by a bug that is orders of magnitude worse, since it will be fine in firefox and chrome, but will cause ie to die a horrible confusing death.

## How NPM Style solves the problem

NPM style says lead the first line with the opening glyph, prefix all following lines with a comma, and close the thing on its own line. So my first example would be

{% codeblock lang:javascript %}
var foo = [ {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          ];
{% endcodeblock %}

I know, it looks rather odd. But more important to how things look, there is literally no way you can have a trailing comma if you never put a comma at the end of the line. You can delete or reorder any of the lines without any problem, except for the first one. And the way the first one is prefixed in the same place by a DIFFERENT glyph, makes it very hard to forget to treat it as a special case. Finally, when debugging a problem, it is way more obvious when something is wrong in the npm case


{% codeblock lang:javascript %}
// NPM missing a comma
var foo = [ {name: "foo", id: 123, description: "lorem ipsum"}
          , {name: "fo", id: 13, description: "lorem ipsum"}
          , {name: "foo1", id: 123, description: "lorem"}
            {name: "fooooo", id: 123, description: "lorem ipsum"}
          , {name: "foobar", id: 12, description: "lorem ipsum"}
          , {name: "fobin", id: 123, description: "lorem"}
          , {name: "foo", id: 123, description: "lorem ipsum"}
          ];

// Crockford style
var foo = [
  {name: "foo", id: 123, description: "lorem ipsum"},
  {name: "fo", id: 13, description: "lorem ipsum"},
  {name: "foo1", id: 123, description: "lorem"},
  {name: "fooooo", id: 123, description: "lorem ipsum"}
  {name: "foobar", id: 12, description: "lorem ipsum"},
  {name: "fobin", id: 123, description: "lorem"},
  {name: "foo", id: 123, description: "lorem ipsum"},
];
{% endcodeblock %}

Now, if I were scanning through hundreds of lines of code without knowing what I am looking for, the first example would leap out at me WAY more then the second.

You might say "In that class example, it would look retarded to align everything on the {". This is true. Which is why I make a compromise, and do the following


{% codeblock lang:javascript %}
MyModel = Backbone.Mode.extend({
  initialize: function(){
    //do some stuff
  }

, transitionState: function(newState){
    this.set({state: newState});
  }

, canTransistionState: function(newState){
    return this.get("state") == "new" && newState == "published";
  }
});
{% endcodeblock %}

It is less reliable then true NPM style, but I find it still gives me the benefit of making the comma placement a lot more obvious, and I also find the first thing in my class tends to change far less then the last thing. It is not as fool proof as the top examples, but it is a definite improvement over Crockford style.

I think commas are a much bigger problem then semicolons, and even if you reject semi-colon first style, you should still switch to comma first, because it will dramatically reduce the chance of one of the worst pitfalls in the language from happening.

## The problem with semi-colons

This is a far less common case then commas, but still really nasty due to how hard it is to debug and to catch. Lets say you are writing Crockford Style code, and do something like this. Note that this is silly code, but the problem is not aparent unless you are doing one of a few fairly abnormal things.


{% codeblock lang:javascript %}
function foo(){
  var apples = 1;
  var bananas = 2;
  var array = [apples, bananas];
  var carrots = 3
  (function(){
    var a = 1;
    var b = 2;
    array = array + [apples, a, bananas, b, carrots];
  }());
  
  for(var i = 0; i < array.length; i += 1){
    console.log("this whole thing is just for distraction: ", array[i]);
  };
  
  return array + [1,2,3];
};

{% endcodeblock %}

When you run `foo()`, you will get `Exception: number is not a function`. Whaaa?

The problem is that in javascript, whitespace is insignificant for `()` and for `[]`. So the following are the same thing

{% codeblock lang:javascript %}
foo();
foo
();

// and

foo[1];
foo
[1];
{% endcodeblock %}

Why javascript would support such insane syntax is beyond me, but the (single) case this problem happens in the real world is illustrated by my first example, which means that because the carrot assignment was missing a semi-colon, the immidately invoking function instead calls 3(function(){}). Confused yet?

There are two main things that make this bug a killer. One is that the problem occurs on the line after the line that causes the problem. You need to be looking at pairs of lines to figure out what is happening. The second is what actually goes wrong is a confusing message _if you are incredibly lucky_. If you are unlucky, it will cause some comletely random behavior in your application that you can spend days trying to track down. Lastly, since this problem happens so incredibly rarely, and you are putting semi-colons at the end of every line, it is very hard to a) actually "see" the lack of a semi colon (for me at least, they fade into the background), and b) actually remember that this is an issue that can happen.

## How NPM Mitigates the semicolon problem

Since this happens in one case if you are doing cross platform browser work (a line which starts with an opening parenthesis), and one additional time if you are lucky enough to be guarenteed a relatively new version of ecmascript (a line starting with an opening square bracket), NPM treats those as special cases. So the previous example would be

{% codeblock lang:javascript %}
function foo(){
  var apples = 1
  var bananas = 2
  var array = [apples, bananas]
  var carrots = 3
  ;(function(){
    var a = 1
    var b = 2
    array = array + [apples, a, bananas, b, carrots]
  }())
  
  for(var i = 0; i < array.length; i += 1){
    console.log("this whole thing is just for distraction: ", array[i])
  }
  
  return array + [1,2,3]
}

{% endcodeblock %}

Notice the leading comma in front of the immediately invoking function?

Now, you might argue that it is even MORE invisible to not have the leading comma. First of all, once you get used to seeing `;(function(){}())`, not having that leading comma is the thing that makes it look strange. Since it is at the start of the line, the fact it is missing also helps me immensely. Lastly, when debugging the problem, you aren't looking for pairs of lines, you are looking for a single thing (that you can easily grep for)

## Wait, aren't there like, a bajillion other places where no semi-colons will screw you?

There sure are, but those other cases will never happen in real life, so you don't need to worry. This topic has been discussed at great, great length recently, but if you would like to learn more, I would recommend the following resources

 - [Writing Semi-Colonless Javascript, the people-who-want-to-get-stuff-done edition](http://mir.aculo.us/2012/04/16/writing-semicolon-less-javascript-the-for-people-who-want-to-get-stuff-done-edition/) Thomas lays out the essentials of what you need to know
 - [JavaScript and Semi-Colons](http://dailyjs.com/2012/04/19/semicolons/) If you want an in depth walk through of the actual rules, this is the best currently available
 - [An Open Letter To The JavaScript Community](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding) Isaac, one of the best server side js guys, pleading with community leaders to educate rather then forbid
 - [Why I don't use semi colons](http://mattbriggs.net/blog/2012/04/16/why-i-dont-use-semicolons/) My personal post detailing what I think of the issue
 
## Enough about the semicolons
 
We are talking about an incredibly rare issue in the wild, and it is really time to stop. The much, much, much more common issue is the trailing commas, and really that is the biggest gain from using NPM style javascript
 
 
## Why You Should Not Use NPM style javascript
 
Like everything else in this job, there are no hard rules, only ideas that are good for certain cases. Here are some great reasons not to use NPM

 - Your editor doesn't support it
 
 NPM style is quite popular, but not to the point where everything supports it. The snide comment would be that if your editor doesn't support it, find a better one. But realistically, that is often not possible or desirable. Both Emacs and Vim support it out of the box, if you use Emacs I would highly recommending installing the excellent JS3 package, which I believe has the best js indentation out of anything out there (and yes, I have tried every popular current editor). In fact, I would say the two best choices currently for javascript work are Emacs with JS3 if you prefer light weight, or IntelliJ WebStorm if you prefer IDEs.
 
 - I understand the issues, but I don't think it is worth switching to such a wild coding style because of them
 
 There is nothing wrong with making this choice, the important thing is understanding why you are making it. Hopefully this blog post will help you debug a really nasty class of bugs in the future.
 
 - I primarily use Java/C#/C++, and this is just too different
 
 It is important to remember that this is really a different language, and that even if you write it like java, there are cases where things work differently (especially semicolon stuff). You probably don't want to go to this style if you write similar code all day, but you should try to think of less drastic ways to adjust your style that will help you avoid these pitfalls
 
 
## Massive walls of text are fun

This was a pretty long post, but I think it is important. As a professional developer, it is your job to be educating yourself about the things you use to do your job, and creating processes that help you do it more efficiently and effectively. Most people think that NPM style is about being "different", or making your code look "cool". It really isn't, it is about contorting the way you code for the benefit of writing better javascript that is easier to debug.
