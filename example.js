import React, { useState, useRef } from "react";
import { render } from "react-dom";
import useVisibilitySensor from "./";

function Example() {
  // Declare a new state variable, which we'll call "count"
  const rootNode = useRef(null);
  const isVisible = useVisibilitySensor(rootNode, {
    intervalCheck: 1000
  });
  console.log(isVisible);
  const [count, setCount] = useState(0);

  return (
    <div ref={rootNode}>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>
        {" "}
        {isVisible
          ? "Visible"
          : isVisible === null
            ? "Null"
            : "Not Visible"}{" "}
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
