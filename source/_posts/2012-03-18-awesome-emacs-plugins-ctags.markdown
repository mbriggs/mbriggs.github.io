---
layout: post
title: "Awesome Emacs Plugins: CTags"
date: 2012-03-18 00:18
comments: true
categories: emacs
---

I wanted to write a series of posts on awesome emacs plugins I use, since I have put a lot of time and effort into [my emacs configs](http://github.com/mbriggs/.emacs.d). The funny thing I find about emacs though is that there is such a massive amount of functionality already provided, most neat things plugins do is augment stuff that is already there. So I think most of these posts are going to be a third about emacs, a third about a plugin, and a third about the glue code tying them together :)

## Code Tags

The purpose of tags is to parse a codebase, and provide information about its structure (mostly for the purposes of navigation). There are many tools used to create tag index files, emacs even ships with one called etags.

## Tags in Emacs

Coming from vim, one of the things I found was that emacs tag handling was inferior to vims for some reason. Most of the time, when I would do a `c-]` in vim I would land exactly where I would expect to. In emacs, I would find I needed to jump through the matches far more often to find what I wanted.

## CTags

One difference was the tagging program. Vim uses something called exuberant-ctags, while emacs uses something called etags. From what I can tell, for the languages I use (javascript and ruby mostly), exuberant-tags does a noticeably better job.

Thankfully, ctags actually supports the format emacs is expecting, you just have to pass a -e argument. I only had to slightly modify my normal ctags command, and I had

{% codeblock lang:bash %}
ctags -e -R --extra=+fq --exclude=db --exclude=test --exclude=.git --exclude=public -f TAGS
{% endcodeblock %}

The last thing I want to do is have to jump to a terminal and type that out, so I wrote this quick little function in elisp to do the heavy lifting for me

{% codeblock build-ctags lang:scheme %}
(defun build-ctags ()
  (interactive)
  (message "building project tags")
  (let ((root (eproject-root)))
    (shell-command (concat "ctags -e -R --extra=+fq --exclude=db --exclude=test --exclude=.git --exclude=public -f " root "TAGS " root)))
  (visit-project-tags)
  (message "tags built successfully"))

(defun visit-project-tags ()
  (interactive)
  (let ((tags-file (concat (eproject-root) "TAGS")))
    (visit-tags-table tags-file)
    (message (concat "Loaded " tags-file))))
{% endcodeblock %}

That may be a bit confusing to people unfamiliar with elisp, so I'll walk through it

{% codeblock lang:scheme %}
(defun build-ctags ()
  (interactive)
{% endcodeblock %}

This part means "Make an elisp function called build-ctags, and mark it as interactive so that it can be invoked via m-x"

{% codeblock lang:scheme %}
(let ((root (eproject-root)))
    (shell-command (concat "ctags -e -R --extra=+fq --exclude=db --exclude=test --exclude=.git --exclude=public -f " root "TAGS " root)))
{% endcodeblock %}

This means "Make a variable called root that is the result of the eproject-root function" `eproject` is another library I will cover some other time, but one thing it gives you is a function that returns the root path of the current project. You could just as easily replace it with `(rinari-root)` (if you use rinari for rails projects) and it would work just as well. I will assume `shell-command` is self explanitory :)

{% codeblock lang:scheme %}
(visit-tags-table)
{% endcodeblock %}

The last piece just means replace the currently loaded tag file with whats on the disk. 

With that function, my navigation became a bit more comfortable in emacs, but I still found sometimes emacs would bring me to really strange places. After a bit of research, I found the incredibly obscurely named `tags-case-fold-search` variable. From the docs:

>>Documentation:
>>*Whether tags operations should be case-sensitive.
>>A value of t means case-insensitive, a value of nil means case-sensitive.
>>Any other value means use the setting of `case-fold-search'.

Setting that to `nil` helped immensely.

## etags-select

Now for the actual plugin :) [etags-select](http://www.emacswiki.org/emacs/EtagsSelect) If there is a single result, you jump straight to it, but if there are multiple results, it will pop up a window showing them all. n will go to the next match, p to the previous, and enter will select the current result and jump to that line.

I made another small command that I could bind to

{% codeblock lang:scheme %}
(defun my-find-tag ()
  (interactive)
  (if (file-exists-p (concat (eproject-root) "TAGS"))
      (visit-project-tags)
    (build-ctags))
  (etags-select-find-tag-at-point))

(global-set-key (kbd "M-.") 'my-find-tag)
{% endcodeblock %}

That function will check if the tags file is there, if it is, read it, if not, build it, then run that plugin function `etags-select-find-tag-at-point`.

To invoke it, put the point on a symbol and hit M-.

## Navigating with Emacs

I find my experience now much better then it was before, but there is always room for improvement. Any comments, criticisms, or tips that I am missing would be hugely appreciated :)