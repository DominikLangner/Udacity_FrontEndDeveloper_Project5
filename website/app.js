/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate() + "." + d.getMonth() + "." + d.getFullYear();

// Click Listener for "generate"-button
document.getElementById("generate").addEventListener("click", performAction);

// What happens when button is clicked
function performAction() {
  console.log("PerformAction performed");
  //const performAction = function async() {
  let zip = document.getElementById("zip").value;
  getUserInput();
  /*getWeather(baseURL, zip, apiKey, options).then((data) => {
    console.log(data.main.temp); */
  getWeather(baseURL, zip, apiKey, options)
    .then((raw) => postData("/add", combineData(raw)))
    .then(() => retrieveData("/entries"))
    .then(updateUI);

  console.log(newDate);
  // console.log(data);
  //showData();
}

/* Weather API */
// Client side code that makes a GET request to the weather info API:

let myKey = "15081f578b62ac327eed8d6972024522";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
let options = "&units=metric";
let apiKey = "&appid=" + myKey;

const getWeather = async (baseURL, zip, apiKey, options) => {
  //console.log(baseURL + zip + apiKey + options);
  const res = await fetch(baseURL + zip + apiKey + options);

  try {
    const data = await res.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

/*  User Input  */
// Client side code that gets the user input from the text field:

const getUserInput = () => {
  try {
    const userInput = document.getElementById("feelings").value;
    console.log(userInput);
    return userInput;
  } catch (error) {
    console.log("error", error);
  }
};

/* create data to show in the app */
// Temperature, Date, UserInput
const combineData = (data) => {
  let combinedData = {
    Temperature: data.main.temp,
    Date: newDate,
    Feelings: getUserInput(),
  };
  console.log(combinedData);
  return combinedData;
  //console.log(data.main.temp, newDate, getUserInput());
  //return data.main.temp, newDate, getUserInput();
  //console.log(combinedData);
};

// Async POST
const postData = async (url = "", data = {}) => {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
};

// Async GET
const retrieveData = async (url = "") => {
  const request = await fetch(url);
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log("retrievData is running");
    console.log(allData);
    return allData;
  } catch (error) {
    console.log("error", error);
  }
};

/* UPDATE UI */
const updateUI = (allData) => {
  console.log("Updating UI in progress...");
  document.getElementById("date").innerHTML = allData.data[0].Date;
  document.getElementById("temp").innerHTML = allData.data[0].Temperature;
  document.getElementById("content").innerHTML = allData.data[0].Feelings;
};

//postData("/add", { answer: 42 });

/*
function post() {
  postData("/client2server", { fav: "lion" });
  console.log("Posted ");
}
*/

/*
// TODO-Chain your async functions to post an animal then GET the resulting data
function postGet() {
  postData("/animal", { fav: "lion" }).then(function (data) {
    retrieveData("/all");
  });
}

// TODO-Call the chained function
postGet();

*/

/*postData("/userinput", {
  temperature: data.main,
  date: newDate,
  userResponse: data.userResp,
});
*/
