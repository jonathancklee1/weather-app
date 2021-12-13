// Import
import { API_KEY_WEATHER, API_KEY_LOCATION } from "./apikey.js";

// Declare variables
const locationText = document.querySelector(".location");
const currWeatherText = document.querySelector(".current-weather");
const tempText = document.querySelector(".temp");
const weatherImg = document.querySelector(".weather-img");
const mainSection = document.querySelector(".main-card");
const copyright = document.querySelector(".copyright");
const checkbox = document.getElementById("checkbox");
const container = document.querySelector(".container");
const cardInner = document.querySelector(".card-inner");
const flipIcons = document.querySelectorAll(".fa-redo");

const locationKey = API_KEY_LOCATION;
const weatherKey = API_KEY_WEATHER;
const nightTime = 19;
var audio = document.getElementById("audio");

// Toggle flip for each flip button
flipIcons.forEach((flipIcon) => {
  flipIcon.addEventListener("click", () => {
    cardInner.classList.toggle("flipped");
  });
});

// If success get user location and display data
let onSuccess = (position) => {
  locationText.innerHTML = `Your location: Loading...`;
  currWeatherText.innerHTML = `Weather: Loading...`;
  tempText.innerHTML = `Loading...`;
  showLocation(position.coords.latitude, position.coords.longitude);
  showWeather(position.coords.latitude, position.coords.longitude);
  checkbox.addEventListener("change", () => {
    togglePlay();
  });
};
// If error...alert user
let onError = (error) => {
  alert(
    "Unable to retrieve weather data. Please turn on your location access in the browser or enable location in your mobile setting. Otherwise please use an alternative browser."
  );
  weatherImg.remove();
  // Add an error message
  const h2Element = document.createElement("h2");
  const errorMsg = document.createTextNode("Unable to retrieve weather!");
  h2Element.appendChild(errorMsg);
  mainSection.appendChild(h2Element);
};

// HTML Geolocation API- retrieves user's latitude and longitude
navigator.geolocation.getCurrentPosition(onSuccess, onError);
// Display location data to user
let showLocation = (lat, long) => {
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${locationKey}`;
  //   Get request to opencage api and return Json data
  fetch(url)
    .then((response) => response.json())
    //   Retrieve location api results
    .then((data) => {
      console.log(data);
      let path = data.results[0].components;
      //    Set suburb and city from json path
      locationText.innerHTML = `Your location: ${path.suburb}, ${path.city}`;
    })
    .catch((error) => alert("Cannot retrieve location data"));
};

let showWeather = (lat, long) => {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&&units=metric&appid=${weatherKey}`;
  fetch(url)
    //   Get request to openweather api and return Json data
    .then((response) => response.json())
    //   Retrieve weather api results
    .then((data) => {
      console.log(data);
      // Set main weather and temperature
      currWeatherText.innerHTML = `Weather: ${data.weather[0].main}`;
      tempText.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
      const timeHr = new Date().getHours();

      // Change colour of background and text if night >7pm
      if (timeHr > nightTime) {
        container.style.color = "var(--clr-white)";
        mainSection.style.backgroundColor = "var(--clr-black)";
        container.style.background =
          "linear-gradient(to right top, #364652, #2D1E2F)";
      }

      // Display gif and ambient sounds corresponding to the weather type
      switch (data.weather[0].main) {
        case "Rain":
          weatherImg.src = "./images/Rain.gif";
          audio.src = "./audio/rain.mp3";
          break;
        case "Drizzle":
          weatherImg.src = "./images/Drizzle.gif";
          audio.src = "./audio/light-rain.mp3";
          break;
        case "Clear":
          // Night
          if (timeHr > nightTime) {
            weatherImg.src = "./images/Clear-Night.gif";
            audio.src = "./audio/clear-night.mp3";
          } else {
            weatherImg.src = "./images/Clear.gif";
            audio.src = "./audio/clear.mp3";
          }
          break;
        case "Thunderstorm":
          weatherImg.src = "./images/Thunderstorm.gif";
          audio.src = "./audio/thunderstorm.mp3";
          break;
        case "Snow":
          weatherImg.src = "./images/Snow.gif";
          audio.src = "./audio/snow.mp3";
          break;
        default:
          weatherImg.src = "./images/Cloudy.gif";
          audio.src = "./audio/wind.mp3";
      }
    })
    .catch((error) => alert("Cannot retrieve weather data"));
};

// Toggles audio on and off based on audio pause state
let togglePlay = () => {
  return audio.paused ? audio.play() : audio.pause();
};

// Load footer with copyright information on page load
window.onload = () => {
  const year = new Date().getFullYear();
  copyright.innerHTML =
    "&copy; " + year + " Jonathan Lee. All rights reserved.";
};
