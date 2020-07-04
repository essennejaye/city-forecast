var cityArray = [];

function getData() {
    var cityNameEl = document.querySelector("#formInputCity").value;
    if (!cityNameEl) {
        alert("Please enter a city name!");
    }
    savCities(cityNameEl);
    fetch()
}
function savCities(cityName) {
    cityArray.push(cityName);
    localStorage.setItem("citiesKey", JSON.stringify(cityArray));

}











document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", getData);
    $("#form-submit-city").submit(function (event) {
        event.preventDefault();
    });
})