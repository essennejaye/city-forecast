var cityArray = [];

function getData() {
    var cityNameEl = document.querySelector("#formInputCity").value;
    if (!cityNameEl) {
        alert("Please enter a city name!");
    }
    savCities(cityNameEl);
    var apiUrl = "https://api.openweathermap.org/data/2.5//weather?q="
        + cityNameEl + "&appid=d26f4f6b4558c822bbb01131aac44003";
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
                 response.current.uvi, response.weather.icon];
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
    var 
}











document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getData);
    $("#form-submit-city").submit(function (event) {
        event.preventDefault();
    });
})