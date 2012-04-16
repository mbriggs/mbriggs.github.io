---
layout: post
title: "Why I Don't Use Semicolons"
date: 2012-04-16 18:00
comments: true
categories: javascript politics 
---

This weekend there was the latest of many outcries over the use of semi-colons. The problem came from twitter bootstrap breaking in jsmin due to a lack of semi-colons, fat saying that he wrote perfectly fine js, and that it is a bug in jsmin, followed by crockford declaring his code bad (in the way only crockford can), and that he wouldn't bring jsmin down to the level of supporting code that bad.

The story hit hacker news, twitter, the irc, and probably other places I don't follow, and caused quite a big deal of nerd rage over how someone could justify not using semicolons in javascript. The next day, Brandon Eich weighed in, and basically said that automatic semi-colon insertion wasn't done properly, if he could go back in time he would have made them fully optional, but since they aren't optional in all circumstances, you should probably use them all the time. This basically threw fuel on the fire, and kept the rage going on for another day or so.

## The Problem With ASI (Automatic Semicolon Insertion) in Javascript

It really depends on who you ask. If you talk to Crockford, he will say something about how the spec is mystifying and the rules are obtuse so you should just always use them. If you talk to someone else who has read the spec, they will tell you that the spec is pretty clear, and well implemented across browser versions. There is really one place where it does not work they way one would expect.

Basically javascript treats whitespace and newlines for brackets the same across all the different types of brackets so that means both of the following are valid js syntax

{% codeblock lang:javascript %}
if (foo === 1) {
  doSomething()
}

if (foo === 1)
{
  doSomething()
}
{% endcodeblock %}

That is pretty much as one would expect right? The problem comes with the following

{% codeblock lang:javascript %}
doSomething(1) // is the same as…
doSomething
(1)

// and…

listOfFoo[0] // is the same as…
listOfFoo
[0]
{% endcodeblock %}

Why anyone would write that into a language is beyond me, because deliberately writing code like the previous examples is absolutely terrible. But apart from aesthetics, where this will get you into trouble is a case like this

{% codeblock lang:javascript %}
function wtf() {
  console.log("this function doesn't actually return anything")
  console.log("So when you call it, it evaluates to undefined")
}

wtf()
(function(){
  // this pattern is known as an immediately invoking function definition
 // it is mostly used to introduce local state

  var foo = 1

  SomeNamespace.funcName = function(){
    console.log(foo)
  }
}())

{% endcodeblock %}

The above is a semi-realistic scenario where asi will punch you in the face in javascript. Basically, the intent is to call `wtf()`, and then make your immediately invoking function. What actually happens is that `wtf` gets called, returns `undefined`, and js attempts to call `undefined` as a function, passing in that inner function as an argument.

Now, getting `undefined is not a function` would be pretty confusing in that, and very hard to debug, especially if you don't know the js quirks around ASI.

## So, thats the problem, how do we deal with it?

There are several schools of thought. 

- One is to not actually explain the real issue, and give some handwaving and muttering about the inconsistencies of ASI, and how you should never rely on it. 
- Another is to learn the reason that bug occurs, and put a semi colon at the end of every line, whether it needs it or not
- A third is to prefix a line when this issue will occur with a semi-colon, and omit them in all other instances, since you know it is safe to do so.

The first is the attitude taken by the vast majority of the javascript community. The second and third are taken by a few, more advanced developers. The third however, is shunned, and causes terrible arguments by people who take the first way of dealing with it.

## Why all the hate?

If you write java code all day, and are appending ; to the end of each line whether it needs it or not, I can totally see it making sense to carry that tradition of needless ceremony over in javascript. If you come from any other language that supports ASI properly, I cannot understand how, after learning the facts about what the issue is, come to the conclusion that appending a redundant character to the end of 99.999% of your code is the way to solve a problem that comes up 0.001% of the time.

