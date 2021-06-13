var geoData = function(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res) {
        res.json().then(function(data) {
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
                    var coord = { "lon": data[0].lon, "lat": data[0].lat}
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
                    displayWeather(data);
                })
            }).catch(function(reason){
                alert(reason);
            })
}

var displayWeather = function(data) {
    // puts needed weather data into an array
    var curWeath = [data.current.temp, data.current.wind_speed, data.current.humidity];
    // organizes titles for needed data into an array
    var weathMetric = [["Temp: ","Wind: ","Humidity: "],[" °F"," MPH"," %",]];

    // gets the city name based on the latitude and longitude used in the One API call and appends a card title with the city, date, and an icon for the current weather
    fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="+data.lat+"&lon="+data.lon+"&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res){
        res.json().then(function(response) {
            // save the current city
            saveHistory(response[0].name, data.lon, data.lat);
            // gets current date
            var date = moment.unix(data.current.dt).format("MM/DD/YYYY");
            // creates a card title element with the city name as the text
            var cardTitleEl = $("<h3>").addClass("card-title").attr("id", "searched-city").text(response[0].name);
            // creates an img element to hold an icon
            var iconImg = $("<img>").attr("src","http://openweathermap.org/img/wn/"+ data.current.weather[0].icon + "@2x.png");
            // appends date and icon to the card title
            cardTitleEl.append(" ",date,": ",iconImg);
            // empty target element
            $("#c-w").empty();
            // appends card title to the card body
            $("#c-w").append(cardTitleEl);
            // appends the weather info for the current weather to the card body
            for(var i = 0; i < curWeath.length; i++){
                var textEl = $("<p>").addClass("card-text").text(weathMetric[0][i] + curWeath[i] + weathMetric[1][i]);
                $("#c-w").append(textEl);
            }
            // creates UVI element and color codes it
            var uviEl = $("<p>").addClass("card-text").text("UVI: ");
            var uviSpan = $("<span>").addClass("badge").text(data.current.uvi);
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

            // empties five-day element
            $("#five-day").empty();
            // creates the 5 day forecast
            for( var q = 1; q < 6; q++) {
                // gets the date data from the daily section of the json
                var fiveDate = moment.unix(data.daily[q].dt).format("MM/DD/YYYY");
                // creates an array of the relevant data for the specified day
                var weathArr = [fiveDate, data.daily[q].weather[0].icon, data.daily[q].temp.day, data.daily[q].wind_speed, data.daily[q].humidity];
                fiveDayCard(weathArr, weathMetric);
            }
        })
    });
}

var fiveDayCard = function (weathArr, metArr) {
    // creates card elements filled in with relevant data then appends the card to the #five-day element in the html
    var cardEl = $("<div>").addClass("card five-day-cards border border-white");
    var cardBody = $("<div>").addClass("card-body");
    var cardTitleEl = $("<h4>").addClass("card-title").text(weathArr[0]);
    var cardSubEl = $("<img>").addClass("card-subtitle").attr("src","http://openweathermap.org/img/wn/"+ weathArr[1] + "@2x.png");
    cardBody.append(cardTitleEl, cardSubEl);
    // loops over given arrays to create the card text p elements
    for (var i = 2; i < weathArr.length; i++) {
        var cardInfoEl = $("<p>").addClass("card-text").text(metArr[0][i-2] + weathArr[i] + metArr[1][i-2]);
        cardBody.append(cardInfoEl);
    }
    cardEl.append(cardBody);
    $("#five-day").append(cardEl);
}

var saveHistory = function(search, longitude, latitude) {
    // Makes an object with the neccesary data to save
    var historySet = {city: search, coord: {lon: longitude, lat: latitude}};

    // test if the search term is a copy
    var test = false;
    for (var i = 0; i < sHistory.length; i++) {
        if (sHistory[i].city === historySet.city) {
            test = true;
            break;
        }
    }

    // Set a limit on how many cities you can have in the search history
    if (!test){
        if (sHistory.length >= 5) {
            sHistory.splice(0,1);
            sHistory.push(historySet);
        } else {
            sHistory.push(historySet);
        }
    }
    // saves the new sHistory array and then makes buttons using that array
    localStorage.setItem("sHistory", JSON.stringify(sHistory));
    historyButtons(sHistory);
}

var historyButtons = function(history) {
    // empty history buttons then replaces it with a button for each element from the history array
    $("#history").empty();
    for (var i = 0; i < history.length; i++){
        var hisButtEl = $("<button>").addClass("col-12 mt-2 btn btn-secondary").attr("value",JSON.stringify(history[i].coord)).text(history[i].city);
        $("#history").append(hisButtEl);
    }
}
// on load gets the sHistory array from local storage
var sHistory = JSON.parse(localStorage.getItem("sHistory"));
// if sHistory doesn't exist sets sHistory to empty array otherwise uses sHistory array to create search history buttons
if (!sHistory) {
    sHistory = [];
} else {
    historyButtons(sHistory);
}


$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    geoData(city);
})

$("#history").on("click","button",function(){
    var coord = JSON.parse($(this).val());
    weatherData(coord);
})