var $icon = $('.icon');
var $temp = $('.temperature-value p');
var $desc = $('.temperature-description p');
var $location = $('.location p');
var $notif = $('.notification');
var $favicon = $('#favicon')

var kelvin = 273;
var appid = 'f8bb2141e416cdcebb5c5f43457ce683';
var base = 'https://api.openweathermap.org/data/2.5/weather?';

var weather = {};
weather.temperature = {
    unit : 'Celsius'
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    $notif.css('display', 'block');
    $notif.html("<p>Browser doesn't Support Geolocation</p>");
}

function setPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    $notif.css('display', 'block');
    $notif.html(`<p>${error.message}</p>`);
}

function getWeather(latitude, longitude) {
    var api = `${base}lat=${latitude}&lon=${longitude}&appid=${appid}`;
   fetch(api)
        .then(function(res) {
            var data = res.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = (Math.floor(data.main.temp - kelvin));
            weather.description = data.weather[0].description;
            weather.icon = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

function displayWeather() {
    $icon.html(`<img src="icons/${weather.icon}.png">`);
    $temp.html(`${weather.temperature.value}° <span>C</span> `);
    $desc.html(`${weather.description}`)
    $location.html(`${weather.city}, ${weather.country}`);
    $favicon.attr('href', `icons/${weather.icon}.png`);
}

function conversion(temperature) {
    return(temperature * 9 / 5) + 32;
}

$temp.click(function() {
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit == 'Celsius') {
        var f = conversion(weather.temperature.value);
        f = Math.floor(f);
        $temp.html(`${f}° <span>F</span> `);
        weather.temperature.unit = 'fahrenheit';
    } else {
        $temp.html(`${weather.temperature.value}° <span>C</span> `);
        weather.temperature.unit = 'Celsius';
    }
})