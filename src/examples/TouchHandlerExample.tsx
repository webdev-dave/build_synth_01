import React from "react";
import PreventDefaultTouchWrapper from "../components/wrappers/PreventDefaultTouchWrapper";

const buttonStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  margin: "10px",
  border: "1px solid #ccc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  userSelect: "none",
  backgroundColor: "#f0f0f0",
};

const containerStyle: React.CSSProperties = {
  padding: "20px",
  border: "2px dashed #ccc",
  margin: "20px 0",
};

/**
 * This example file demonstrates various use cases for the PreventDefaultTouchWrapper component.
 */
const TouchHandlerExample: React.FC = () => {
  return (
    <div>
      <h1>PreventDefaultTouchWrapper Component Examples</h1>

      <p>
        The PreventDefaultTouchWrapper component is designed to wrap other
        components and prevent unwanted default touch behaviors like scrolling,
        zooming, or the context menu.
      </p>

      <h2>Example 1: Basic Usage with a Draggable Box</h2>
      <p>
        Here, the PreventDefaultTouchWrapper wraps a simple div. Try to
        long-press or use multiple fingers on the box. The browser&apos;s
        default actions should be prevented.
      </p>
      <PreventDefaultTouchWrapper style={containerStyle}>
        <div style={buttonStyle}>Drag Me!</div>
      </PreventDefaultTouchWrapper>

      <h2>Example 2: Allowing the Context Menu</h2>
      <p>
        In this case, we set `preventContextMenu` to `false`. Now, a long-press
        or right-click on a desktop should bring up the normal context menu.
      </p>
      <PreventDefaultTouchWrapper
        style={containerStyle}
        preventContextMenu={false}
      >
        <div style={buttonStyle}>Right-click me!</div>
      </PreventDefaultTouchWrapper>

      <h2>Example 3: Wrapping Multiple Elements</h2>
      <p>
        The PreventDefaultTouchWrapper can wrap any number of child elements.
        All children within the handler will inherit the touch-blocking
        behavior.
      </p>
      <PreventDefaultTouchWrapper style={containerStyle}>
        <div style={buttonStyle}>Button 1</div>
        <div style={buttonStyle}>Button 2</div>
        <div style={buttonStyle}>Button 3</div>
      </PreventDefaultTouchWrapper>
    </div>
  );
};

export default TouchHandlerExample;
