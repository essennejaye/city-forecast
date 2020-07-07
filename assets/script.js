var cityArray = [];
var cityNameEl;
// retreive name from input element and pass to fetch function
function getNewCityData() {
    var cityName = $(cityNameEl).val();
    if (!cityName) {
        alert("Please enter a city name!");
    }
    else {
        getData(cityName);
    }
}
var apiKey = "d26f4f6b4558c822bbb01131aac44003";
// first fetch to get coordinates for second fetch
function getData(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5//weather?q="
        + cityName + "&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                alert("Weather for this city is not available");
                return Promise.reject(response);
            }
            else {
                return response.json();
            }
        })
        .then(function (response) {
            var weatherLon = response.coord.lon;
            var weatherLat = response.coord.lat;
            // plug in coordinates to get data with all needed information
            var apiUrlCoord = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherLat
                + "&lon=" + weatherLon + "&exclude=hourly,minute&units=imperial&appid=" + apiKey
            return fetch(apiUrlCoord);
        })
        .then(function (response) {
            if (!response.ok) {
                alert("Weather for this city is not available");
                return Promise.reject(response);
            }
            else {
                return response.json();
            }
        })
        .then(function (response) {
            // put current weather info in an array and put daily weather info in an array 
            var currentWeatherArray = [response.current.temp, response.current.humidity, response.current.wind_speed,
            response.current.uvi, response.current.weather[0].icon];
            displayCurrentWeather(cityName, currentWeatherArray);
            var dailyWeatherArray = response.daily;
            displayDailyWeather(dailyWeatherArray);
            // send city name to save function, load cities is called here to add just inputted city to localstorage
            savCities(cityName);
            loadCities();
        }).catch(function (error) {
            console.log(error);
        })
}
// save cities to local storage, max of 10, last city entered is first in array
// last city in array is sliced out of array
function savCities(cityName) {
    if (!cityArray.includes(cityName)) {
        cityArray.unshift(cityName);
    }
    cityArray = cityArray.slice(0, 10);
    localStorage.setItem("citiesKey", JSON.stringify(cityArray));
}
// create jumbotron to display current weather and date
function displayCurrentWeather(cityName, weatherArray) {
    // use moment to get cuurent date
    var currentDate = moment().format("MMMM Do, YYYY");
    // use openweather url + icon code to get weather icon
    var iconUrl = `http://openweathermap.org/img/wn/${weatherArray[4]}@2x.png`;
    $("#city-title").text(cityName.toUpperCase());
    $("#date").text(currentDate);
    $("#weather-icon").attr("src", iconUrl);
    $("#temp").text(weatherArray[0] + "F");
    $("#humidity").text(weatherArray[1] + "%");
    $("#wind-speed").text(weatherArray[2] + "m/h");
    // parse uvi index to test for condition and assign a color
    var uvIndex = parseFloat(weatherArray[3]);
    if (uvIndex <= 2.9) {
        $("#uvi").text(uvIndex).addClass("low");
    }
    else if (uvIndex <= 7.9) {
        $("#uvi").text(uvIndex).addClass("moderate");
    }
    else {
        $("#uvi").text(uvIndex).addClass("severe");
    }
}
// create cards for 5 day forecast
function displayDailyWeather(dailyWeatherArray) {
    $("#daily-container").empty();
    // use a for loop to get 5 day forecast, create cards dynamically
    // first day in data is current day so skip and get next 5
    for (var i = 1; i < 6; i++) {
        var dailyDivEl = $("<div>").addClass("daily-div");
        var dailyDate = moment().add(i, "days").format("MMMM Do");
        var dailyDateEl = $("<h4>").addClass("date-item").text(dailyDate);
        $(dailyDivEl).append(dailyDateEl);
        var iconUrl = `http://openweathermap.org/img/wn/${dailyWeatherArray[i].weather[0].icon}@2x.png`;
        var dailyIconEl = $("<img>").addClass("daily-icon").attr("src", iconUrl);
        $(dailyDivEl).append(dailyIconEl);
        var dailyHighEl = $("<p>").addClass("temp-max").text("High " + dailyWeatherArray[i].temp.max + "F");
        var dailyLowEl = $("<p>").addClass("temp-min").text("Low " + dailyWeatherArray[i].temp.min + "F");
        $(dailyDivEl).append(dailyHighEl).append(dailyLowEl);
        var dailyHumidity = $("<p>").addClass("daily-humidity").text("Humidity " + dailyWeatherArray[i].humidity + "%");
        $(dailyDivEl).append(dailyHumidity);
        $("#daily-container").append(dailyDivEl);
    }
}
// function to retreive stored city name from clicked city button to fetch data 
function onButtonClick() {
    var cityName = $(this).attr("city-name");
    getData(cityName);
}
// generate clickable buttons for stored cities
function loadCities() {
    $(".list-group").empty();
    cityArray = JSON.parse(localStorage.getItem("citiesKey"));
    if (!cityArray) cityArray = [];
    for (var i = 0; i < cityArray.length; i++) {
        var cityListEl = $("<li>").addClass("city-name");
        var cityButton = $("<button>")
            .addClass("city-choice")
            .attr("city-name", cityArray[i])
            .text(cityArray[i].toUpperCase())
            .click(onButtonClick);
        $(cityListEl).append(cityButton);
        $(".list-group").append(cityListEl);
    }
}

$(document).ready(function () {
    cityNameEl = $("#formInputCity");
    $("#form-submit-city").submit(function (event) {
        event.preventDefault();
        getNewCityData();
    });
    loadCities();
})