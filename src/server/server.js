// SETUP .ENV to access API-KEYs
const dotenv = require("dotenv");
dotenv.config();
console.log(" ");
console.log("------------------------------");
console.log(`Your pixaBay API key is: ${process.env.PIXABAY_API_KEY}`);
console.log(
  `Your geonames API key (=user) is: ${process.env.GEONAMES_API_KEY}`
);
console.log(`Your weatherbit API key is ${process.env.WEATHERBIT_API_KEY}`);
console.log("------------------------------");
console.log(" ");

// Setup empty JS object to act as endpoint for all routes
projectData = { current: {} };

/////////////////

const dateFormat = require("../server/dateFormat");

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fetch = require("node-fetch");

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = 8081;
const server = app.listen(port, listening);
function listening() {
  console.log("server is running");
  console.log(`running on localhost: ${port}`);
}

// POST route
app.post("/c2s", c2s);

/* In the callback function, add the data received from request.body. This is the key piece of information we are interested in from that long stretch of data we saw previously that the request (req) argument returns. */

function c2s(req, res) {
  let queryData = req.body;
  projectData.current = queryData;
  console.log("queryData: ", queryData);
  let promise1 = getPic(queryData.destination);
  let promise2 = getPlaceCoordinates(
    queryData.destination
  ).then((coordinates) => getWeather(coordinates, projectData.current.date));
  Promise.all([promise1, promise2]).then(() => {
    console.log("All");
    res.send("POST received");
  });
  //   .then(() => {
  //     app.get("/s2c", function async(req, res) {
  //      res.send(projectData);
  //    });
  //  });

  //res.send("POST received"); // not working yet
}

////////////////////////GET PIC:

function getPic(destination) {
  getPixabayPic(destination).then((pixabayData) => {
    let pixaBayImageUrl = pixabayData.hits[0].largeImageURL;
    console.log(pixaBayImageUrl);
    projectData.current.imageUrl = pixaBayImageUrl;
    console.log(projectData.current);
    console.log("pic");
  });
}

////////////////////////// query pixabay API

// Async POST
const getPixabayPic = async (place) => {
  let apiCall =
    "https://pixabay.com/api/?key=" +
    process.env.PIXABAY_API_KEY +
    "&q=" +
    place +
    "+landmark" +
    "&image_type=photo" +
    "&category=places" +
    "&page=1" +
    "&per_page=3";
  let getPixabayPic = await fetch(apiCall, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    // Transform into JSON
    const allData = await getPixabayPic.json();
    console.log("XXX :  ", allData);
    //console.log(allData);

    //////////// check if imageswere found
    console.log(allData.total);
    if (allData.total == "0") {
      allData.hits = [];
      let st = {
        largeImageURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Question_mark.svg/330px-Question_mark.svg.png",
      };
      allData.hits.push(st);
    }

    return allData;
  } catch (error) {
    console.log("error", error);
  }
};
////////////END of PIXABAY API QUERY

////////////GEONAMES API QUERY
// Async POST
const getPlaceCoordinates = async (place) => {
  let apiCall =
    "http://api.geonames.org/searchJSON?q=" +
    place +
    "&maxRows=1&username=" +
    process.env.GEONAMES_API_KEY;

  let getPlaceCoordinates = await fetch(apiCall, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    // Transform into JSON
    const allGeonamesData = await getPlaceCoordinates.json();
    let lat = allGeonamesData.geonames[0].lat;
    let lng = allGeonamesData.geonames[0].lng;
    console.log(lat, " / ", lng);
    const coordinates = {};
    coordinates.lat = lat;
    coordinates.lng = lng;
    projectData.current.coordinates = coordinates;
    console.log("141: ", projectData);
    console.log("coord");
    return coordinates;
  } catch (error) {
    console.log("error", error);
  }
};

////////////END of GEONAMES API QUERY

/////////////////////////// WEATHER API
// https://api.weatherbit.io/v2.0/current?
//   /forecast/daily?lat={lat}&lon={lon}
//current?lat...

