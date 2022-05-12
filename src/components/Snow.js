import React from "react";

export default function Snow() {
  let numbers = [];

  for (let i = 0; i < 200; i++) {
    numbers.push(i);
  }

  let Snow = numbers.map(number => <div className="snow"></div>);

  return <div>{Snow}</div>;
}
