function formatTime(timestamp) {
  let date = new Date(timestamp);
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
  let cityElement = document.querySelector("h1");
  let todayTempElement = document.querySelector("#temperature-today");
  let conditionElement = document.querySelector("#condition");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");
  let description = response.data.weather[0].description; 
  let iconCode = response.data.weather[0].icon;
  celsiusTemp = response.data.main.temp;
  cityElement.innerHTML = response.data.name;
  todayTempElement.innerHTML = Math.round(celsiusTemp);
  conditionElement.innerHTML = description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  timeElement.innerHTML = formatTime(response.data.dt*1000);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  iconElement.setAttribute("alt", description);
}

function search(city){
  let apiKey = "96705b159023614cfe376449b9563ca3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);

}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  search(city);
}

let cityInput = document.querySelector("#search-form");
cityInput.addEventListener("submit", handleSubmit);

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
  temperatureElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature-today");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

search("Los Angeles");