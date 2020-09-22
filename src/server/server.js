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
projectData = { data: [] };

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
app.use(express.static("src/server"));

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
  projectData.data.push(queryData);
  console.log(queryData);
  //console.log("projectData.data[0].date : ", projectData.data[0].date);
  getPic(queryData.destination);
  getPlaceCoordinates(queryData.destination).then((coordinates) => {
    // let lat = coordinates.lat;
    // let lng = coordinates.lng;
    console.log(
      "Then part of c2s reached. Coordinates are :",
      coordinates,
      "Date is :",
      projectData.data[0].date
    );
    getWeather(coordinates, projectData.data[0].date);
  });

  res.send("POST received"); // not working yet
}

////////////////////////GET PIC:

function getPic(destination) {
  //let destination = projectData.data[0].destination;

  getPixabayPic(destination).then((pixabayData) => {
    let pixaBayImageUrl = pixabayData.hits[0].largeImageURL;
    console.log(pixaBayImageUrl);
    //projectData.data[0].image.push(pixaBayImageUrl);
    projectData.data[0].imageUrl = pixaBayImageUrl;
    console.log(projectData.data);
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
    //console.log(allData);
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
    projectData.data[0].coordinates = coordinates;
    console.log(projectData);
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
const getWeather_16DaysForecast = async (lat_lng) => {
  let weatherCall_16DaysForecast =
    "https://api.weatherbit.io/v2.0/forecast/daily?";

  let date = projectData.data[0].date;
  let day = projectData.data[0].date.split("/")[0];
  let month = projectData.data[0].date.split("/")[1];
  let dateString = month + "-" + day;
  console.log(date, "\n", dateString);

  let apiCall_16DaysForcast =
    weatherCall_16DaysForecast +
    "&lat=" +
    lat_lng.lat +
    "&lon=" +
    lat_lng.lng +
    "&key=" +
    process.env.WEATHERBIT_API_KEY;

  let getWeatherData = await fetch(apiCall_16DaysForcast, {
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
    return weather;
  } catch (error) {
    console.log("error", error);
  }
};

//////////////////////// Datumsvergleich, dann richtige API aufrufen
var moment = require("moment");

const getWeather = async (coordinates, d) => {
  console.log("_________________________");
  console.log("HIER DATE mit aktuellem datum vergleichen:");
  let date =
    d.split("/")[2] + "-" + d.split("/")[1] + "-" + d.split("/")[0] + "";
  console.log("date: ", date);

  //////////////////////////////////////////////////////////////
  console.log(moment(date).isBefore(moment().add(16, "d")));
  let check = moment(date).isBefore(moment().add(16, "d"));
  console.log(check);
  ///////////////////////////////////////////////////

  if (check) {
    console.log("today+16days is before travel date");
  } else {
    console.log("DAtum ist NICHT vor travelDate");
  }

  // let today2 = moment(date).add(16, "d").format("DD-MM-yy");
  //console.log("today2: ", today2);
};

///////////////// WEATHERBIT climate normals (for date > today+16days)
const getWeather_climateNormals = async (lat_lng) => {
  let date = projectData.data[0].date;
  let day = projectData.data[0].date.split("/")[0];
  let month = projectData.data[0].date.split("/")[1];
  let dateString = month + "-" + day;
  console.log(date, "\n", dateString);

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
    //const coordinates = {};
    //coordinates.lat = lat;
    //coordinates.lng = lng;
    //projectData.data[0].coordinates = coordinates;
    //console.log(projectData);
    return weather;
  } catch (error) {
    console.log("error", error);
  }
};

//////////////END WEATHERBIT climate normals

// GET route
app.get("/s2c", s2c);

function s2c(request, response) {
  response.send(projectData);
}
