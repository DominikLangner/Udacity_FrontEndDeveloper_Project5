/* Global Variables */

import flatpickr from "flatpickr";

//import image

import homeIcon from "../views/img/element5-digital-uE2T1tCFsn8-unsplash.jpg";

var travelImg = document.getElementById("travelImg");
travelImg.src = homeIcon;

/*Server Stuff */

//Async POST
const postData = async (url = "", data = {}) => {
  let request = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    // Transform into JSON
    //  const allData = await request;
    await request;
  } catch (error) {
    console.log("error", error);
  }
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

  postData("http://localhost:8081/c2s", travelDetails)
    .then(() => retrieveData("http://localhost:8081/s2c"))
    .then((allData) => updateUI(allData));

  // let textanswer = createAnswerText(res);
  //  document.getElementById("results").innerText = textanswer;
};

// Async GET
let retrieveData = async (url = "http://localhost:8081/s2c", res) => {
  const request = await fetch(url);
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log("RETRIEVED DATA.current:", allData.current);
    return allData;
  } catch (error) {
    console.log("error", error);
  }
};

/* UPDATE UI */

const updateUI = (allData) => {
  console.log("__________________________");
  console.log("-------UPDATING UI--------");
  console.log("ALLDATA: ", allData);

  /// save Infos in local storage
  localStorage.setItem("allData", JSON.stringify(allData));

  if (allData.current.pastDate) {
    document.getElementById("reportType").innerHTML =
      "Error:<br>Selected date is in the past.<br>Please select a valid date";
  } else {
    document.getElementById("reportType").innerHTML = allData.current.weather
      .forecast
      ? "based on the 16 day forecast:"
      : "based on the climate normals for this location and date:";

    document.getElementById("resultDestination").innerHTML =
      "Destination: " + allData.current.destination;
    document.getElementById("resultDate").innerHTML =
      "Travel Date: " + allData.current.date;
    document.getElementById("daysLeft").innerHTML =
      "Days untill your travel: " + allData.current.daysLeft;
    document.getElementById("resultTemp").innerHTML =
      "Average temperature (°C): " + allData.current.weather.temp;
    document.getElementById("resultWind").innerHTML =
      "Average wind speed (m/s): " + allData.current.weather.wind;
    document.getElementById("resultSnow").innerHTML =
      "Average snow (mm): " + allData.current.weather.snow;
    document.getElementById("travelImg").src = allData.current.imageUrl;
  }
};

/////////check localStorage
if (localStorage.allData) {
  var allData = JSON.parse(localStorage.getItem("allData"));
  updateUI(allData);
}

export { dateChanged, sendInfosToServer, retrieveData };
