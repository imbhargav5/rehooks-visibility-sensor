"use strict";
let test = require("ava");
let { createElement: h, useRef } = require("react");
let ReactTestRenderer = require("react-test-renderer");
let useVisibilitySensor = require("./");

function render(val) {
  return ReactTestRenderer.create(val);
}

test("returns value of the right structure", t => {
  function Component() {
    let rootRef = useRef(null);
    let value = useVisibilitySensor(rootRef);
    return h("div", {
      ref: rootRef,
      ...value
    });
  }

  let element = render(h(Component));

  t.is(element.toJSON().props.isVisible, null);
  t.deepEqual(element.toJSON().props.visibilityRect, {});
});