/////// WEATHERBIT - 16 days forecast
const getWeather_16DaysForecast = async (lat_lng, date) => {
  let apiCall_16DaysForecast =
    "https://api.weatherbit.io/v2.0/forecast/daily?" +
    "&lat=" +
    lat_lng.lat +
    "&lon=" +
    lat_lng.lng +
    "&key=" +
    process.env.WEATHERBIT_API_KEY;

  let getWeatherData = await fetch(apiCall_16DaysForecast, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    // Transform into JSON
    const weather = await getWeatherData.json();
    console.log("Weather Data:");
    // find index of weather data for the travel-day:
    console.log(weather.data);
    let index = moment(date).diff(moment().startOf("day"), "days");
    let weatherData = weather.data[index];
    console.log("Moments-Diff is: ", index);
    console.log("16 Tage Wetter: ", weatherData);
    projectData.current.weather.temp = weatherData.temp;
    projectData.current.weather.temp_min = weatherData.min_temp;
    projectData.current.weather.temp_max = weatherData.max_temp;
    projectData.current.weather.wind = weatherData.wind_spd;
    projectData.current.weather.snow = weatherData.snow;
    console.log(projectData.current);
    return weather.data[index];
  } catch (error) {
    console.log("error", error);
  }
};

//////////////////////// Compare dates to call the correct API (16 day forecast / climate normals)
//var moment = require("moment");

var moment = require("moment");
const getWeather = async (coordinates, d) => {
  var moment = require("moment");
  console.log("XXX getWeather XXX");
  console.log(d);
  let date = dateFormat(d);
  console.log("date: ", date);
  let today17 = moment().add(17, "d");
  let forecast = moment(date).isBefore(today17);

  ////////////////// check if date is before today:
  let date2 = moment(date).add(1, "d");
  let pastDate = moment(date2).isBefore(moment());
  projectData.current.pastDate = pastDate;

  ////////////////////check day till travel date
  let daysLeft = moment(date).diff(moment().startOf("day"), "days");
  console.log("daysLeft: ", daysLeft);
  projectData.current.daysLeft = daysLeft;

  ///////////////////////////////////////////////////
  if (pastDate) {
    projectData.current.weather = {};
    projectData.current.weather.forecast = "past";
    return "Travel date is in the past";
  } else {
    projectData.current.weather = {};
    projectData.current.weather.forecast = forecast;
    if (forecast) {
      console.log(
        "travel date is within the next 16 days --> getting 16days forecast"
      );
      return getWeather_16DaysForecast(coordinates, date);
    } else {
      console.log(
        "travel date is NOT within the next 16 days --> getting climate nomrals instead of forecast"
      );
      return getWeather_climateNormals(coordinates);
    }
  }
};
///////////////// WEATHERBIT climate normals (for date > today+16days)
const getWeather_climateNormals = async (lat_lng) => {
  let date = projectData.current.date;
  let day = date.split("/")[0];
  let month = date.split("/")[1];
  let dateString = month + "-" + day;

  let weatherCall_climateNormals =
    "https://api.weatherbit.io/v2.0/normals" +
    "?start_day=" +
    dateString +
    "&end_day=" +
    dateString +
    "&lat=" +
    lat_lng.lat +
    "&lon=" +
    lat_lng.lng +
    "&key=" +
    process.env.WEATHERBIT_API_KEY;

  let getWeatherData = await fetch(weatherCall_climateNormals, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    // Transform into JSON
    const weather = await getWeatherData.json();
    console.log("Weather Data:");
    console.log(dateString);
    console.log(weather);

    projectData.current.weather.temp = weather.data[0].temp;
    projectData.current.weather.temp_min = weather.data[0].min_temp;
    projectData.current.weather.temp_max = weather.data[0].max_temp;
    projectData.current.weather.wind = weather.data[0].wind_spd;
    projectData.current.weather.snow = weather.data[0].snow;
    console.log(projectData.current);
    return weather;
  } catch (error) {
    console.log("error", error);
  }
};

//////////////END WEATHERBIT climate normals

// GET route

app.get("/s2c", function (req, res) {
  console.log("s2c");
  res.send(projectData);
});
