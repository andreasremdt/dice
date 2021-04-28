# Tabs

The tabs component is used when you want to make certain content visible within the same area only after a user requested it. Say you want to group a page into categories, like _General_, _Settings_, and _Security_; instead of having dedicated pages for them, you could unite them on the same page, separated by a tab menu.

Some prominent web applications that use this pattern are GitHub or Bootstrap.

The `dice-tabs` component is designed with accessiblity and customization in mind. You can freely decide what HTML structure should be inside the tab content and you can rearange the layout of buttons and content freely.

## Usage

Basic HTML structure

```html
<dice-tabs>
  <button slot="tab" data-for="tab1">Tab #1</button>
  <button slot="tab" data-for="tab2">Tab #2</button>

  <div id="tab1">Content of tab #1</div>
  <div id="tab2">Content of tab #2</div>
</dice-tabs>
```

### Buttons

Buttons are what trigger the tab content to show. Clicking on "Tab #1" hides all the other potential tabs and only displays the associated content.

Each tab must have a button with a `slot` attribute set to `tab` and a `data-for` attribute set to a unique ID. The ID is used to reference the content below.

You don't have to pass `button` elements but can instead use any other HTML element, like `a`. A click listener will be attached. For accessibility reasons it's recommended to stick to buttons though.

### Content

You can put any kind of element as content (e.g. `section`, `article`, or `div`). It's important to give a unique ID using the `id` attribute to this element, so that it can be toggled properly.

It doesn't matter which or how many elements are inside each tab content.

## Configuration

There are two attributes that you can set:

```html
<dice-tabs active="tab2" label="This is a nice label"></dice-tabs>
```

### active

Using the `active` attribute allows you to show a tab by default, e.g. when the page is loaded. This attribute is optional. You must provide a valid ID of a tab content element.

### label

The `label` attribute translates to `aria-label` internally and is used for accessiblity. Even though it's optional, it's highly recommended.

## Styling

Since you provide most HTML elements, you can also freely style them with your existing CSS using IDs, classes, or element selectors.

The `dice-tabs` component exposes two parts, which you can also style to change the layout or direction.

### Tabs

All tab buttons are wrapped in a `div` element, which can be styled by using `::part(tabs)`. This way, the buttons could be moved to the bottom, left, or right using CSS Flexbox.

```css
dice-tabs::part(tabs) {
  border-bottom: 1px solid #dee2e6;
}
```

### Content

The tab content is also wrapped in a `div` element, which can be styled by using `::part(content)`.

```css
dice-tabs::part(content) {
  margin-top: 1rem;
}
```

## Accessibility

Tab content is hidden using the `hidden` attribute, which makes it also disappear for screen readers.

Once the first tab button is focused, all other buttons are only reachable via the left or right arrow key (after reaching the end or beginning, they are cycling around). Pressing tab again would focus the content of the currently active tab.

Pressing "Home" will focus the first tab button, pressing "End" will focus the last one.

## JavaScript API

### Methods

You can programmatically show a certain tab via its unique ID by calling the `show` method:

```js
var tabs = document.querySelector("dice-tabs");

tabs.show("some-id");
```

### Properties

Alternatively to the above methods, you can set the `active` property:

```js
var tabs = document.querySelector("dice-tabs");

tabs.active = "some-id";
```

The `active` property also reflects the current state, meaning the ID of the tab which is currently visible.

You can also change the `aria-label` by setting the `label` property:

```js
var tabs = document.querySelector("dice-tabs");

tabs.label = "A new label";
```
