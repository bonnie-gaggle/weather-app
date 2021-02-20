function formatTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hour}:${minutes}`;
}

let now = new Date();
document.getElementById("time").innerHTML = formatTime(now);

function updateTemp(response) {
  let heading = document.querySelector("h1");
  heading.innerHTML = response.data.name;

  let todayTempElement = document.querySelector("#temperature-today");
  let temperature = Math.round(response.data.main.temp);
  todayTempElement.innerHTML = temperature;
}

function searchCity(event) {
  event.preventDefault();
  let apiKey = "96705b159023614cfe376449b9563ca3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  let apiUrl = `${apiEndpoint}q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);
}

let cityInput = document.querySelector("#search-form");
cityInput.addEventListener("submit", searchCity);

function cityLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "96705b159023614cfe376449b9563ca3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);
}

function askLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(cityLocation);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", askLocation);

//From old challenges, converting between metric and imperial (placeholder)
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature-today");
  let temperature = temperatureElement.innerHTML;
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature-today");
  temperatureElement.innerHTML = 11;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);
