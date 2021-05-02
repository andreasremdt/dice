# D.I.C.E.

This library is a collection of feature-rich, accessible, and customizable Custom Elements (also known as Web Components) that you can use in your web applications.

## The Problem

- Do you want to use interactive elements like dropdowns, modals, or tabs, but don't want to include an entire CSS framework like Bootstrap or Bulma?
- Do you want to avoid using Vue.js, React.js, or any other UI library that possibly simplifies the task, but completes changes the way you write HTML code?
- Do you still want to be in control of the styling and behavior without having to fight a framework's defaults?
- Do you like to avoid the pain of thinking about every possible edge-case and accessibility issue when writing a simple dropdown menu?
- Do you dislike installing a (possibly huge) dependency into your project and having to learn its API first to build a simple tab navigation?
- Would you like to have a little more control over styling certain HTML elements, such as `select`?

If your answer of just one of these questions is yes, then this library might be something for you.

When building rich, interactive web applications, plain HTML often lacks behind. Although new elements like `dialog` have been add recently, browser support is still very poor, and many patterns like tab navigation still have to be built from scratch.

Besides, many native HTML elements like `select` can hardly be styled and often times need to be replaced by a custom implementation to fit into the page's design.

## The Solution

D.I.C.E. stands for dependency-free, interactive, custom elements that you can use in your applications. They try to fill the gap between native HTML elements and full-blown frameworks like React or UI libraries like Bootstrap.

When using D.I.C.E. elements, you don't have to download a huge library first. Instead, you can select which elements you need from unpkg and get started right away - zero configuration, no build pipeline, straight-forward APIs.

These components try to mimic browser styles by default and hence come with the minimal amount of styling possible. You can completely style all aspects to the needs of your applications.

Additionally, JavaScript is not required. Even though you can use it to progammatically interact with the components, say to open a dropdown, you don't have to. Using HTML attributes is enough to control their behavior.

## Current State

This library, its components and the documentation are still under active development and not yet ready to use. Hopefully, this will change within the next weeks or months. If you want to help me drive the project, feel free to get in touch :-)

## Components

- [Dropdown](src/dropdown)
- [Dialog](src/dialog)
- [Tabs](src/tabs)
- [Tooltip](src/tooltip)
