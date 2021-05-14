var dateTime = luxon.DateTime;
var dt = dateTime.now();
let jumbotron = $(".jumbotron");
let searchEl = $("#search");
let dropEl = $("#number");
let searchtextEl = $("#searchtext");
let submitBtn = $("#submit");
let fiveDayEl = $("#fiveday");
let previousEl = $("#previous");
let clearPrev = $("#clearprev");
var jumbotronText;
let apiKey = "e3e0077e49dc54a039f6d6b6ddc8365e"
var topPX = 325;
clearPrev.css({ "top": topPX + "px" })
var temperature;
var success;
if (JSON.parse(localStorage.getItem("previous")) === null) {
    localStorage.setItem("previous", JSON.stringify([]))
    var previous = []
} else {
    var previous = JSON.parse(localStorage.getItem("previous"))
    for (i in previous) {
        previousliEl = $("<li>");
        previousliEl.text(previous[i].name);
        previousliEl.attr("id", i)
        previousliEl.addClass("btn");
        previousEl.append(previousliEl);
        topPX += 48;
        clearPrev.css({ "top": topPX + "px" })
    }
}
var lat;
var lon;
jumbotron.children().eq(0).text(dateTime.now().toLocaleString(dateTime.DATE_SHORT))

function goToHistory(event) {
    let object = $(event.target);
    for (i in options) {
        for (j in previous) {
            if (options[i]["name"].toLowerCase() === previous[object.attr("id")].country.toLowerCase()) {
                var countryCode = options[i]["code"];
            }
        }

    }
    var repeat = false;
    let zip = previous[object.attr("id")].zip + "," + countryCode;
    for (i in previous) {
        if (previous[i].country.toLowerCase() === dropEl.val().toLowerCase() && previous[i].zip === searchEl.val()) {
            repeat = true;
            break;
        }
    }
    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${apiKey}`;
    fetch(url)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(function (data) {
            if (data !== undefined) {
                jumbotronText = data.name + ", " + data.country + " (" + dateTime.now().toLocaleString(dateTime.DATE_SHORT) + ")"
                lat = data.lat;
                lon = data.lon;
                if (repeat !== true) {
                    previous.push({
                        "name": data.name,
                        "country": dropEl.val(),
                        "zip": searchEl.val()
                    })
                    addToHistory();
                }
                localStorage.setItem("previous", JSON.stringify(previous))
                displayWeather(lat, lon);
            }
            return;
        })
}



function addToHistory() {
    previousliEl = $("<li>");
    for (i in previous) {
        previousliEl.text(previous[i].name);
        previousliEl.attr("id", i)
        previousliEl.addClass("previouszips")
    }
    previousliEl.addClass("btn");
    previousEl.append(previousliEl);
    topPX += 48;
    clearPrev.css({ "top": topPX + "px" })

}

function displayForecast(data) {
    for (i = 0; i < 5; i++) {
        if (data.daily[(i + 1).toString()].weather[0].id >= 500 && data.daily[(i + 1).toString()].weather[0].id < 600 || data.daily[(i + 1).toString()].weather[0].id >= 300 && data.daily[(i + 1).toString()].weather[0].id < 400) {
            fiveDayEl.children().eq(i).children().eq(1).text("🌧");
        } else if (data.daily[(i + 1).toString()].weather[0].id >= 200 && data.daily[(i + 1).toString()].weather[0].id < 300) {
            fiveDayEl.children().eq(i).children().eq(1).text("⛈");
        } else if (data.daily[(i + 1).toString()].weather[0].id >= 600 && data.daily[(i + 1).toString()].weather[0].id < 700) {
            fiveDayEl.children().eq(i).children().eq(1).text("❄");
        } else if (data.daily[(i + 1).toString()].weather[0].id > 800 && data.daily[(i + 1).toString()].weather[0].id < 900) {
            fiveDayEl.children().eq(i).children().eq(1).text("☁");
        } else if (data.daily[(i + 1).toString()].weather[0].id === 800) {
            fiveDayEl.children().eq(i).children().eq(1).text("☀");
        }
        fiveDayEl.children().eq(i).children().eq(0).text(dateTime.now().plus({ days: parseInt(i) + 1 }).toLocaleString(dateTime.DATE_SHORT));
        fiveDayEl.children().eq(i).children().eq(2).text(`Temp: ${data.daily[(i + 1).toString()].temp.day}°F`);
        fiveDayEl.children().eq(i).children().eq(3).text(`Wind: ${data.daily[(i + 1).toString()].wind_speed} MPH`);
        fiveDayEl.children().eq(i).children().eq(4).text(`Humidity: ${data.daily[(i + 1).toString()].humidity}%`);
    }
}

function displayWeather(lat, lon) {
    console.log(lat, lon)
    let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            if (data.current.weather[0].id >= 500 && data.current.weather[0].id < 600 || data.current.weather[0].id >= 300 && data.current.weather[0].id < 400) {
                jumbotron.children().eq(0).text(jumbotronText + "🌧");
            } else if (data.current.weather[0].id >= 200 && data.current.weather[0].id < 300) {
                jumbotron.children().eq(0).text(jumbotronText + "⛈");
            } else if (data.current.weather[0].id >= 600 && data.current.weather[0].id < 700) {
                jumbotron.children().eq(0).text(jumbotronText + "❄");
            } else if (data.current.weather[0].id > 800 && data.current.weather[0].id < 900) {
                jumbotron.children().eq(0).text(jumbotronText + "☁");
            } else if (data.current.weather[0].id === 800) {
                jumbotron.children().eq(0).text(jumbotronText + "☀");
            }
            jumbotron.children().eq(1).text(`Temp: ${data.current.temp}°F`);
            jumbotron.children().eq(2).text(`Wind: ${data.current.wind_speed} MPH`);
            jumbotron.children().eq(3).text(`Humidity: ${data.current.humidity}%`);
            jumbotron.children().eq(4).children().eq(0).text(`${data.current.uvi}`);
            jumbotron.children().eq(4).children().eq(0).css({ "padding-left": "10px", "padding-right": "10px", "border-radius": "5px" });
            if (parseInt(data.current.uvi) < 3) {
                jumbotron.children().eq(4).children().eq(0).css({ "background-color": "lime" });
            } else if (parseInt(data.current.uvi) >= 3 && parseInt(data.current.uvi) < 6) {
                jumbotron.children().eq(4).children().eq(0).css({ "background-color": "yellow" });
            } else if (parseInt(data.current.uvi) >= 6 && parseInt(data.current.uvi) < 8) {
                jumbotron.children().eq(4).children().eq(0).css({ "background-color": "orange" });
            } else if (parseInt(data.current.uvi) >= 8 && parseInt(data.current.uvi) < 9) {
                jumbotron.children().eq(4).children().eq(0).css({ "background-color": "red" });
            } else {
                jumbotron.children().eq(4).children().eq(0).css({ "background-color": "purple" });
            }
            displayForecast(data);
            return data;
        })

}

submitBtn.on("click", function () {
    for (i in options) {
        if (options[i]["name"].toLowerCase() === dropEl.val().toLowerCase()) {
            var countryCode = options[i]["code"];
        }
    }
    var repeat = false;
    let zip = searchEl.val() + "," + countryCode;
    for (i in previous) {
        if (previous[i].country.toLowerCase() === dropEl.val().toLowerCase() && previous[i].zip === searchEl.val()) {
            repeat = true;
            break;
        }
    }

    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${apiKey}`;

    fetch(url)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return undefined;
            }
        })
        .then(function (data) {
            if (data != undefined) {
                jumbotronText = data.name + ", " + data.country + " (" + dateTime.now().toLocaleString(dateTime.DATE_SHORT) + ")"
                lat = data.lat;
                lon = data.lon;
                if (repeat !== true) {
                    previous.push({
                        "name": data.name,
                        "country": dropEl.val(),
                        "zip": searchEl.val()
                    })
                    addToHistory();
                }
                localStorage.setItem("previous", JSON.stringify(previous))
                displayWeather(lat, lon);
            } else {
                alert("Please enter a valid zip code for that country.")
            }
            return;
        })
})

previousEl.on("click", "li", goToHistory);

clearPrev.on("click", function () {
    for (i in previous) {
        previousEl.children().eq(1).remove()
    }
    previous = []
    localStorage.setItem("previous", JSON.stringify([]))
    topPX = 325;
    clearPrev.css({ "top": topPX + "px" })
})

$(function () {
    for (i in options) {
        option = $("<option>");
        option.text(options[i]["name"])
        if (option.text() === "United States of America") {
            option.attr({ selected: "selected" })
        }
        dropEl.append(option)
    }
    dropEl.selectmenu().selectmenu().selectmenu("menuWidget").addClass("overflow");
})

