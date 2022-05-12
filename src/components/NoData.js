import { useEffect, useState } from "react";

import React from "react";
import "../App.css";
import { ImSad } from "react-icons/im";

export default function NoData(props) {
  let input = props.search;

  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });

  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  return (
    <div className="nodata-container">
      <div className="sad-face">
        <ImSad />
      </div>
      {screenSize.dynamicWidth < 850 || input.length > 15 ? (
        <h2>unable to find city</h2>
      ) : (
        <h2>unable to find city '{props.search}'</h2>
      )}
    </div>
  );
}
