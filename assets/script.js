var cityArray = [];
var cityNameEl;

function getNewCityData() {
    var cityName = $(cityNameEl).val();
    if (!cityName) {
        alert("Please enter a city name!");
    }
    else {
        getData(cityName);
    }
}

function getData(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5//weather?q="
        + cityName + "&appid=d26f4f6b4558c822bbb01131aac44003";
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
            var apiUrlCoord = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherLat
                + "&lon=" + weatherLon + "&exclude=hourly,minute&units=imperial&appid=d26f4f6b4558c822bbb01131aac44003"
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
            var currentWeatherArray = [response.current.temp, response.current.humidity, response.current.wind_speed,
            response.current.uvi, response.current.weather[0].icon];
            displayCurrentWeather(cityName, currentWeatherArray);
            var dailyWeatherArray = response.daily;
            displayDailyWeather(dailyWeatherArray);
            savCities(cityName);
        }).catch(function (error) {
            console.log(error);
        })
}

function savCities(cityName) {
    if (!cityArray.includes(cityName)) {
        cityArray.push(cityName);
    }
    localStorage.setItem("citiesKey", JSON.stringify(cityArray));
}
// create jumbotron to display current weather and date
function displayCurrentWeather(cityName, weatherArray) {
    var currentDate = moment().format("MMMM Do, YYYY");
    var iconUrl = `http://openweathermap.org/img/wn/${weatherArray[4]}@2x.png`;
    $("#city-title").text(cityName.toUpperCase());
    $("#date").text(currentDate);
    $("#weather-icon").attr("src", iconUrl);
    $("#temp").text(weatherArray[0] + "F");
    $("#humidity").text(weatherArray[1] + "%");
    $("#wind-speed").text(weatherArray[2] + "m/h");
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
function onButtonClick() {
    var cityName = $(this).attr("city-name");
    getData(cityName);
}

function loadCities() {
    $(".list-group").empty();
    cityArray = JSON.parse(localStorage.getItem("citiesKey"));
    if (!cityArray) cityArray = [];
    for (var i = 0; i < cityArray.length; i++) {
        var cityListEl = $("<li>").addClass("city-name");
        var cityButton = $("<button>")
            .addClass("city-choice")
            .attr("city-name", cityArray[i])
            .text(cityArray[i])
            .click(onButtonClick);
        $(cityListEl).append(cityButton);
        $(".list-group").append(cityListEl);
    }
}

$(document).ready(function () {
    cityNameEl = $("#formInputCity");
    $("#search-btn").on("click", getNewCityData);
    $("#form-submit-city").submit(function (event) {
        event.preventDefault();
        loadCities();
    });
    loadCities();
})