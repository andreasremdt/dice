# Dialog

The dialog component is a common UX pattern in many web applications, like GitHub or Google. It shows initially hidden content (like confirmations, additional information, etc.) after the user clicks a button or another action is triggered.

The `dice-dialog` component is designed with accessiblity and customization in mind. You can freely decide what HTML structure should be inside the dialog and the design can be customized completely, providing only some light defaults.

## Usage

Basic HTML structure

```html
<dice-dialog aria-labelledby="some-id">
  <h1 id="some-id">Hello World</h1>
  <button type="button" onclick="dialog.hideModal();">&times;</button>

  <p>Your content...</p>
</dice-dialog>
```

Everything that you put inside the `dice-dialog` element is part of the dialog and initially hidden. It will only be displayed once this specific dialog is triggered.

## Configuration

### open

```html
<dice-dialog open></dice-dialog>
```

You can set the `open` attribute for the dialog to be immideately visible once the element is mounted or the page has loaded.

## Styling

Every element that is passed into `dice-dialog` can freely be styled by your existing CSS using IDs, classes, or element selectors.

### Backdrop

To style the dialog's background, the `backdrop` part is made available:

```css
dice-dialog::part(backdrop) {
  background-color: rgba(0, 0, 0, 0.5);
}
```

### Dialog

To style the dialog wrapper, the `dialog` part is made available:

```css
dice-dialog::part(dialog) {
  border: unset;
  border-radius: 4px;
}
```

_Attention:_ overriding existing CSS properties such as `position` can lead to a broken appearance. To avoid breaking the component, don't set the following properties: `position`, `top`, `left`, `right`, `bottom`, and `transform`.

## Accessibility

Once a dialog is opened, the focus is trapped inside. If you tab through all tapable elements (such as inputs or buttons) and reach the end, the first element will be focused again. This helps keyboard users not to loose focus of the dialog.

When a dialog is closed, the last focused element (usually the button that opened it) will receive focus again. This way, keyboard users can continue from where they left off.

Pressing ESC closes the dialog.

## JavaScript API

### Methods

You can programmatically show or hide a dialog by calling the appropriate methods:

```js
var dialog = document.querySelector('dice-dialog');

// Makes the dialog appear
dropdown.showModal();

// Hides the dialog
dropdown.hideModal();
```

_Note:_ these methods where named to be as close as possible to the native [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element to ease eventual future migrations.

### Properties

Alternatively to the above methods, you can set the `open` property:

```js
var dialog = document.querySelector('dice-dialog');

// Makes the dialog appear
dialog.open = true;

// Hides the dialog
dialog.open = false;
```

The `open` property also reflects the current state, meaning that if the dialog is visible, it will return `true`, otherwise `false`.
