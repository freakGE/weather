import { useEffect, useState } from "react";

import cityTimezones from "city-timezones";
import moment from "moment-timezone";

//css
import "./App.css";

//components
import Snow from "./components/Snow";
import Forecast from "./components/Forecast";
import NoData from "./components/NoData";

import Preload from "./components/Preload";

//icons

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

import { AiOutlineSearch } from "react-icons/ai";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { IoMoonOutline } from "react-icons/io5";
import MetaTags from "./components/MetaTags";

function App() {
  const cityTimezones = require("city-timezones");
  const [loading, setLoading] = useState(false);

  const [foundData, setFoundData] = useState(false);

  const [city, setCity] = useState("London"); //default London

  const [countryText, setCountryText] = useState("");
  const [cityText, setCityText] = useState("");

  const [weatherName, setWeatherName] = useState("");

  const [weather, setWeather] = useState("");
  const [celsius, setCelsius] = useState(0);
  const [fahrenheit, setFahrenheit] = useState(0);
  const [isCelsius, setIsCelsius] = useState(true);
  const [tempValue, setTempValue] = useState(celsius);
  const [tempSymbol, setTempSymbol] = useState("℃");

  const [bgAnimation, setBgAnimation] = useState("");
  const [bgColor, setBgColor] = useState("hsl(209, 52%, 68%)"); // hsl(197, 71%, 73%) skyblue
  const [darkerBgColor, setDarkerBgColor] = useState("");
  const [lighterBgColor, setLighterBgColor] = useState("");

  const [isRaining, setIsRaining] = useState(false);
  const [isSnowing, setIsSnowing] = useState(false);

  const [weatherIcon, setWeatherIcon] = useState("");

  const [btnHover, setBtnHover] = useState(false);

  const [forecastArray, setForecastArray] = useState([]);

  const [date, setDate] = useState("");

  const [nightBg, setNightBg] = useState(false);

  // const [timeAnomaly, setTimeAnomaly] = useState(true);

  const [inputValue, setInputValue] = useState("");

  ///
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

  ///

  const tempChange = () => {
    setIsCelsius(!isCelsius);
    tempSymbol === "℃" ? setTempValue(fahrenheit) : setTempValue(celsius);
  };

  useEffect(() => {
    isCelsius ? setTempSymbol(symbol => "℃") : setTempSymbol(symbol => "℉");
  }, [isCelsius]);

  useEffect(() => {
    tempSymbol === "℉" ? setTempValue(fahrenheit) : setTempValue(celsius);
  }, [celsius, fahrenheit]);

  const handleChange = e => {
    setCity(e.target.value);
  };

  let bgStyle = {
    position: "absolute",
    backgroundColor: `${bgColor}`,
    zIndex: "-1",
  };

  // let forecastArray = [];

  const searchData = (
    cityName = "London",
    forecast = 40,
    key = "93d975cad85058b5990c063d2c26a66d"
  ) => {
    // cityName = city;
    // if (city.length !== 0) {
    // e.preventDefault();
    // key = '93d975cad85058b5990c063d2c26a66d';
    setCityText(text => city);

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&cnt=${forecast}&appid=${key}&units=metric`,
      {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          name: `${cityName}`,
        }),
      }
    )
      .then(Response => {
        if (!Response.ok) {
          setFoundData(false);
          setBgAnimation("");
          throw Error(`could not fetch the data for that resource`);
        }
        setFoundData(true);
        return Response.json();
      })
      .then(data => {
        let cityNameDefault = data.city.name;
        let cityNameFirstLetters = "";
        function getFirstLetters(str) {
          let firstLetters = "";

          let checker = str.split(" ");
          let checkerTwo = str.split("-");

          if (checker.length === 1) {
            if (checkerTwo.length === 1) {
              // Gasselterboerveenschemond
              // Gas
              firstLetters = str.slice(0, 3);
            } else {
              // Port-au-Prince
              // PaP
              firstLetters = str
                .split("-")
                .map(word => word[0])
                .join("");
            }
          } else {
            // Feira De Santana
            // FDS
            firstLetters = str
              .split(" ")
              .map(word => word[0])
              .join("");
          }

          cityNameFirstLetters = firstLetters;
        }
        getFirstLetters(cityNameDefault);

        setCountryText(text => {
          if (screenSize.dynamicWidth < 370) {
            return `${data.city.country}`;
          } else if (
            cityNameDefault.length > 10 ||
            screenSize.dynamicWidth < 550
          ) {
            return `${cityNameFirstLetters.toLowerCase()}, ${
              data.city.country
            }`;
          } else {
            return `${cityNameDefault.toLowerCase()}, ${data.city.country}`;
          }
        });

        let newDate = new Date();
        let newDateString = newDate.toString();
        let newDateStringSplitted = newDateString.split(" ");

        let weekdays = new Array(7);
        weekdays[0] = "Sun";
        weekdays[1] = "Mon";
        weekdays[2] = "Tue";
        weekdays[3] = "Wed";
        weekdays[4] = "Thu";
        weekdays[5] = "Fri";
        weekdays[6] = "Sat";

        let weekday = newDateStringSplitted[0];
        let weekdayNumber = weekdays.indexOf(weekday);

        // time
        //                    //
        //!
        // data.city.country      >
        let cityTime;

        let cityNameCheck = city.split(",");
        // const cityTimezones = require("city-timezones");
        let cityNameChecked = cityNameCheck[0];
        let cityArray = cityTimezones.lookupViaCity(cityNameChecked);

        cityArray.forEach(place => {
          if (data.city.country === place.iso2) {
            cityTime = new Date().toLocaleString("en-GB", {
              timeZone: `${place.timezone}`,
            });
          }
        });
        //!
        //currentHourse = currentHours ~
        let sunrise = new Date(data.city.sunrise * 1000);
        let sunset = new Date(data.city.sunset * 1000);

        let sunriseHours = sunrise.getHours();
        let sunsetHours = sunset.getHours();

        // current date
        let currentDate = new Date();

        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1;
        let currentDay = currentDate.getDate();

        let cyString = "";
        let cmString = "";
        let cdString = "";

        if (currentYear < 10) {
          cyString = `0${currentYear}`;
        } else {
          cyString = `${currentYear}`;
        }

        if (currentMonth < 10) {
          cmString = `0${currentMonth}`;
        } else {
          cmString = `${currentMonth}`;
        }
        if (currentDay < 10) {
          cdString = `0${currentDay}`;
        } else {
          cdString = `${currentDay}`;
        }

        let dateFormat = `${cyString}-${cmString}-${cdString}`;

        let crDate = currentDate.toString();
        let ourDate = crDate.split(" ");
        setDate(`${ourDate[0]}, ${ourDate[1]} ${ourDate[2]}`);
        // current time
        // console.log(data.list[0].dt_txt);
        // console.log(cityTime);

        let [cityCurrentDate, cityCurrentTime] = cityTime.split(", ");

        let [cityCurrentHours, cityCurrentMinutes, cityCurrentSeconds] =
          cityCurrentTime.split(":");

        let currentHoursOfCity = cityCurrentHours;

        if (60 - cityCurrentMinutes < 30) {
          cityCurrentMinutes = 0;
          cityCurrentHours = `${parseInt(cityCurrentHours) + 1}`;
        } else {
          cityCurrentMinutes = 0;
          cityCurrentHours = cityCurrentHours;
        }

        let suitHoursToAPI = Math.round(parseInt(cityCurrentHours) / 3) * 3;

        let chString = "";
        let cminString = "";
        let csecString = "";

        if (cityCurrentHours < 10) {
          chString = `0${cityCurrentHours}`;
        } else {
          chString = `${cityCurrentHours}`;
        }
        if (cityCurrentMinutes < 10) {
          cminString = `0${cityCurrentMinutes}`;
        } else {
          cminString = `${cityCurrentMinutes}`;
        }
        if (cityCurrentSeconds < 10) {
          csecString = `0${cityCurrentSeconds}`;
        } else {
          csecString = `${cityCurrentSeconds}`;
        }
        if (suitHoursToAPI >= 24) {
          suitHoursToAPI = "0";
          cdString = `${parseInt(cdString) + 1}`;
        }

        dateFormat = `${cyString}-${cmString}-${cdString}`;
        let timeFormat =
          parseInt(suitHoursToAPI) < 10
            ? `0${suitHoursToAPI}:00:00`
            : `${suitHoursToAPI}:00:00`;

        let roundedCurrentTime = `${dateFormat} ${timeFormat}`;

        //                    //

        let todayWeather = "";
        let todayTemp = "";

        //weather today
        // data.list.forEach((days, index) => {
        //   //!
        //   if (days.dt_txt === roundedCurrentTime) {
        //     // setTimeAnomaly(false);
        //     todayWeather = days.weather[0].main;
        //     todayTemp = Math.round(days.main.temp);
        //     let todayFahrenheit = Math.round(todayTemp * 1.8 + 32);
        //     setWeather(weather => todayWeather);
        //     setCelsius(temp => todayTemp);
        //     setFahrenheit(temp => todayFahrenheit);
        //     console.log(index, "+++++", days.main.temp);
        //   } else if (index === 1) {
        //     console.log(index, "-----", days.main.temp); // shesadzlo problema timerounded 00:00:00 zee!
        //     todayWeather = days.weather[0].main;
        //     todayTemp = Math.round(days.main.temp);
        //     let todayFahrenheit = Math.round(todayTemp * 1.8 + 32);
        //     setWeather(weather => todayWeather);
        //     setCelsius(temp => todayTemp);
        //     setFahrenheit(temp => todayFahrenheit);
        //   }
        // });
        // console.log(roundedCurrentTime, "+++");

        data.list.forEach((days, index) => {
          //!
          if (index === 0) {
            todayWeather = days.weather[0].main;
            todayTemp = Math.round(days.main.temp);
            let todayFahrenheit = Math.round(todayTemp * 1.8 + 32);
            setWeather(weather => todayWeather);
            setCelsius(temp => todayTemp);
            setFahrenheit(temp => todayFahrenheit);
            // console.log(index, "-----", days.main.temp); //!
          }
          if (days.dt_txt === roundedCurrentTime) {
            // console.log(index, "+++++", days.main.temp); //!
            // setTimeAnomaly(false);
            todayWeather = days.weather[0].main;
            todayTemp = Math.round(days.main.temp);
            let todayFahrenheit = Math.round(todayTemp * 1.8 + 32);
            setWeather(weather => todayWeather);
            setCelsius(temp => todayTemp);
            setFahrenheit(temp => todayFahrenheit);
          }
        });
        // console.log("-----------------------------------");
        // console.log("time ~: ", timeRounded); ///

        // console.log(city); //!
        // data.list.forEach(days => {
        //   console.log(days.dt_txt);
        //   console.log(days.weather[0].main);
        //   console.log(days.main.temp);
        //   console.log("--------------------");
        // });
        ////////////////////////////////
        // todayWeather = data.list[0].weather[0].main;
        // todayTemp = Math.round(data.list[0].main.temp);
        // let todayFahrenheit = Math.round(todayTemp * 1.8 + 32);
        // setWeather(weather => todayWeather);
        // setCelsius(temp => todayTemp);
        // setFahrenheit(temp => todayFahrenheit);
        ////////////////////////////////

        if (sunriseHours > 7) {
          sunriseHours = 7;
        }
        if (sunsetHours < 21) {
          sunsetHours = 21;
        }

        let isNight =
          currentHoursOfCity <= sunriseHours ||
          currentHoursOfCity >= sunsetHours; // 21 - 07 default

        if (isNight) {
          setNightBg(true);
        }

        switch (todayWeather) {
          case "Clear":
            setBgAnimation("");
            if (isNight) {
              setWeatherName(name => `Clear`);
              setBgColor(color => `hsl(291, 36%, 22%)`);
              setWeatherIcon(icon => (
                <span className="moonIcon">
                  <IoMoonOutline />
                </span>
              ));
            } else {
              setWeatherName(name => `Sunny`);
              setBgColor(color => `hsl(24, 99%, 63%)`);
              setWeatherIcon(icon => <WiDaySunny />);
            }
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Clouds":
            setBgAnimation("");
            setWeatherName(name => `Cloudy`);
            setWeatherIcon(icon => <WiCloud />);
            isNight
              ? setBgColor(color => `hsl(291, 30%, 32%)`)
              : setBgColor(color => `hsl(24, 93%, 73%)`);

            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Drizzle":
            setBgAnimation("bg-drizzle");
            setWeatherName(name => `Drizzly`);
            isNight
              ? setBgColor(color => `hsl(227, 31%, 34%)`)
              : setBgColor(color => `hsl(209, 39%, 72%)`);

            setWeatherIcon(icon => <WiRainMix />);
            setIsRaining(rain => true);
            setIsSnowing(snow => false);
            break;
          case "Rain":
            setBgAnimation(`bg-rain`);
            setWeatherName(name => `Rainy`);
            setWeatherIcon(icon => <WiRain />);
            isNight
              ? setBgColor(color => `hsl(227, 31%, 30%)`)
              : setBgColor(color => `hsl(209, 52%, 68%)`);

            setIsRaining(rain => true);
            setIsSnowing(snow => false);
            break;
          case "Thunderstorm":
            setBgAnimation(`bg-thunderstorm`);
            setWeatherName(name => `Stormy`);
            setWeatherIcon(icon => <WiThunderstorm />);
            isNight
              ? setBgColor(color => `hsl(227, 31%, 22%)`)
              : setBgColor(color => `hsl(227, 31%, 26%)`);

            setIsRaining(rain => true);
            setIsSnowing(snow => false);
            break;
          case "Snow":
            setBgAnimation(``);
            setWeatherName(name => `Snowy`);
            setWeatherIcon(icon => <WiSnow />);
            isNight
              ? setBgColor(color => `hsl(206, 34%, 20%)`)
              : setBgColor(color => `hsl(206, 34%, 88%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => true);
            break;
          case "Mist":
            setBgAnimation(``);
            setWeatherName(name => `Misty`);
            setWeatherIcon(icon => <WiFog />);
            isNight
              ? setBgColor(color => `hsl(180, 16%, 21%)`)
              : setBgColor(color => `hsl(180, 16%, 42%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Smoke":
            setBgAnimation(``);
            setWeatherName(name => `Smoky`);
            setWeatherIcon(icon => <WiSmoke />);
            isNight
              ? setBgColor(color => `hsl(0, 0%, 45%)`)
              : setBgColor(color => `hsl(0, 0%, 80%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Haze":
            setBgAnimation(``);
            setWeatherName(name => `Hazy`);
            setWeatherIcon(icon => <WiDayHaze />);
            isNight
              ? setBgColor(color => `hsl(180, 9%, 31%)`)
              : setBgColor(color => `hsl(180, 9%, 61%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Fog":
            setBgAnimation(``);
            setWeatherName(name => `Foggy`);
            setWeatherIcon(icon => <WiFog />);
            isNight
              ? setBgColor(color => `hsl(49, 10%, 40%)`)
              : setBgColor(color => `hsl(49, 10%, 66%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Sand":
            setBgAnimation(``);
            setWeatherName(name => `Sandy`);
            setWeatherIcon(icon => <WiFog />);
            isNight
              ? setBgColor(color => `hsl(34, 15%, 35%)`)
              : setBgColor(color => `hsl(34, 57%, 73%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Dust":
            setBgAnimation(``);
            setWeatherName(name => `Dusty`);
            setWeatherIcon(icon => <WiDust />);
            isNight
              ? setBgColor(color => `hsl(43, 15%, 45%)`)
              : setBgColor(color => `hsl(43, 30%, 71%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Ash":
            setBgAnimation(``);
            setWeatherName(name => `Ashen`);
            setWeatherIcon(icon => <WiVolcano />);
            isNight
              ? setBgColor(color => `hsl(225, 10%, 37%)`)
              : setBgColor(color => `hsl(225, 10%, 67%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Squall":
            setBgAnimation(`bg-squall`);
            setWeatherName(name => `Squally`);
            setWeatherIcon(icon => <WiThunderstorm />);
            isNight
              ? setBgColor(color => `hsl(228, 18%, 30%)`)
              : setBgColor(color => `hsl(228, 18%, 36%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          case "Tornado":
            setBgAnimation(``);
            setWeatherName(name => `Tornado`);
            setWeatherIcon(icon => <WiTornado />);
            isNight
              ? setBgColor(color => `hsl(227, 22%, 26%)`)
              : setBgColor(color => `hsl(227, 22%, 33%)`);
            setIsRaining(rain => false);
            setIsSnowing(snow => false);
            break;
          default: //skyblue
            setBgAnimation(``);
            isNight
              ? setBgColor(color => `hsl(227, 31%, 37%)`)
              : setBgColor(color => "hsl(197, 71%, 73%)");

            setBgColor(color => "hsl(197, 71%, 73%)");

            setIsRaining(rain => false);
            setIsSnowing(snow => false);
        }

        // >>> just cloud color #F2F2F1

        // forecastArray = [];
        if (forecastArray.length === 5) {
          setForecastArray([]);
        }
        function forecastDay(weekday, weather, description, temp, icon) {
          setForecastArray(prevArray => [
            ...prevArray,
            {
              weekday,
              weather,
              description,
              temp,
              icon,
            },
          ]);
        }

        // console.log(data);
        let location = `${data.city.name}, ${data.city.country}`;
        // console.log(location);
        data.list.forEach((day, index) => {
          const [date, time] = day.dt_txt.split(" ");
          if (time === "12:00:00") {
            let weekdayFc = weekdays[weekdayNumber].toLowerCase();
            let weatherFc = day.weather[0].main;
            let descriptionFc = day.weather[0].description;
            let tempFc = Math.round(day.main.temp);
            let iconFc;

            switch (weatherFc) {
              case "Clear":
                iconFc = <WiDaySunny />;
                break;
              case "Clouds":
                iconFc = <WiCloud />;
                break;
              case "Drizzle":
                iconFc = <WiRainMix />;
                break;
              case "Rain":
                iconFc = <WiRain />;
                break;
              case "Thunderstorm":
                iconFc = <WiThunderstorm />;
                break;
              case "Snow":
                iconFc = <WiSnow />;
                break;
              case "Mist":
                iconFc = <WiFog />;
                break;
              case "Smoke":
                iconFc = <WiSmoke />;
                break;
              case "Haze":
                iconFc = <WiDayHaze />;
                break;
              case "Fog":
                iconFc = <WiFog />;
                break;
              case "Sand":
                iconFc = <WiFog />;
                break;
              case "Dust":
                iconFc = <WiDust />;
                break;
              case "Ash":
                iconFc = <WiVolcano />;
                break;
              case "Squall":
                iconFc = <WiThunderstorm />;
                break;
              case "Tornado":
                iconFc = <WiTornado />;
                break;
              default:
            }
            forecastDay(weekdayFc, weatherFc, descriptionFc, tempFc, iconFc);

            weekdayNumber += 1;

            if (weekdayNumber > 6) {
              weekdayNumber = 0;
            }
          }
        });

        // test loading
        setLoading(true);
        //

        // console.table(weekdays);
        // console.table(forecastArray); // to skip today.. if (index === 0) return;
      })
      .catch(err => console.error(err));
    // }
  };

  useEffect(() => {
    // console.log("test");
    return searchData();
  }, []);

  const handleSubmit = (
    e,
    cityName = city,
    forecast = 40, //8 = 1Day, 40 = 5Day
    key = "93d975cad85058b5990c063d2c26a66d"
  ) => {
    e.preventDefault();

    if (city.length > 0) {
      setInputValue(city);
      searchData(city);
    }
  };
  let inputStyle = {
    color: `${bgColor}`,
  };
  let btnSubmitStyle = {
    color: `${bgColor}`,
  };

  useEffect(() => {
    let [defaultClr, ourClr] = bgColor.split("%, ");
    let [valueOfClr, theRest] = ourClr.split("%)");
    let darkerClr = valueOfClr - 10;
    let lighterClr = valueOfClr - -10;
    let finalDarkerClr = `${defaultClr}%, ${darkerClr}%)`;
    let finalLighterClr = `${defaultClr}%, ${lighterClr}%)`;
    setDarkerBgColor(color => finalDarkerClr);
    setLighterBgColor(color => finalLighterClr);
  }, [bgColor]);

  let infoStyle = {
    // color: `${nightBg ? lighterBgColor : ""}`,
    color: `${isSnowing ? darkerBgColor : nightBg ? lighterBgColor : ""}`,
  };

  btnHover
    ? (btnSubmitStyle.color = `${darkerBgColor}`)
    : (btnSubmitStyle.color = `${bgColor}`);

  return (
    <div className="web">
      <MetaTags />
      <div className="App" id={bgAnimation} style={bgStyle}>
        {isSnowing ? <Snow /> : ""}
        <div className="input">
          <form onSubmit={handleSubmit}>
            <label htmlFor="city"></label>
            <input
              style={inputStyle}
              type="text"
              id="city"
              name="city"
              placeholder="City"
              onChange={handleChange}
              autoComplete="off"
            />
            <button
              className="btn btn-submit"
              type="submit"
              style={btnSubmitStyle}
              onMouseOver={() => setBtnHover(true)}
              onMouseOut={() => setBtnHover(false)}
            >
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {loading ? (
          foundData ? (
            <div className="data">
              <div className="main">
                <div className="icon-container">
                  <div className="icon-item weatherIcon">{weatherIcon}</div>
                  <div className="icon-item"></div>
                </div>
                <div className="temp-container">
                  {weather.length > 0 ? (
                    <div className="temp-item noSelect">
                      <h2 className="temp">
                        <span className="tempNumber">{tempValue}</span>
                        <span className="temp-span">
                          <span className="tempSymbol">{tempSymbol}</span>
                          <CgArrowsExchangeAltV
                            onClick={tempChange}
                            className="tempSwitch"
                          />
                        </span>
                      </h2>
                      <div className="line"></div>
                      <h2 className="weatherName">
                        {/* {weather} */}
                        {weatherName.toLocaleLowerCase()}
                      </h2>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {forecastArray.length > 0 ? (
                <div className="info-container" style={infoStyle}>
                  <div className="primary-container">
                    <h2 className="primary-item today">
                      {/* Tue <IoMdArrowDropleft /> May 10 */}
                      {date.toLowerCase()}
                    </h2>
                    <h2 className="primary-item place">{countryText}</h2>
                  </div>

                  <Forecast
                    array={forecastArray}
                    tempSymbol={tempSymbol}
                    bgColor={bgColor}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <NoData search={inputValue} />
          )
        ) : (
          <Preload bgColor={bgColor} />
        )}

        <div className="bg-image"></div>
      </div>
    </div>
  );
}

export default App;
