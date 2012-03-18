---
layout: post
title: "Awesome Emacs Plugins: Evil Mode"
date: 2012-02-27 15:58
comments: true
categories: vim emacs emacs-plugin
---

I want to do a series of posts on some of the cool emacs plugins I use. Before I do that though, I want to talk a bit about why I use and love emacs. The saying "Care about the code, not the tools" is an anathama to me, it is like "Care about breathing, but don't worry about drinking". Breathing is incredibly important, I agree, but consuming liquid regularily is pretty high up there on the list too! Anyways, this is my journey through tooling with working with code. This post is going to be a story of epic proportions, with very little "hard" content, but I plan on doing more posts that are more focused on the awesomeness of emacs plugins.

The Dark Years: Integrated Development Enviornments
---------------------------------------------------

I used IDEs for years, and while I appreciated the power, there was some things missing. The first thing was even with plugins, the barrier to customization was quite high. I love solving problems with code, and while solving other peoples problems is a fun and interesting (and profitable) endevour, solving your own problems is usually far more satisfying. Second, they are by their nature, built for a specific language and platform. Lastly, they are quite slow, and require quite a bit of resources. At my last job, it would take almost 7 minutes to go from a reboot to everything up and pointing to the right things. Now, even with a boatload of scripts, emacs loads in about 1s.

The Cult of Vim
---------------

When I started doing rails work, I started taking vim more seriously. Vim gave me the speed, and the custommizability. I quickly crafted a set of fairly elaborate configs where everything was exactly how I liked it. But beyond that, I discovered what a joy modal editing is. The best way I can describe it is a programming language for editing. The ability to think of fragments of code as objects that i can perform functions on is a wonderful and freeing thing. Once it becomes second nature, it feels like I am talking to my editor in a high level way with my fingers. A nice side effect is that my hands _never_ leave the keyboard. It is highly efficient, but efficiency isn't even the biggest benefit, it is a joy thing. I find it much more enjoyable to edit code with modal editing.

Eventually you reach a point where you want to be writing your own stuff in vim as well, and you have to start learning vimscript, which is possibly the most terrible language ever conceived of. Vim is awesome, vim plugins are awesome, but vimscript is just one big WTF. More then that, I was starting to get into lisp in a pretty big way, and you can't compare vim experience to the emacs experience. I also was sort of frustrated by the lack of ability to show the output of an external process in a seperate buffer, especially since I do TDD.

The Light of Emacs
------------------

The old arguments between vim and emacs focused on speed, but when you are comparing either to eclipse, the amount of speed difference beween vim and emacs now is unnoticable. Same deal with resources, emacs is sitting at 250megs right now, which is more then vim, but a small fraction of chrome. That brings us to the strengths, which for emacs is it does pretty much everything vim does, but better, except for the act of actually editing text. It also does way more then vim can do, some of it quite unique (org mode) useful (regexp-builder) or suprisingly powerful (calc). 

The other major thing is elisp vs vimscript. I have a strongly passionate (bordering on irrational) love of lisp, so for me it was not even worth talking about, something lispy vs a really terrible dynamic imperative language, I will choose the lispy thing every time. elisp is far from the greatest lisp out there, but compared to vimscript it is wonderful. There is also a philsophy in emacs that emacs is a platform, with an editor implemented in it. Vim philosphy is vim is an editor that you can script if that makes you happy. Very different, and since I have such a dedication to my tooling, I definately appreciate the emacs side.

The thing that was always a sticking point for me was modal editing. As much as I love modal editing, I hate emacs editing. There is something about the way my brain works that makes it extremely hard to remember key chords. I can happy do "`ci'blahfT;;.`" and have no problems, but `c-c` `m-x t` will leave my brain after about 10 minutes of not using it.

After some time lusting over emacs and being defeated by its keybindings, I read about viper-mode, which was a vim emulator. I tried it out, but after trying `ci"` and having it not work, I realized it wasn't enough. I poked around the internet a bit, and found out about vimpulse, which promised much more in terms of vim emulation. I actually went a day on vimpulse before switching back, there were just too many inconsistancies and other small things that were missing, or not working the way they should.