But my attitude is live and let live, if you want to do something I don't get, I really don't mind if it genuinely helps you avoid bugs. I would suggest wrapping all statements with parens, since sometimes they are needed and other times they are not (best to be safe!) and maybe append some `//`s to the end of your lines, just in case someone wants to add a comment later, it won't cause syntax errors. If I saw code that looked like this

{% codeblock lang:javascript %}
(var addStuff = function() {
  (var a = 1); //
  (var b = 2); //

  (return (a + b);); //
}); //
{% endcodeblock %}

I would kind of be scratching my head, and wondering why the person did it that way. But at the end of the day, all of that other extraneous crap has exactly the same amount of reason to be there as the semicolons.

## Whats so bad about a few semicolons?

I am going to talk about me, personally here, since there is a good chance that this stuff falls under the category of "Thats just the way Matts brain works".

First, they are just noise. They have no reason to be there, and noise for me tends to fade into the background. After working with semi-coloned javascript for awhile, I don't even notice the semicolons anymore. This is a really bad thing, because if I miss a semi-colon in the wrong place, I have a hard time linking the code I am looking at to that problem. By contrast, if I lead a line with a semi-colon in the one situation that matters, that stands out to me like a red flag. I can easily tell when its there and when it is not there.

Second, javascript is the only language I use that people even think about using semi-colons in. I spend most of my time in ruby, clojure, sass, html, and javascript. JS is the one difference with regards to ASI. That just exacerbates the problem for me, and makes it more likely I will miss a semi colon.

Third, I have zero problem remembering "Lead lines that begin with brackets with a ;". This is a very simple rule, in a world where I have to remember that keypress is less consistent then keydown, hasLayout, how to vertically align things in css, and why onchange isn't working when I programmatically change something in i.e.. You could make an argument that "Add a semi colon to the end of each line" is an even easier rule, but for me its not (refer to the previous two points for why).

Lastly, both in this post and in terms of importance, semicolons are ugly. They make an already verbose language just that much more verbose, and I actually care about things like aesthetics in code. This reason is far less important then the previous three, but for me it is just one more reason to not use redundant semi-colons

## The hate

But hey, if you want to use them, I am totally fine with that. If I contribute to your project I will use them too, and if I  miss one and you let me know, I will happily fix it. I have a canned regexp replace in emacs for scanning a file for possible semi-colon omission, and I dutifully run it before committing to someone else's project.

In my experience, this is pretty common for the no-semicolon crowd. But for some reason the attitude of the semi-colon mafia is that of violent and vitriolic hatred. It is not ok that I choose a different way then them to deal with this problem, it is not ok that I talk about it, and try to educate people as to why they are doing this practice in the first place, and it is really, really not ok for me to expect to be afforded the same courtesy I offer them.

Why?

I ask myself this every time one of these arguments happen. I genuinely think that it is a lack of knowledge that causes this knee-jerk reaction, but actually imparting that knowledge usually changes nothing. It is a very big mystery to me, and I have seen others in the js community express similar bafflement (including Isaac, one of the leaders of the node community, node developer and creator/maintainer of npm)

## Can't we all just get along?

I would love, just absolutely love to hear a good reason why you need semi-colons everywhere. I don't buy that javascript developers can't remember that simple rule, because they deal with far more complex rules every day. I don't buy that it is a tool issue, because every tool of the current generation has no problems with ASI. I don't buy that it is a fundamental flaw in ASI, because I use many languages that I don't write semi colons in, and never seem to have issues with them.

So please convince me. Politely, and in the spirit of coming to an understanding. I don't understand why you make the choice you make, but I don't think you are terrible for making it. Github has plenty of great developers, they ban semis. Thomas Fuches has been a community leader since before there really was a community, he doesn't use them. Isaac is one of the leaders in the node.js world, and a great js developer, he shares most (if not all) of these opinions. Even if you can't convince me, at least come to the same conclusion that I have on this issue, for whatever reason there are good developers who seem to completely abandon common sense around semi-colons, accept that and move on.