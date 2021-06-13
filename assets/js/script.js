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
    // puts needed weather data into an array
    var curWeath = [data.current.temp, data.current.wind_speed, data.current.humidity];
    // organizes titles for needed data into an array
    var weathMetric = [["Temp: ","Wind: ","Humidity: "],[" °F"," MPH"," %",]];

    // gets the city name based on the latitude and longitude used in the One API call and appends a card title with the city, date, and an icon for the current weather
    fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="+data.lat+"&lon="+data.lon+"&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res){
        res.json().then(function(response) {
            // gets current date
            var date = moment.unix(data.current.dt).format("MM/DD/YYYY");
            // creates a card title element with the city name as the text
            var cardTitleEl = $("<h3>").addClass("card-title").attr("id", "searched-city").text(response[0].name);
            // creates an img element to hold an icon
            var iconImg = $("<img>").attr("src","http://openweathermap.org/img/wn/"+ data.current.weather[0].icon + "@2x.png");
            // appends date and icon to the card title
            cardTitleEl.append(" ",date,": ",iconImg);
            // appends card title to the card body
            $("#c-w").append(cardTitleEl);
            // appends the weather info for the current weather to the card body
            for(var i = 0; i < curWeath.length; i++){
                var textEl = $("<p>").addClass("card-text").text(weathMetric[0][i] + curWeath[i] + weathMetric[1][i]);
                $("#c-w").append(textEl);
            }
            // creates UVI element and color codes it
            var uviEl = $("<p>").addClass("card-text").text("UVI: ");
            var uviSpan = $("<span>").addClass("badge badge-pill").text(data.current.uvi);
            // set the color based on the uvi
            if (parseInt(data.current.uvi) <= 2.5){
                uviSpan.addClass("badge-success");
            } else if (parseInt(data.current.uvi) > 2.5 && parseInt(data.current.uvi) <= 5.5) {
                uviSpan.addClass("badge-warning");
            } else if (parseInt(data.current.uvi) > 5.5 && parseInt(data.current.uvi) <= 7.5) {
                uviSpan.addClass("badge-orange");
            } else {
                uviSpan.addClass("badge-danger");
            }
            uviEl.append(uviSpan);
            $("#c-w").append(uviEl);
        })
    });
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    geoData(city);
})
