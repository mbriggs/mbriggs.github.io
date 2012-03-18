---
layout: post
title: "Repository Pattern In Ruby: Creating the Domain Model"
date: 2012-02-24 00:18
comments: true
published: false
categories: rails design-patterns
---

I am a fan of writing out the API that I want to see, and then make it happen.

The Domain Entity
-----------------

{% codeblock company.rb lang:ruby %}
class Company
  extend Model
end
{% endcodeblock %}

I am going to need both instance and class methods from my mixin. Since it is trivial to do both from a single command, I am going with `extend` rather then `include`, since I think `extend Model` sounds nicer in this case :)

Now for field declarations. Ruby doesn't know anything about types, so your models don't really need to either, even if your datastore does. I want that field declaration to give me a getter and setter for each field, that will keep them in an internal hash that I can retrieve later. I also want a simple api.

{% codeblock company.rb lang:ruby %}
class Company
  extend Model

  fields :name,
         :subdomain,
         :subscription,
         :sheet_count,
         :sites
end
{% endcodeblock %}

I want to be able to store all my field values in an internal hash, and then be able to get them all out at once. ActiveRecord does this with an attributes method, I think I am just going to go for attrs (in the name of brevity). Subscription is a special field that uses a flyweight value type called `CompanyType`, so I override the getters and setters to wrap that field in the type.

{% codeblock company.rb lang:ruby %}
class Company
  extend Model

  fields :name,
         :subdomain,
         :subscription,
         :sheet_count,
         :sites

  def subscription
    CompanyType.by_type(attrs[:subscription])
  end

  def subscription=(type)
    attrs[:subscription] = type.to_s
  end
end
{% endcodeblock %}

I think that looks nice and clean. Now to make it work.

The Plumbing
------------

Lets start by implementing that `fields` method, since it is the heart of that class. It will need to take a variable amount of parameters, and create getters and setters for each, so lets start with that

{% codeblock model.rb lang:ruby %}
module Model
  def fields(*names)
    names.each do |name|
      define_method name do
        instance_variable_get :"@#{name}"
      end
      define_method "#{name}=" do |value|
        instance_variable_set :"@#{name}", value
      end
    end
  end
end
{% endcodeblock %}

What that is saying is for each name passed in, create a getter and setter. That is nice, but the method is a bit large for my taste, so since the tests are passing I'll do a quick refactoring

{% codeblock model.rb lang:ruby %}
module Model
  def fields(*names)
    names.each do |name|
      getter(name)
      setter(name)
    end
  end

private
  def getter(name)
    define_method name do
      instance_variable_get :"@#{name}"
    end
  end

  def setter(name)
    define_method "#{name}=" do |value|
      instance_variable_set :"@#{name}", value
    end
  end
end
{% endcodeblock %}

Much nicer :)

At this point we have a decent getter/setter definition macro that we control, but we still need a generic way to get at all the attributes that are backing our fields. Instead of setting/getting instance variables, I think I will make an instance hash, then only provide a getter for it. That way I can easily access it when I need to map it to and from Mongoid objects.

{% codeblock model.rb lang:ruby %}
module Model
  def self.extended(base)
    base.send :define_method, :attrs do
      @model_attrs ||= {}
    end
  end

  def fields(*names)
    names.each do |name|
      getter(name)
      setter(name)
    end
  end

private
  def getter(name)
    define_method name do
      self.attrs[name]
    end
  end

  def setter(name)
    define_method "#{name}=" do |value|
      self.attrs[name] = value
    end
  end
end
{% endcodeblock %}

That last change is a bit interesting if you haven't done much meta-programming in ruby before. There are several hooks that ruby will call when it performs certain operations. The one I am using is extended, which will be called when a class uses `extend Model`. The reason I need to do it here is that extend will be attaching singleton methods on to the class it gets mixed into, but this attrs method is going to be at the instance level.

There is a popular idiom in ruby to make a submodule called InstanceMethods to hold everything we want at the instance level, and `include` that when your mixin gets extended. I will definately do that if it ends up growing much more, but for now I am fine with doing the `define_method` inside the hook.

At this point the requirements are met, we have a nice little api that will allow for easy definition of the information we need on a domain model, while also allowing easy retreival of things that matter for the persistance layer. I could stop now, but I want another two small things

{% codeblock model.rb lang:ruby %}
module Model
  def self.extended(base)
    base.send :define_method, :attrs do
      @model_attrs ||= {}
    end

    base.send :alias_method, :as_json, :attrs
  end

  def fields(*names)
    @field_names = names
    names.each do |name|
      getter(name)
      setter(name)
    end
  end

  def field_names
    @field_names
  end

private
  def getter(name)
    define_method name do
      self.attrs[name]
    end
  end

  def setter(name)
    define_method "#{name}=" do |value|
      self.attrs[name] = value
    end
  end
end
{% endcodeblock %}

I added an alias for attrs to as_json. This is because I want to be able to say `render json: model` at the controller layer. It is probably a bit early for that, but I am fairly confident it will be needed. The other thing is the `field_names` method on the class. This is more of a convenience then anything, but again I forsee it being very useful when we write the mapping part.

Looking at what we have
-----------------------

I am pleased with the progress so far, and I think we won't need much more then that to be able to mitigate the pain of manual mapping. I am a huge fan of meta-programming, and really like the tools ruby gives you to make really elegant solutions like this.

The next step will be to actually write the mapper, which will be both more complex, and cooler then this.
