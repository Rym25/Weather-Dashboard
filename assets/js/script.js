var geoData = function(city) {
    console.log("start");
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res) {
        res.json().then(function(data) {
            console.log(data);
            if (data.length > 1) {
                for(var i = 0; i < data.length; i++){
                    var conf = confirm("Is the city you are looking for " + data[i].name + ", " + data[i].country + ", " + data[i].state + "?");
                    if (conf) {
                        var coord = { "lon": data[i].lon, "lat": data[i].lat}
                        weatherData(coord);
                        break;
                    }
                }
            } else {
                var coord = { "lon": data[i].lon, "lat": data[i].lat}
                        weatherData(coord);
            }
        })
    })
}

var weatherData = function(coord) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=ef42ec77e5abd2ef83947df102ff17d6")
            .then(function(res){
                res.json().then(function(data){
                    displayWeather(data);
                })
            })
}

var displayWeather = function(data) {
    
    // displays the date of the weather from the daily forecast
    var date = moment.unix(data.daily[1].dt).format("MM/DD/YYYY");
    console.log(date);
    console.log(data);
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    geoData(city);
})
