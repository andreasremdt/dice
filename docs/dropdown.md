---
layout: layouts/main
title: Dropdown
---

# Dropdown

The dropdown component can be used whenever the goal is to implement a customizable menu is needed, which can be triggered via a button click or JavaScript.

Most web applications make use of this popular component pattern, e.g. GitHubs user menu on the top right corner. The difference to using a `select` element is that any kind of content can be put into a dropdown, including lists, buttons, links, images, and more. `select` elements only support `option` elements inside, limiting its use case to forms or pure text data.

The `dice-dropdown` component is designed with accessiblity and customization in mind. You can freely decide what HTML structure should be part of the menu and the triggering button and can style them to your wishes.

## Usage

Basic HTML structure

```html
<dice-dropdown>
  Click me

  <ul slot="menu">
    <li><a href="#">Link #1</a></li>
    <li><a href="#">Link #2</a></li>
  </ul>
</dice-dropdown>
```

### Button

Everything that isn't part of a named slot inside the `dice-dropdown` element is part of the button. In the above example, the text "Click me" will be put inside. You can also include images, SVGs, or other elements.

### Menu

Elements that are marked with the `menu` slot will be put inside the expanding menu. This can be any HTML structure, such as lists, links, buttons, or anything else.

## Configuration

You can customize the position of the expanding menu by providing `placement` and `align` attributes:

```html
<dice-dropdown placement="bottom" align="right"></dice-dropdown>
```

### open

If you want to have a dropdown opened without the user clicking the button first, you can set the `open` attribute:

```html
<dice-dropdown open></dice-dropdown>
```

### placement

**Default:** `bottom`

Can be `bottom`, `top`, `left`, or `right`.

### align

**Default:** `left`

If the `placement` attribute is set to `bottom` or `top`, then this attribute can be either `left` or `right`.

Else, if the `placement` attribute is set to `left` or `right`, this attribute can be `bottom`, `top`.

## Styling

Every element that is passed into the `menu` slot can freely be styled by your existing CSS using IDs, classes, or element selectors.

### Button

To style the button, the `button` part is made available:

```css
dice-dropdown::part(button) {
  background-color: #6c757d;
}

dice-dropdown::part(button):hover {
  background-color: #365934;
}
```

### Menu

To style the menu, the `menu` part is made available:

```css
dice-dropdown::part(menu) {
  border: 1px solid #d3d4d5;
}
```

_Attention:_ overriding existing CSS properties such as `position` can lead to a broken appearance. To avoid breaking the component, don't set the following properties: `position`, `top`, `left`, `right`, and `bottom`.

## Accessibility

Elements inside the dropdown that can receive focus (such as buttons or links) will be indexed automatically and keyboard navigation will be enabled.

A dropdown can be opened by focusing the button and pressing "Enter". Once it's opened, it can be closed by pressing "Escape" or clicking outside.

If a dropdown is opened and has focusable elements inside, the "Tab" key can be used to navigate through them. Once the end is reached, the dropdown will close and the next element in the DOM tree will be focused.

You can also use the Arrow Up & Arrow Down keys to navigate between elements. Pressing "Home" will focus the first element, pressing "End" will focus the last one.

## JavaScript API

### Methods

You can programmatically show or hide the dropdown by calling the appropriate methods:

```js
var dropdown = document.querySelector('dice-dropdown');

// Makes the dropdown appear
dropdown.show();

// Hides the dropdown
dropdown.hide();
```

### Properties

Alternatively to the above methods, you can set the `open` property:

```js
var dropdown = document.querySelector('dice-dropdown');

// Makes the dropdown appear
dropdown.open = true;

// Hides the dropdown
dropdown.open = false;
```

The `open` property also reflects the current state, meaning that if the dropdown is shown, it will return `true`, otherwise `false`.

If you want to change the placement and alignment after the component has been rendered, you can do so via the appropriate properties:

```js
var dropdown = document.querySelector('dice-dropdown');

// This will change the position of the dropdown
dropdown.placement = 'right';
dropdown.align = 'top';
```

The same task can be achieved by updating the attributes:

```js
var dropdown = document.querySelector('dice-dropdown');

// This will change the position of the dropdown
dropdown.setAttribute('placement', 'right');
dropdown.setAttribute('align', 'top');
```
