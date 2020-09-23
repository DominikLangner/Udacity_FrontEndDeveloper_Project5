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

  postData("http://localhost:8081/c2s", travelDetails).then(
    retrieveData("http://localhost:8081/s2c")
  );

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

export { dateChanged, sendInfosToServer, retrieveData };
