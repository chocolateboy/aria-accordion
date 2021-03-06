# flexcord

[![Build Status](https://secure.travis-ci.org/chocolateboy/aria-accordion.svg)](http://travis-ci.org/chocolateboy/aria-accordion)
[![NPM Version](http://img.shields.io/npm/v/flexcord.svg)](https://www.npmjs.org/package/flexcord)

- [NAME](#name)
- [INSTALLATION](#installation)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
- [WHY?](#why)
- [TERMINOLOGY](#terminology)
- [TYPES](#types)
  - [AccordionItem](#type-accordion-item)
  - [Options](#type-options)
- [EXPORTS](#exports)
  - [Accordion](#accordion)
     - [METHODS](#accordion-methods)
        - [Accordion.mount](#accordion-mount)
        - [close](#accordion-close)
        - [open](#accordion-open)
        - [toggle](#accordion-toggle)
  - [MultiAccordion](#multiaccordion)
     - [METHODS](#multi-accordion-methods)
        - [MultiAccordion.mount](#multi-accordion-mount)
        - [close](#multi-accordion-close)
        - [open](#multi-accordion-toggle)
        - [toggle](#multi-accordion-toggle)
- [Options](#options)
  - [header](#header)
  - [button](#button)
  - [disabled](#disabled)
  - [panel](#panel)
- [Events](#events)
  - [before:change](#beforechange)
  - [before:close](#beforeclose)
  - [before:open](#beforeopen)
  - [change](#change)
  - [close](#close)
  - [open](#open)
- [DEVELOPMENT](#development)
  - [NPM Scripts](#npm-scripts)
- [COMPATIBILITY](#compatibility)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

# NAME

flexcord - flexible ARIA-first accordions which work with your existing CSS, markup, and code

# INSTALLATION

    $ npm install flexcord

# SYNOPSIS

### JavaScript

```javascript
import { Accordion, MultiAccordion } from 'flexcord'

for (const el of document.querySelectorAll('.accordion')) {
    const klass = el.hasAttribute('data-multi-select') ? MultiAccordion : Accordion
    klass.mount(el, options)
}
```

### CSS

```css
/* hide closed panels (the default) */
.accordion [aria-hidden="true"] {
    display: none;
}
```

### HTML

**before**:

```html
<div class="accordion">
    <div role="heading">
        <button aria-controls="foo-panel">Foo</button>
    </div>
    <section id="foo-panel">...</section>

    <div role="heading">
        <button aria-controls="bar-panel" aria-expanded="true">Bar</button>
    </div>
    <section id="bar-panel">...</section>

    <div role="heading">
        <button aria-controls="baz-panel">Baz</button>
    </div>
    <section id="baz-panel">...</section>
</div>
```

**after**:

```html
<div role="presentation" class="accordion">
    <div role="heading">
        <button
            id="header-abc"
            aria-controls="foo-panel"
            aria-expanded="false">Foo</button>
    </div>
    <section
        id="foo-panel"
        role="region"
        aria-labelledby="header-abc"
        aria-hidden="true">...</section>

    <div role="heading">
        <button
            id="header-def"
            aria-controls="bar-panel"
            aria-expanded="true">Bar</button>
    </div>
    <section
        id="bar-panel"
        role="region"
        aria-labelledby="header-def"
        aria-hidden="false">...</section>

    <div role="heading">
        <button
            id="header-ghi"
            aria-controls="baz-panel"
            aria-expanded="false">Baz</button>
    </div>
    <section
        id="baz-panel"
        role="region"
        aria-labelledby="header-ghi"
        aria-hidden="true">...</section>
</div>
```

# DESCRIPTION

flexcord is a library which implements flexible, ARIA-first accordions which work with
your markup, CSS and code rather than the other way round.

# WHY?

There are many accordion implementations on NPM, but most of them bake into their APIs
the specific use case for which they were conceived, usually in the form of classes and/or
data attributes that must be defined in the HTML and overridden in the CSS to take advantage
of their functionality.

This makes them perfect for anyone who has exactly the same use case, and inconvenient for anyone
who doesn't. flexcord is designed to adapt to the conventions your app or framework already uses,
while also supporting zero-configuration usage out of the box by leveraging the conventions established
in the [WAI-ARIA accordion design-pattern](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/#accordion).

# TERMINOLOGY

The following terms are used in the description below:

## header <a name="terminology-header"></a>

A header-like element (e.g. H1, H2 etc.) which typically contains a button-like element which triggers
the opening/closing of its corresponding accordion panel.

## button  <a name="terminology-button"></a>

A clickable element within a header which triggers the opening/closing of its corresponding accordion panel.

## panel  <a name="terminology-panel"></a>

A section which is displayed when an accordion header is activated/expanded and hidden when it is de-activated/collapsed.

# TYPES

The following types are referenced in the descriptions below:

## AccordionItem <a name="type-accordion-item"></a>

An object representing a header/panel pair in an accordion:

```typescript
type AccordionItem = {
    accordion: HTMLElement;
    button: HTMLElement;
    header: HTMLElement;
    index: number;
    isOpen: boolean;
    panel: HTMLElement;
}
```

## Options <a name="type-options"></a>

Optional hooks to configure an accordion's HTML bindings and behavior.

```typescript
type Options = {
    header?: string | (accordion: HTMLElement) => Iterable<HTMLElement>;
    button?: string | ({ accordion: HTMLElement, header: HTMLElement }) => HTMLElement;
    disabled?: (item: AccordionItem, next: () => boolean) => boolean;
    panel?: ({ accordion: HTMLElement, button: HTMLElement, header: HTMLElement }) => HTMLElement;
}
```

# EXPORTS

## Accordion

An accordion in which no more than one panel can be open at a time.

### METHODS <a name="accordion-methods"></a>

#### Accordion.mount <a name="accordion-mount"></a>

**Type**: (el: HTMLElement, options?: [Options](#type-options)) → Accordion

An alternative way to call the accordion class's constructor i.e.:

```javascript
Accordion.mount(el, options)
```

is equivalent to:

```javascript
new Accordion(el, options)
```

#### close <a name="accordion-close"></a>

**Type**: () → this

Closes the currently open panel, if any.

**Type**: (index: number) → this

Closes the panel at the specified (0-based) index.

#### open <a name="accordion-open"></a>

**Type**: (index: number) → this

Opens the panel at the specified (0-based) index.

#### toggle <a name="accordion-toggle"></a>

**Type**: (index: number, open?: boolean) → this

Toggles the panel at the specified (0-based) index i.e. opens it if it's closed or closes it if it's open.
Can take an optional boolean state to set the panel to.

## MultiAccordion

An accordion in which mupltiple panels can be open at the same time.

### METHODS <a name="multi-accordion-methods"></a>

#### MultiAccordion.mount <a name="multi-accordion-mount"></a>

**Type**: (el: HTMLElement, options?: [Options](#type-options)) → MultiAccordion

An alternative way to call the accordion class's constructor. See [`Accordion.mount`](#accordion-mount) for more details.

#### close <a name="multi-accordion-close"></a>

**Type**: () → this

Closes all open panels.

**Type**: (index: number) → this

Closes the panel at the specified (0-based) index.

**Type**: (index: Array&lt;number&gt;) → this

Closes the panel at the specified (0-based) indices.

#### open <a name="multi-accordion-toggle"></a>

**Type**: () → this

Opens all open panels.

**Type**: (index: number) → this

Opens the panel at the specified (0-based) index.

**Type**: (index: Array&lt;number&gt;) → this

Opens the panel at the specified (0-based) indices.

#### toggle <a name="multi-accordion-toggle"></a>

**Type**: () → this

Toggles the open state of all panels i.e. opens all closed panels and closes all open panels.

**Type**: (index: number) → this

Toggles the open state of the panel at the specified (0-based) index.

**Type**: (indices: Array&lt;number&gt;) → this

Toggles the open state of the panels at the specified (0-based) indices.

# Options

The constructor takes an optional [Options](#type-options) object with the following (optional) fields.

## header

**Type**: string | (accordion: HTMLElement) → Iterable&lt;HTMLElement&gt; <br />
**Default**: `"[role='heading']"`

A selector which returns a collection (e.g. NodeList, Array, jQuery instance etc.) of DOM elements
representing the header-like elements inside the accordion. Headers are elements which contain (or
*are*) an element which triggers the opening/closing of the corresponding panel.

The default value matches elements with a `heading` role.

If supplied as a string, it is interepeted as a CSS3 selector and converted into a function which
returns a NodeList resulting from the evaluation of the selector against the accordion with `querySelectorAll`.

## button

**Type**: string | ({ accordion: HTMLElement, header: HTMLElement }) → HTMLElement <br />
**Default**: `"[aria-controls]"`

A selector (string) or function which returns an element in the header which functions like a button.
An `onclick` event handler is attached to this element which triggers the opening/closing of the
associated panel.

The default value selects the first element in the header with a non-empty `aria-controls` attribute.

Typically, the button element is the child/descendant of an element which functions like a [header](#header)
element (e.g. H1, H2 etc.). By default, this is an element with a `heading` role e.g.:

```html
<div class="accordion">
    <div role="heading">
        <button aria-controls="foo-panel">Foo</button>
    </div>
    <section id="foo-panel">...</section>

    <div role="heading">
        <button aria-controls="bar-panel">Bar</button>
    </div>
    <section id="bar-panel">...</section>
</div>
```

\- but they can easily be the same element if a suitable selector is supplied e.g.:

```html
<div class="accordion">
    <button aria-controls="foo-panel">Foo</button>
    <section id="foo-panel">...</section>

    <button aria-controls="bar-panel">Bar</button>
    <section id="bar-panel">...</section>
</div>
```

```javascript
Accordion.mount(el, {
    header: '[aria-controls]',
    button: ({ accordion, header }) => header,
})
```

## disabled

**Type**: (item: [AccordionItem](#type-accordion-item), next: () → boolean) → boolean

A callback used to determine whether an item is disabled. Disabled items don't respond to open or close (or toggle) actions.

The `next` parameter is a function which calls the default `disabled` implementation with the same [AccordionItem](#type-accordion-item) object.
The default implementation returns true if the item's button element has an `aria-disabled="true"` attribute, or false otherwise.

Can be used e.g. to avoid opening/closing items with a disabled button:

```javascript
// disable <button disabled>...</button> as well as <button aria-disabled="true">...</button>
function disabled ({ button }, next) {
    return button.hasAttribute('disabled') || next()
}

const accordion = new Accordion(el, { disabled })
```

\- or to disable every item in an accordion:

```html
<div class="accordion" data-disabled="true">
    ...
</div>
```

```javascript
function disabled ({ accordion }) {
    return accordion.getAttribute('data-disabled') === 'true'
}

const accordion = new Accordion(el, { disabled })
```

## panel

**Type**: string | ({ accordion: HTMLElement, button: HTMLElement, header: HTMLElement }) → HTMLElement

The container of the content to display/hide when the corresponding header is activated/de-activated.

The default value is a function which selects the element whose ID corresponds to the button's `aria-controls` ID.

# Events

Accordions implement the [EventEmitter](https://nodejs.org/api/events.html) interface and support the following
events.

## before:change

**Type**: (item: [AccordionItem](#accordionitem), type: string, accordion: Accordion) → void

Fired after a button is clicked and before its corresponding panel is opened or closed. Passed the action
(i.e. "open" or "close") as a parameter.

## before:close

**Type**: (item: [AccordionItem](#accordionitem), accordion: Accordion) → void

Fired after a button is clicked and before its corresponding panel is closed.

## before:open

**Type**: (item: [AccordionItem](#accordionitem), accordion: Accordion) → void

Fired after a button is clicked and before its corresponding panel is opened.

## change

**Type**: (item: [AccordionItem](#accordionitem), type: string, accordion: Accordion) → void

Fired after a panel is opened or closed. Passed the action (i.e. "open" or "close") as a parameter.

## close

**Type**: (item: [AccordionItem](#accordionitem), accordion: Accordion) → void

Fired after a panel is closed.

## open

**Type**: (item: [AccordionItem](#accordionitem), accordion: Accordion) → void

Fired after a panel is opened.

# DEVELOPMENT

<details>

## NPM Scripts

The following NPM scripts are available:

- build - compile and bundle the library for testing and release
- clean - remove temporary files and build artifacts
- test - run the test suite

</details>

# COMPATIBILITY

- &gt; 1% of browsers
- IE 11
- not Opera Mini

# SEE ALSO

- [@accede-web/accordion](https://www.npmjs.com/package/@accede-web/accordion) - a dependency-free WAI-ARIA accordion plugin
- [@accede-web/tablist](https://www.npmjs.com/package/@accede-web/tablist) - a dependency-free WAI-ARIA tab plugin
- [element-scope-ids](https://www.npmjs.com/package/element-scope-ids) - scope IDs to an element by rewriting them to be globally unique
- [posthtml-aria-tabs](https://www.npmjs.com/package/posthtml-aria-tabs) - a PostHTML plugin for creating accessible tabs with minimal markup

# VERSION

0.1.1

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018-2019 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
