---
layout: layouts/main
title: Welcome
---

# Introduction

First things first: D.I.C.E. stands for _dependency-free, interactive, custom elements_, a collection of feature-rich, accessible, and customizable Web Components that you can (and will want to) use in your projects.

## Motivation

- Do you want to use interactive elements like dropdowns, modals, or tabs but don't want to include an entire CSS framework like Bootstrap or Bulma?
- Do you want to avoid using Vue.js, React.js, or any other UI library that possibly simplifies the task but completely changes the way you write HTML and structure your app?
- Do you still want to control the styling and behavior without having to fight a framework's defaults?
- Do you like to avoid the pain of thinking about every possible edge-case and accessibility issue when writing a simple dropdown menu?
- Do you dislike installing a (possibly huge) dependency into your project and having to learn its API first to build a simple tab navigation?
- Would you like to have a little more control over styling certain HTML elements, such as `select`?

If your answer to just one of these questions is yes, then this library _might_ be something for you.

When building rich, interactive web applications, plain HTML often falls short. Although new elements like dialog have been added recently, browser support is still inferior, and many patterns like tab navigation still have to be built from scratch.

Besides, many native HTML elements like select can hardly be styled and frequently need to be replaced by a custom implementation to fit into the page's design.

## The (Potential) Solution

D.I.C.E. Web Components try to fill the gap between native HTML elements and full-blown frameworks like React or UI libraries like Bootstrap.

When using D.I.C.E. components, you don't have to download a vast library first. Instead, you can select the ones you need from unpkg and get started right away - zero-configuration, no build pipeline, straight-forward APIs.

These components try to mimic browser styles by default and hence come with minimal styling. You can entirely style all aspects to the needs of your design.

Additionally, JavaScript is not required. Even though you can programmatically interact with each component, say to open a dropdown, you don't have to. Using HTML attributes is enough to control their behavior, as you'd expect from other HTML elements.

## Getting Your Hands Dirty

Well, interested? You can browse through the list of components on the left side to see some examples and how they are used. If you want to test them for yourself, head over to the [quick start](/quickstart/) to get started in less than a minute!

Is there a component missing that you think would make sense as part of this library? [Contributions](https://github.com/andreasremdt/dice/issues) are always welcome, be it an issue with a proposal or a PR that fixes/adds stuff.
