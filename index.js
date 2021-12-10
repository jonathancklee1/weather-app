import { API_KEY_WEATHER, API_KEY_LOCATION } from "./apikey.js";
// Declare variables
const locationText = document.querySelector(".location");
const currWeatherText = document.querySelector(".current-weather");
const tempText = document.querySelector(".temp");
const locationKey = API_KEY_LOCATION;
const weatherKey = API_KEY_WEATHER;

// HTML Geolocation API- retrieves user's latitude and longitude
navigator.geolocation.getCurrentPosition((position) => {
  locationText.innerHTML = `Your location: Loading...`;
  currWeatherText.innerHTML = `Weather: Loading...`;
  tempText.innerHTML = `Loading...`;
  showLocation(position.coords.latitude, position.coords.longitude);
  showWeather(position.coords.latitude, position.coords.longitude);
});

// Display location data to user
let showLocation = (lat, long) => {
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${locationKey}`;
  fetch(url)
    //   Get location api response body
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
    //   Get weather api response body
    .then((response) => response.json())
    //   Retrieve weather api results
    .then((data) => {
      console.log(data);
      // Set main weather
      currWeatherText.innerHTML = `Weather: ${data.weather[0].main}`;
      // Set temperature
      tempText.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    })
    .catch((error) => alert("Cannot retrieve weather data"));
};
