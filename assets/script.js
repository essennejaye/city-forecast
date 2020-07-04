var cityArray = [];
var cithNameEl;

function getData() {
    var cityName = cityNameEl.value;
    if (!cityName) {
        alert("Please enter a city name!");
    }
    savCities(cityName);
    var apiUrl = "https://api.openweathermap.org/data/2.5//weather?q="
        + cityName + "&appid=d26f4f6b4558c822bbb01131aac44003";
    fetch(apiUrl)
        .then(function (weatherResponse) {
            return weatherResponse.json();
        })
        .then(function (weatherResponse) {
            var weatherLon = weatherResponse.coord.lon;
            var weatherLat = weatherResponse.coord.lat;
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
            console.log(response);
            var currentWeatherArray = [response.current.temp, response.current.humidity, response.current.wind_speed,
                 response.current.uvi, response.current.weather[0].icon];
            displayWeather(currentWeatherArray);
        }).catch(function (error) {
            console.log(error);
        })
}

function savCities(cityName) {
    cityArray.push(cityName);
    localStorage.setItem("citiesKey", JSON.stringify(cityArray));
}
function displayWeather(weatherArray) {
    var currentDate = moment().format("MMMM Do, YYYY");
    var iconUrl = `http://openweathermap.org/img/wn/${weatherArray[4]}@2x.png`;  
    $("#city-title").text(cityNameEl.value.toUpperCase()); 

     $("#date").text(currentDate);
     $("#weather-icon").attr("src", iconUrl);
     $("#temp").text(weatherArray[0] + "F");
     $("#humidity").text(weatherArray[1] + "%");
     $("#wind-speed").text(weatherArray[2] + "m/h");
     $("#uvi").text(weatherArray[3]);
}




document.addEventListener("DOMContentLoaded", function () {
    cityNameEl = document.querySelector("#formInputCity");
    cityArray = [];
    cityArray = JSON.parse(localStorage.getItem("citiesKey"));
    var searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getData);
    $("#form-submit-city").submit(function (event) {
        event.preventDefault();
    });
})