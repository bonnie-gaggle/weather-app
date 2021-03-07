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

function formatDay(timestamp) { // shortened days for forecast
  let date = new Date(timestamp);
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  return `${days[date.getDay()]}`;
}

let now = new Date();
document.getElementById("time").innerHTML = formatTime(now);

function updateTemp(response) { //rewrite HTML for main portion based on city/location searched
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
  iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
  iconElement.setAttribute("alt", description);
}

function forecast(response){
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  let maxTemp = null;
  let minTemp = null;

  /*Not perfect. Shows max/min temp for 24-hour period centered on time of data retrieval.
  How do I define the start/end points of the max/min as 00:00 to 11:59?*/
  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index*8]; //data from api is for every 3 hours, so *8 makes it every 24
    let maxTempList = [];
    let minTempList = [];
    for (let i = 0; i< 8; i++) { //gather max and min temp data for the next 24 hours, put in array
      maxTempList.push(response.data.list[index*8+i].main.temp_max);
      minTempList.push(response.data.list[index*8+i].main.temp_min);
    }
    maxTemp = Math.max(...maxTempList); //find max of array of temperatures
    minTemp = Math.min(...minTempList);
    forecastElement.innerHTML += `
    <div class="col">
      ${formatDay(forecast.dt * 1000)}
      <div>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="forecast-icon"/>
      </div>
      <div class="forecast-temp">
        <strong>
          ${Math.round(maxTemp)}°
        </strong>
        ${Math.round(minTemp)}°
      </div>
    </div>
  `;
    
  }
}

function search(city){
  let apiKey = "96705b159023614cfe376449b9563ca3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/";
  let units = "metric";
  let apiUrl = `${apiEndpoint}weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);

  apiUrl = `${apiEndpoint}forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecast);
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
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/";
  let units = "metric";
  let apiUrl = `${apiEndpoint}weather?lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);
  apiUrl = `${apiEndpoint}forecast?lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(forecast);
}

function askLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(cityLocation);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", askLocation);


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