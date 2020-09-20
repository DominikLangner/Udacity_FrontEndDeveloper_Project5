// SETUP .ENV to access API-KEYs
const dotenv = require("dotenv");
dotenv.config();
console.log(`Your pixaBay API key is ${process.env.PIXABAY_API_KEY}`);
console.log(`Your geonames API key (=user) is ${process.env.GEONAMES_API_KEY}`);

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
  //console.log(projectData);
  getPic(queryData.destination);
  getPlaceCoordinates(queryData.destination);
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

////////////END of GEONAMES API QUERY

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
    return allGeonamesData;
  } catch (error) {
    console.log("error", error);
  }
};

////////////END of GEONAMES API QUERY

// GET route
app.get("/s2c", s2c);

function s2c(request, response) {
  response.send(projectData);
}
