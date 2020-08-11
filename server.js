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

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 8000;
const server = app.listen(port, listening);
function listening() {
  console.log("server is running");
  console.log(`running on localhost: ${port}`);
}

// POST route
app.post("/add", addJournal);

/* In the callback function, add the data received from request.body. This is the key piece of information we are interested in from that long stretch of data we saw previously that the request (req) argument returns. */

function addJournal(req, res) {
  projectData.data.push(req.body);
  res.send("POST received");
}

// GET route
app.get("/entries", sendData);

function sendData(request, response) {
  response.send(projectData);
}
