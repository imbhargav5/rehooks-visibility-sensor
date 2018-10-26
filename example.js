import React, { useState, useRef } from "react";
import { render } from "react-dom";
import useVisibilitySensor from "./";

function Example() {
  // Declare a new state variable, which we'll call "count"
  const rootNode = useRef(null);
  const { isVisible, visibilityRect } = useVisibilitySensor(rootNode, {
    intervalCheck: false,
    scrollCheck: true,
    resizeCheck: true,
    partialVisibility: false
  });
  return (
    <div ref={rootNode} style={{ border: "1px dashed black" }}>
      <p>
        {isVisible ? "Visible" : isVisible === null ? "Null" : "Not Visible"}
      </p>
    </div>
  );
}

function App() {
  return (
    <div>
      <div style={{ height: 1500 }} />
      <Example />
      <div style={{ height: 1500 }} />
    </div>
  );
}

render(<App />, window.root);
