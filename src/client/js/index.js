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
