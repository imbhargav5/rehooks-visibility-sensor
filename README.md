# `@rehooks/visibility-sensor`

> React hook for visibility sensing a ref

It checks whether an element has scrolled into view or not. A lot of the logic is taken from [react-visibility-sensor](https://github.com/joshwnj/react-visibility-sensor) and is rewritten for the hooks proposal.

> **Note:** This is using the new [React Hooks API Proposal](https://reactjs.org/docs/hooks-intro.html)
> which is subject to change until React 16.7 final.
>
> You'll need to install `react`, `react-dom`, etc at `^16.7.0-alpha.0`

## Install

```sh
yarn add @rehooks/visibility-sensor
```

## Usage

```js
import useVisibilitySensor from "@rehooks/visibility-sensor";

function MyComponent() {
  const isVisible = useVisibilitySensor(rootNode, {
    intervalCheck: false,
    scrollCheck: true,
    resizeCheck: true
  });
  // value == ...
  return (
    <div>
      <p>
        {isVisible ? "Visible" : isVisible === null ? "Null" : "Not Visible"}
      </p>
    </div>
  );
}
```
