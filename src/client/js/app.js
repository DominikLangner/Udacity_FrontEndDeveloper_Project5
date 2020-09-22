/* Global Variables */

import flatpickr from "flatpickr";

//import xml2js from "xml2js";

/*Server Stuff */

//Async POST
const postData = async (url = "", data = {}) => {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

/* Functions */
let dateChanged = (selectedDates, dateStr, instance) => {
  console.log(dateStr);
  //sendInfosToServer()
};

let sendInfosToServer = () => {
  console.log("...sending to Server ...");
  let travelDetails = {
    destination: document.getElementById("destination").value,
    date: document.getElementById("flatpickr").value,
  };
  console.log(travelDetails);
  console.log(travelDetails.destination);
  console.log(travelDetails.date);
  postData("http://localhost:8081/c2s", travelDetails);
};

// var example = flatpickr("#flatpickr-tryme");
/*
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate() + "." + d.getMonth() + "." + d.getFullYear();

// Click Listener for "generate"-button
document.getElementById("generate").addEventListener("click", performAction);

// What happens when button is clicked
function performAction() {
  let zip = document.getElementById("zip").value;
  getUserInput();
  getWeather(baseURL, zip, apiKey, options)
    .then((raw) => postData("/add", combineData(raw)))
    .then(() => retrieveData("/entries"))
    .then(updateUI);
}

/* Weather API */
// Client side code that makes a GET request to the weather info API:
/*
let myKey = "15081f578b62ac327eed8d6972024522";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
let options = "&units=metric";
let apiKey = "&appid=" + myKey;

const getWeather = async (baseURL, zip, apiKey, options) => {
  const res = await fetch(baseURL + zip + apiKey + options);

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
*/
/*  User Input  */
// Client side code that gets the user input from the text field:
/*
const getUserInput = () => {
  try {
    const userInput = document.getElementById("feelings").value;
    return userInput;
  } catch (error) {
    console.log("error", error);
  }
};
*/
/* create data to show in the app */
// Temperature, Date, UserInput
/*
const combineData = (data) => {
  let combinedData = {
    Temperature: data.main.temp,
    Date: newDate,
    Feelings: getUserInput(),
  };
  return combinedData;
};
*/

// Async GET
const retrieveData = async (url = "") => {
  const request = await fetch(url);
  try {
    // Transform into JSON
    const allData = await request.json();
    return allData;
  } catch (error) {
    console.log("error", error);
  }
};

/* UPDATE UI */
/*
const updateUI = (allData) => {
  lastElement = allData.data.length - 1;
  document.getElementById("date").innerHTML = allData.data[lastElement].Date;
  document.getElementById("temp").innerHTML =
    allData.data[lastElement].Temperature;
  document.getElementById("content").innerHTML =
    allData.data[lastElement].Feelings;
};
*/

export { dateChanged, sendInfosToServer };
