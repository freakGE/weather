import React from "react";
import "./Preload.css";

export default function Preload(props) {
  let style = {
    backgroundColor: props.bgColor,
  };
  return (
    <div className="full" style={style}>
      <div className="bubblingG">
        <span id="bubblingG_1"></span>
        <span id="bubblingG_2"></span>
        <span id="bubblingG_3"></span>
      </div>
    </div>
  );
}
