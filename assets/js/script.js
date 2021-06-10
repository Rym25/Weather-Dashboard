var geoData = function(city) {
    console.log("start");
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res) {
        res.json().then(function(data) {
            console.log(data);
            if (data.length === 0) {
                alert("Sorry, could not find the city you were looking for.");
            }else{
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
            }
        })
    }).catch(function(reason){
        alert(reason);
    })
}

var weatherData = function(coord) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=ef42ec77e5abd2ef83947df102ff17d6")
            .then(function(res){
                res.json().then(function(data){
                    displayCurrentWeather(data);
                })
            }).catch(function(reason){
                alert(reason);
            })
}

var displayCurrentWeather = function(data) {
    // gets the date of the weather from the current forecast
    var date = moment.unix(data.current.dt).format("MM/DD/YYYY");
    // gets the required weather data
    var temp = data.current.temp;
    var uvi = data.current.uvi;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    geoData(city);
})
