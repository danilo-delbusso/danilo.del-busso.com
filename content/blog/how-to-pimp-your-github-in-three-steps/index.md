---
title: 'How to Pimp Your Github Profile Page in 3 Easy Steps'
description: 'Add a custom .gif to your profile to give it a bit of a buzz'
date: '2020-07-09'
tags: 'GitHub_Profile_tutorial'
---

Whether you're looking for a new position and want to stand out or you just like to make cool things, GitHub offers you the tools to get your own customised welcome message, like this

![](https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/blog/how-to-pimp-your-github-in-three-steps/github.gif)

The message is surprisingly easy to set up and it's only limited by your imagination.

I will go through what I did to create mine and how you can replicate it.

## 1. Create a repository named after you

The first step is to create a [new repository](https://github.com/new "https://github.com/new") that is named after your GitHub username.

You will see this message confirming that you are creating the special repository needed for this tutorial.

![](https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/blog/how-to-pimp-your-github-in-three-steps/github-message.png)

## 2. Create your animated GIF

Here is where your creativity can shine. I suggest you make a GIF which will show on your profile page.

You can create whatever you want. What I have found easiest is to design a quick HTML page with a welcome text and some CSS animations.

I used [Animista](https://animista.net/ "https://animista.net/") for my CSS animations.

Once you have built your webpage (you can check out the code for mine [here](https://github.com/danilo-delbusso/danilo-delbusso/tree/master/html-animation "https://github.com/danilo-delbusso/danilo-delbusso/tree/master/html-animation")), you are ready to create your GIF.

Download a screen-to-gif recording app and record your animations. I suggest to use [peek](https://github.com/phw/peek "https://github.com/phw/peek") or [ScreenToGif](https://www.screentogif.com/ "https://www.screentogif.com/").

Remember to keep recording for at least 30 seconds after the animations are completed, to avoid looping.

## 3. Add the GIF to your profile

Once you're satisfied with your welcome message GIF, you are ready to add it to your profile page.

Upload the GIF to the repository that you created in step 1 and modify the README.md file to include your welcome message.

There are a couple of ways to do so. You can either add the GIF by referencing it as an absolute path like so:

```markdown
![Alt Text](https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif)
```

You can also use some HTML to achieve the same result.

```html
<img src='https://path/to/animation.gif' />
```

_💡PRO TIP: you can wrap this `<img />` tag in a `<a>` tag to make it a button!_

For more GIF customisation you can check out this [flavoured markdown GIF tutorial](https://gist.github.com/uupaa/f77d2bcf4dc7a294d109 "https://gist.github.com/uupaa/f77d2bcf4dc7a294d109") on GitHub.

Finally, commit your README.md and share it with everyone who will click!

You can find my repository [here](https://github.com/danilo-delbusso/danilo-delbusso "https://github.com/danilo-delbusso/danilo-delbusso"), with the HTML to generate a welcome message like mine.
