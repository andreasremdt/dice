# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-ahlpa.1] - 2021-05-07

### `dice-select`

- Improved the search behavior when the `searchable` attribute is present
- Fixed attributes not being observed
- Added more public API to reflect internal state

## [0.0.11-alpha] - 2021-05-07

- Added a build pipeline with [rollup](https://rollupjs.org/)
- Added [ESLint](https://eslint.org/)

### `dice-select`

- Improved keyboard navigation
- Improved accessibility
- Added public API
- Moved the component into a dedicated folder

### `dice-dialog`

- Fix attributes (`open`) not being observed when changed
- Rename public API from `showModal()` and `hideModal()` to `show()` and `hide()` for better alignment with other components

## [0.0.10-alpha] - 2021-05-02

### `dice-textarea`

- Improved the public API to better reflect the textarea's state
- Improved and added validation rules for `maxlength`, `minlength`, and `pattern`
- Added an event dispatcher for the `change` event
- Added initial documentation
- Moved the component and its documentation into a dedicated folder

## [0.0.9-alpha] - 2021-05-01

### `dice-tooltip`

- Added keyboard navigation
- Added `template` attribute
- Made the component more customizable using CSS Custom Properties
- Improved accessibility
- Improved the internal rendering of the HTML
- Added initial documentation
- Moved the component and its documentation into a dedicated folder

## [0.0.8-alpha] - 2021-04-27

### `dice-dropdown`

- Fixed a bug in which would break the placement if no custom `--spacing` CSS prop is defined.

### `dice-tabs`

- Added keyboard navigation
- Changed the `selected` option to be named `active`
- Improved accessibility
- Improved the internal rendering of the HTML
- Added initial documentation
- Moved the component and its documentation into a dedicated folder

### `dice-dialog`

- Added keyboard navigation
- Changed the `selected` option to be named `active`
- Improved accessibility
- Improved the internal rendering of the HTML
- Added initial documentation
- Moved the component and its documentation into a dedicated folder

## [0.0.7-alpha] - 2021-04-23

- Updated the README.md

### `dice-dropdown`

- Added keyboard navigation
- Added more options to customize the dropdown's position (`align` and `placement`)
- Improved accessibility
- Changed the internal HTML structure from `details` to a simple `button`
- Added initial documentation
- Moved the component and its documentation into a dedicated folder

## [0.0.6-alpha] - 2021-04-22

- Added `dice-tooltip` component

## [0.0.5-alpha] - 2021-04-09

- Added `dice-select` component

## [0.0.4-alpha] - 2021-04-09

- Added `dice-dialog` component

## [0.0.3-alpha] - 2021-04-09

- Added `dice-tabs` component

## [0.0.2-alpha] - 2021-04-07

- Added `dice-dropdown` component

## [0.0.1-alpha] - 2021-04-06

- Initial release
- Added `dice-textarea` component
