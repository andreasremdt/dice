# Textarea

The `dice-textarea` component adds one new feature to the standard `textarea` element: growing automatically with its content. Normally, you'd have to change the height of a `textarea` programmatically via JavaScript depending on the entered value. This work can be eliminated by using `dice-textarea`.

_Warning:_ this component makes use of the new [ElementInternals interface](https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface), which is (at the time of writing this document) not supported by all browsers. You can use the [polyfill](https://www.npmjs.com/package/element-internals-polyfill) to make it work in your browser.

## Usage

Basic HTML structure

```html
<dice-textarea name="bio" id="bio" placeholder="Start writing..." required></dice-textarea>
```

## Configuration

The usage of this component is exactly the same as you would expect from a default textarea element. All attributes, like `value`, `pattern`, `maxlength`, etc. can be used.

## Styling

Due to the internal implementation of the textarea element, there are two elements that can be styled:

```css
dice-textarea::part(wrapper),
dice-textarea::part(textarea) {
  --padding: 0.375rem 0.75rem;
  max-height: 100px;
}
```

The `wrapper` is needed to correctly calculate to the height of the textarea once it starts growing. If you want to style properties like `padding`, `max-height` or `height`, you need to set these values on both parts.

_Note:_ if you just want to change the `padding`, you can do so by using the `--padding` CSS Custom Property on the `wrapper` part.

If you just want to style the appearance of the textarea (`border`, `color`, etc.), you can use the `textarea` part:

```css
dice-textarea::part(textarea) {
  width: 100%;
  font-size: 1rem;
  font-weight: 400;
}
```

_Attention:_ overriding existing CSS properties such as `grid-area` or `overflow` can lead to a broken appearance. To avoid breaking the component, don't set the following properties: `display`, `grid-area`, and `overflow`.

## Accessibility

The `dice-textarea` is pretty much identical to the native `textarea` element, hence no special accessibility features have been added.

## JavaScript API

The `dice-textarea` element, if wrapped in a form, works as a form element and can provide its `value` like any other input element.

```js
document.querySelector("form").addEventListener("submit", (evt) => {
  evt.preventDefault();

  // Given that the first element is `dice-textarea`:
  console.log(evt.target[0].value);
});
```

Alternatively, you can use the FormData API to collect form values. Remember to set a `name` attribute to the `dice-textarea`:

```js
document.querySelector("form").addEventListener("submit", (evt) => {
  evt.preventDefault();

  var formData = new FormData(evt.target);

  // Given that the `dice-textarea` has a `name` attribute of "bio":
  console.log(formData.get("bio"));
});
```

### Events

`dice-textarea` emits the same events as the native `textarea` element, hence you can just add event listeners like so:

```js
document.querySelector("dice-textarea").addEventListener("change", (evt) => {
  console.log(evt.target.value);
});

document.querySelector("dice-textarea").addEventListener("focus", (evt) => {
  console.log("focused");
});

document.querySelector("dice-textarea").addEventListener("blur", (evt) => {
  console.log("blurred");
});
```

### Properties

All valid `textarea` properties (like `maxLength`, `required`, or `value`) are reflected via properties and can be accessed or set:

```js
var textarea = document.querySelector("dice-textarea");

// Sets the new value
textarea.value = "123";

// Gets the current value
console.log(textarea.value);
```

The same task can be achieved by updating the attributes:

```js
var textarea = document.querySelector("dice-textarea");

// Sets the new value
textarea.setAttribute("value", "123");

// Gets the current value
console.log(textarea.getAttribute("value"));
```
