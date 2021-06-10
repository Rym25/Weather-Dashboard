var weatherData = function(city) {
    console.log("start");
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ef42ec77e5abd2ef83947df102ff17d6&units=imperial")
    .then(function(res){
        res.json().then(function(data){
            if(data.cod = 404) {
                alert("Sorry the City you are looking for could not be found.");
            }
            console.log(data);
        })
    }).catch(function(reason){
        alert(reason);
    })
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    weatherData(city);
})
