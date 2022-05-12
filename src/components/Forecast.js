import React from "react";
import { useEffect, useState } from "react";

import "../App.css";

import {
  WiDaySunny,
  WiCloud,
  WiRainMix,
  WiRain,
  WiThunderstorm, // squall
  WiSnow,
  WiFog, // mist, fog, sand, dust, ash
  WiSmoke,
  WiDayHaze,
  WiDust,
  WiTornado,
  WiVolcano,
} from "react-icons/wi";

export default function Forecast(props) {
  //props forecast, weather, WeatherIcons, temp symbol, temp value
  // celsius, fahrenit
  const [weatherIcon, setWeatherIcon] = useState("");
  const [tempSymbol, setTempSymbol] = useState("");

  const [celsius, setCelsius] = useState(0);
  const [fahrenheit, setFahrenheit] = useState(0);

  let forecastArray = props.array;
  let weather = "";

  let iconStyle = {
    color: props.bgColor,
  };

  return (
    <div className="card-container">
      {forecastArray.map((card, index) => {
        if (index === 0) return;

        return (
          <div className="card" key={index}>
            <h3 className="weekday">{card.weekday}</h3>
            <h2 className="forecast-icon" style={iconStyle}>
              {card.icon}
            </h2>
            <h2 className="forecast-tempNumber">
              {props.tempSymbol != "℃"
                ? Math.round(card.temp * 1.8 + 32)
                : card.temp}
              <span className="degreeSymbol">°</span>
            </h2>
          </div>
        );
      })}
    </div>
  );
}
