var weatherData = function(city) {
    console.log("start");
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ef42ec77e5abd2ef83947df102ff17d6&units=imperial")
    .then(function(res){
        res.json().then(function(data){
            console.log(data);
        })
    })
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    weatherData(city);
})
