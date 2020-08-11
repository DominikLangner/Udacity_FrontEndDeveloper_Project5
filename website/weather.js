// Client side code that makes a GET request to the weather info API:

let myKey = "15081f578b62ac327eed8d6972024522";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?q=";
let options = "&units=metric";
//let city;
//let parameter;
let apiKey = "&appid=" + myKey;
console.log(apiKey);

//let zip = document.getElementById("zip");

//function performLog() {
//  console.log("Click");
//}

document.getElementById("generate").addEventListener("click", performAction);

function performAction() {
  let zip = document.getElementById("zip").value;
  console.log(zip);
  getWeather(baseURL, zip, apiKey, options);
}

const getWeather = async (baseURL, zip, apiKey, options) => {
  //console.log(baseURL + zip + apiKey + options);
  const res = await fetch(baseURL + zip + apiKey + options);

  try {
    const data = await res.json();
    console.log(data);
    console.log(data.main.temp);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
