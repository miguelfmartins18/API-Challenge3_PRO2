const app = document.getElementById('root');
const cityName = document.getElementById('cityName');
const weatherTitle = document.getElementById('weatherTitle');
const weatherDesc = document.getElementById('weatherDesc');
const weatherImg = document.getElementById('weatherImg');
const weatherTemp = document.getElementById('weatherTemp');
const weatherWind = document.getElementById('weatherWind');
const weatherHumid = document.getElementById('weatherHumid');

const nav = document.querySelector(".ul_nav");

var cities = ["London", "Washington", "Amsterdam", "Sidney"];
var meteorIndex = 0;
var meteorArrayLength = 0;

// build navigation

for (var i = 0; i < cities.length; i++) {
  nav.innerHTML += '<li><a href = javascript:getWeather("' + cities[i] + '");>' + cities[i] + '</a></li>';
}

var city = cities[0];

function getWeather(city) {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=d317b8c3d4a744904ca0b21dad5d8f62', true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    var list = data.list;

    if (request.status >= 200 && request.status < 400) {

      var today = new Date(data.dt * 1000);
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var day = today.getDay();
      var temp = Math.floor(data.main.temp - 273.15);
      var iconUrl = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';

      cityName.textContent = city + ' - ' + day + '-' + month + '-' + year;
      weatherImg.setAttribute('src', iconUrl);
      weatherTitle.innerHTML = data.weather[0].main;
      weatherDesc.innerHTML = data.weather[0].description;
      weatherTemp.innerHTML = 'Temperature: ' + temp + '&#176;C';
      weatherWind.innerHTML = 'Wind: ' + data.wind.speed + ' Km/h';
      weatherHumid.innerHTML = 'Humidity: ' + data.main.humidity + '%';
      getMeteors();

    } else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Oops, it's not working!`;
      app.appendChild(errorMessage);
    }
  };
  request.send();
}

function getMeteors() {

  var currentDate = new Date();
  var twoDigitMonth = ((currentDate.getMonth() + 1) >= 10) ? (currentDate.getMonth() + 1) : '0' + (currentDate.getMonth() + 1);
  var twoDigitDate = ((currentDate.getDate()) >= 10) ? (currentDate.getDate()) : '0' + (currentDate.getDate());
  var createdDateTo = currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;


  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + createdDateTo + '&end_date=' + createdDateTo + '&api_key=FTyWd0n2cnauRZY5rfB3f60c47NUQgMiKRrzAK7N', true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    var list = data.list;

    if (request.status >= 200 && request.status < 400) {
      meteorArrayLength = data.near_earth_objects[createdDateTo].length;
      meteorTitle.innerHTML = data.near_earth_objects[createdDateTo][meteorIndex].name;
      meteorSize.innerHTML = 'Diameter: ' + data.near_earth_objects[createdDateTo][meteorIndex].estimated_diameter.kilometers.estimated_diameter_min + ' Km';
      meteorSpeed.innerHTML = 'Speed: ' + data.near_earth_objects[createdDateTo][meteorIndex].close_approach_data[0].relative_velocity.kilometers_per_hour + ' Km/h';
      meteorDistance.innerHTML = 'Distance from Earth: ' + data.near_earth_objects[createdDateTo][meteorIndex].close_approach_data[0].miss_distance.kilometers + ' Km';
    } else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Oops, it's not working!`;
      app.appendChild(errorMessage);
    }
  };
  request.send();

}

getWeather(city);



function changeMeteor() {
  getMeteors();
  if (meteorIndex < meteorArrayLength - 1) {
    meteorIndex++;
  } else {
    meteorIndex = 0;
  }

}