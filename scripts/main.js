const app = document.getElementById("root");
const cityName = document.getElementById("cityName");
const weatherTitle = document.getElementById("weatherTitle");
const weatherDesc = document.getElementById("weatherDesc");
const weatherImg = document.getElementById("weatherImg");
const weatherTemp = document.getElementById("weatherTemp");
const weatherWind = document.getElementById("weatherWind");
const weatherHumid = document.getElementById("weatherHumid");

const newsTitle = document.getElementById("newsTitle");
const newsSource = document.getElementById("newsSource");
const newsHeader = document.getElementById("newsHeader");
const newsContent = document.getElementById("newsContent");

const nav = document.querySelector(".ul_nav");

// var cities = ["London", "Washington", "Amsterdam", "Sidney"];
var meteorIndex = 0;
var meteorArrayLength = 0;
// var countries = ["gb", "us", "nl", "au"];

var cities = [
  {
    name: "London",
    countryCode: "gb",
    countryName: "United Kingdom"
  },
  {
    name: "Washington",
    countryCode: "us",
    countryName: "United States"
  },
  {
    name: "Amsterdam",
    countryCode: "nl",
    countryName: "Netherlands"
  },
  {
    name: "Sidney",
    countryCode: "au",
    countryName: "Australia"
  }
];

// build navigation

for (var i = 0; i < cities.length; i++) {
  nav.innerHTML +=
    '<li><a href = javascript:getWeather("' +
    i +
    '");>' +
    cities[i].name +
    "</a></li>";
}

function getWeather(index) {
  var city = cities[index].name;
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&APPID=d317b8c3d4a744904ca0b21dad5d8f62",
    true
  );
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    var list = data.list;

    if (request.status >= 200 && request.status < 400) {
      var today = new Date(data.dt * 1000);
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var day = today.getDay();
      var temp = Math.floor(data.main.temp - 273.15);
      var iconUrl =
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

      cityName.textContent = city + " - " + day + "-" + month + "-" + year;
      weatherImg.setAttribute("src", iconUrl);
      weatherTitle.innerHTML = data.weather[0].main;
      weatherDesc.innerHTML = data.weather[0].description;
      weatherTemp.innerHTML = "Temperature: " + temp + "&#176;C";
      weatherWind.innerHTML = "Wind: " + data.wind.speed + " Km/h";
      weatherHumid.innerHTML = "Humidity: " + data.main.humidity + "%";
      getMeteors();
      getNews(index);
    } else {
      const errorMessage = document.createElement("marquee");
      errorMessage.textContent = `Oops, it's not working!`;
      app.appendChild(errorMessage);
    }
  };
  request.send();
}

function getMeteors() {
  var currentDate = new Date();
  var twoDigitMonth =
    currentDate.getMonth() + 1 >= 10
      ? currentDate.getMonth() + 1
      : "0" + (currentDate.getMonth() + 1);
  var twoDigitDate =
    currentDate.getDate() >= 10
      ? currentDate.getDate()
      : "0" + currentDate.getDate();
  var createdDateTo =
    currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://api.nasa.gov/neo/rest/v1/feed?start_date=" +
      createdDateTo +
      "&end_date=" +
      createdDateTo +
      "&api_key=FTyWd0n2cnauRZY5rfB3f60c47NUQgMiKRrzAK7N",
    true
  );
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    var list = data.list;

    if (request.status >= 200 && request.status < 400) {
      meteorArrayLength = data.near_earth_objects[createdDateTo].length;
      meteorTitle.innerHTML =
        data.near_earth_objects[createdDateTo][meteorIndex].name;
      meteorSize.innerHTML =
        "Diameter: " +
        data.near_earth_objects[createdDateTo][meteorIndex].estimated_diameter
          .kilometers.estimated_diameter_min +
        " Km";
      meteorSpeed.innerHTML =
        "Speed: " +
        data.near_earth_objects[createdDateTo][meteorIndex]
          .close_approach_data[0].relative_velocity.kilometers_per_hour +
        " Km/h";
      meteorDistance.innerHTML =
        "Distance from Earth: " +
        data.near_earth_objects[createdDateTo][meteorIndex]
          .close_approach_data[0].miss_distance.kilometers +
        " Km";
    } else {
      const errorMessage = document.createElement("marquee");
      errorMessage.textContent = `Oops, it's not working!`;
      app.appendChild(errorMessage);
    }
  };
  request.send();
}

getWeather(0);

function changeMeteor() {
  getMeteors();
  if (meteorIndex < meteorArrayLength - 1) {
    meteorIndex++;
  } else {
    meteorIndex = 0;
  }
}

function getNews(index) {
  var countryCode = cities[index].countryCode;
  var countryName = cities[index].countryName;
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://newsapi.org/v2/top-headlines?country=" +
      countryCode +
      "&apiKey=c95ddd7eb2534f2caa9b41e3863035d2",
    true
  );

  request.onload = function() {
    var data = JSON.parse(this.response);
    var list = data.list;

    if (request.status >= 200 && request.status < 400) {
      newsTitle.innerHTML = "Latest news from " + countryName;

      newsSource.innerHTML = data.articles[0].source.name;

      newsHeader.innerHTML = data.articles[0].title;

      newsContent.innerHTML = data.articles[0].content;
    } else {
      const errorMessage = document.createElement("marquee");
      errorMessage.textContent = `Oops, it's not working!`;
      app.appendChild(errorMessage);
    }
  };
  request.send();
}
