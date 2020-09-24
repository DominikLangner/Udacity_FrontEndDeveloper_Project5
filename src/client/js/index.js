//import xml2js from "xml2js";
import { dateChanged } from "./app";
import { sendInfosToServer } from "./app";
import { retrieveData } from "./app";

import flatpickr from "flatpickr";
flatpickr("#flatpickr", {
  dateFormat: "d/m/Y",
  onChange: dateChanged,
});

import "../views/style.scss";
import "../../../node_modules/flatpickr/dist/flatpickr.min.css";

////////////////////////////////////////
//                                    //
//           EVENT LISTENER           //
//                                    //
////////////////////////////////////////
//         Two Event Listener:        //
// If destination or date is entered, //
// these listeners check if the other //
// form is already filled;            //
////////////////////////////////////////

// Listener 1:
//Change Date when destination exists => send Infos to server
document.getElementById("flatpickr").addEventListener("change", () => {
  fields_ok()
    ? (console.log("destination exists as well"), sendInfosToServer())
    : console.log("no destination");
});

// Listener 2:
// Change Destination when date exists => send Infos to server
document.getElementById("destination").addEventListener("change", () => {
  fields_ok()
    ? (console.log("date exists as well"), sendInfosToServer())
    : console.log("no date");
});

////////////check if traveldate is before today:
var moment = require("moment");
/*
let date_ok = () => {
  let f_date = document.getElementById("flatpickr").value;
  let date =
    f_date.split("/")[2] +
    "-" +
    f_date.split("/")[1] +
    "-" +
    f_date.split("/")[0];
  console.log("date: ", date);
  if (moment(date).isBefore(moment())) {
    console.log("SORRY; TRAVEL DATE BEFORE TODAY");
    exit;
  } else {
  }
};
*/

/////////check if fields "destination" & "date" are set
let fields_ok = () => {
  let x;
  document.getElementById("flatpickr").value &&
  document.getElementById("destination").value
    ? (x = true)
    : (x = false);
  console.log(x);
  return x;
};
