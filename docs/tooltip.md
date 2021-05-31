---
layout: layouts/main
title: Tooltip
---

# Tooltip

Tooltips hide content that is crucial to a web application but can provide hints, tips, additional information and so on. Their content is hidden by default and only becomes visible once the user hovers over or focuses an HTML element, like a button or link.

Tooltips can introduce accessibility issues, since there information is difficult to show for certain users (e.g. by using voice-commands or for screen readers). Their usage should be kept to an minimum and only for information that is not important to the user.

The `dice-tooltip` component is designed with accessiblity and customization in mind. You can either pass a simple string for the tooltip to display or even provide entire HTML structures. Design and placement can be customized as well.

## Usage

Basic HTML structure

```html
<!-- using a simple string -->
<dice-tooltip content="Hello, world!" placement="top">
  <a href="#">Lorem ipsum dolor</a>
</dice-tooltip>

<!-- using HTML -->
<dice-tooltip content="<h1>Heading #1<h1><p>Some more text...</p>" placement="top">
  <a href="#">Lorem ipsum dolor</a>
</dice-tooltip>

<!-- using HTML with a template tag -->
<dice-tooltip template="template1" placement="top">
  <a href="#">Lorem ipsum dolor</a>
</dice-tooltip>

<template id="template1">
  <h1>Heading #1<h1>
  <p>Some more text...</p>
</template>
```

You can put any HTML element inside the tooltip that you want. It will be displayed without any further modifications.

_Note: even though possible, it's highly recommended to use interactive elements as tooltip children only (`button`, `a`, etc.). This has accessibility benefits and is considered best practice._

## Configuration

### placement

You can customize the position of the tooltip by providing the `placement` attribute:

```html
<dice-tooltip content="" placement="bottom">...</dice-tooltip>
```

**Default:** `bottom`

Can be `bottom`, `top`, `left`, or `right`.

### open

If you want to have the tooltip opened without any user interaction, you can set the `open` attribute:

```html
<dice-tooltip content="" open>...</dice-tooltip>
```

_Note: once the user leaves the tooltip (`mouseleave` or `blur` event), the tooltip will be hidden again._

### content

The `content` attribute controls what the tooltip should display. It can be a simple string or an entire HTML structure:

```html
<dice-tooltip content="Hello, world!">...</dice-tooltip>
<dice-tooltip content="<h1>Heading #1<h1><p>Some more text...</p>">...</dice-tooltip>
```

### template

If you want to provide HTML to the tooltip but dislike passing it as a string, you can alternetively make use of the HTML 5 `template` element and reference its ID to the tooltip:

```html
<dice-tooltip template="template1" placement="top">
  <a href="#">Lorem ipsum dolor</a>
</dice-tooltip>

<template id="template1">
  <h1>Heading #1<h1>
  <p>Some more text...</p>
</template>
```

## Styling

Tooltips are lightly styled by default and can be customized if desired. There are certain CSS properties like `position`, `top`, or `left` which shouldn't be overridden to not break the positioning.

```css
dice-tooltip::part(tooltip) {
  font-size: 12px;
}

dice-tooltip::part(tooltip)::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}
```

Tooltips have a light transition out-of-the-box, making their appearance more pleasing. The animation, the animation timing and other basic properties can be easily changed by setting CSS Custom Properties:

```css
dice-tooltip::part(tooltip) {
  --spacing: 10px;
  --background-color: tomato;
  --color: white;
  --transition-duration: 0.2s;
  --transition-animation: linear;
}
```

`--spacing` controls the distance between the tooltip and its child element to which it is attached.

_Attention:_ overriding existing CSS properties such as `position` can lead to a broken appearance. To avoid breaking the component, don't set the following properties: `position`, `top`, `left`, `right`, and `bottom`.

## Accessibility

Elements inside the tooltip should be interactive and be able to receive focus (such as buttons or links). Hovering over them will show the tooltip, leaving them will hide it.

If a child element is focused, the tooltip is also shown, while it's hidden when the focus is lost or the "Escape" key is pressed.

## JavaScript API

### Methods

You can programmatically show or hide a tooltip by calling the appropriate methods:

```js
var tooltip = document.querySelector('dice-tooltip');

// Makes the tooltip appear
tooltip.show();

// Hides the tooltip
tooltip.hide();
```

### Properties

Alternatively to the above methods, you can set the `open` property:

```js
var tooltip = document.querySelector('dice-tooltip');

// Makes the tooltip appear
tooltip.open = true;

// Hides the tooltip
tooltip.open = false;
```

The `open` property also reflects the current state, meaning that if the tooltip is shown, it will return `true`, otherwise `false`.

If you want to change the placement and content after the component has been rendered, you can do so via the appropriate properties:

```js
var tooltip = document.querySelector('dice-tooltip');

tooltip.placement = 'right';
tooltip.content = 'Updated content';
```

The same task can be achieved by updating the attributes:

```js
var tooltip = document.querySelector('dice-tooltip');

tooltip.setAttribute('placement', 'right');
tooltip.setAttribute('content', 'Updated content');
tooltip.setAttribute('template', 'templateId123');
tooltip.removeAttribute('open');
```
