var weatherData = function(city) {
    console.log("start");
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=ef42ec77e5abd2ef83947df102ff17d6")
    .then(function(res) {
        res.json().then(function(data) {
            if (data.length > 1) {
                for(var i = 0; i < data.length; i++){
                    var conf = confirm("Is the city you are looking for " + data[i].name + ", " + data[i].country + ", " + data[i].state + "?");
                    if (conf) {
                        var coord = { "lon": data[i].lon, "lat": data[i].lat}
                        return coord;
                    }
                }
            } else {
                var coord = { "lon": data[i].lon, "lat": data[i].lat}
                        return coord;
            }
        }).then(function(coord){
            console.log(coord);
        })
    })

    // fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ef42ec77e5abd2ef83947df102ff17d6&units=imperial")
    // .then(function(res){
    //     res.json().then(function(data){
    //         if(data.cod = 404) {
    //             alert("Sorry the City you are looking for could not be found.");
    //         }
    //         console.log(data);
    //     })
    // }).catch(function(reason){
    //     alert(reason);
    // })
}

$("#target").submit(function(event){
    event.preventDefault();
    var city = $("#input-city").val();
    weatherData(city);
})