Evil.
-----

I went a few months, sort of keeping taps on emacs, but not really expecting to be able to switch. Eventually I heard about evil, and I eagerly installed it. Wow. After trying vim emulators in many other editors, which range from the level of viper mode to a bit under vimpulse, evil was like a light in the darkness. These guys really "get" vim, and are serious about re-implementing it. I have been using it for a few months every day, and there are only a few things missing.

- it ignores punctuation. if you have `function foo(){}`, and your cursor is at the end of the line, in vim db will leave you with `function foo`, in evil, it leaves you with `function`. This is because vim will treat punction as a word, while evil does not. I still find this regularly frustes me.
- there is no `:g`. There are a ton of `:` commands missing, but I find the lack of `:g` the thing I really miss, since most of the other stuff is covered by emacs functions
- the `b` text object is broken in js2 mode. I use js2 a lot, love it, and consider it one of the reasons as a web developer to switch from vim to emacs.

Evil for Vim users
------------------

First, in emacs, next line/prev line is `c-n`, `c-p`. The reason you need to know this is because there are other emacs major modes that have nothing to do with editing, but will usually use `c-n`/`c-p` or `n`/`p` as the method to navigate from the next and previous item.

In vim, it applies scripts via various events. Combing two things together means running one event, followed by the other event. In emacs, you are composing modes. Every buffer in emacs has a single major mode, that defines what type of thing you are doing. A major mode could be "ruby", but it could also be an email client. Emacs is the platform, and a major mode is the application. You also have minor modes, which add additional features to a major mode. I have a plugin called autopair, that will keep delimiters balanced (I use delimMate to do the same thing in vim), that is a minor mode. So your editing experience is basically defined by composing a major mode with multiple minor modes.

This is a really cool thing, if you write vim plugins, usually you see a block where they have to unregister all sorts of things they registered if the filetype changes, that is a non issue in emacs, because nodes are self-contained entities. The bad thing is in the age of web development, we have to deal with files that have multiple major modes (like erb, which can have html, css, ruby, and javascript). This is probably the biggest weakness of emacs at the moment, it was designed with a single major mode per buffer, so you cannot compose major modes. There are many attempted hacks around this, but IMO they are all terrible.

`M-x` in emacs means "Execute command". All the commands will be available there. `M-x describe-key` is extremely useful, you type that then hit a key, and it will tell you what function it is bound to. Once you have that, you can do `M-x describe-function` and enter that function name to view its documentation.

Lastly, if you are a vim user, you need to know how to bind keys. The idea in emacs is instead of registering keys at a global level, each mode has a keymap that is self contained. So when you compose your modes, you are also composing keymaps. the syntax for keymaps is

{% codeblock keymaps lang:scheme %}
(define-key <keymap> key 'function)

; evil defines 3 maps for the various states, so to
; replicate a mapping I had in vim - nmap Y y$

(defun copy-to-end-of-line ()
  (interactive)
  (evil-yank (point) (point-at-eol)))

(define-key evil-normal-state-map "Y" 'copy-to-end-of-line)
{% endcodeblock %}

That was a custom function definition, but you can also use any built in function after the `'`.

Everything in emacs I know, I know by its function name. If I use it a lot, I will map it to a key, so I have pretty much completely ignored the real keybinds.

Evil for Emacs Users
--------------------

I honestly don't think I am qualified to write this, because I was never a real emacs user. But if you were ever curious about why people go on and on about how awesome vim is, evil will pretty much give you that experience, and you can have it without leaving the editor you already know and love. I believe evil mode is more effective then traditional emacs, but even if it isn't I am pretty sure it is more enjoyable. I would strongly encourage people to give it a chance for a month or so with a "Learn vim" tutorial, and see how they find thinking in text objects. We are definately in YMMV territory, but I find it a joy. [You may find this post more tailored to your point of view](http://dnquark.com/blog/2012/02/emacs-evil-ecumenicalism/)
