import { dateChanged } from "./app";
import { sendInfosToServer } from "./app";
//import { handleSubmit } from "./js/formHandler";

import flatpickr from "flatpickr";
flatpickr("#flatpickr", {
  dateFormat: "d/m/Y",
  onChange: dateChanged,
});

import "../views/style.scss";
import "../../../node_modules/flatpickr/dist/flatpickr.min.css";
/*import "./styles/base.scss";
import "./styles/form.scss";
import "./styles/footer.scss";
import "./styles/header.scss";
export { checkValidUrl, handleSubmit };
*/
//export { flatpickr, sendInfosToServer };

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
  document.getElementById("destination").value
    ? (console.log("destination exists as well"), sendInfosToServer())
    : console.log("no destination");
});

// Listener 2:
// Change Destination when date exists => send Infos to server
document.getElementById("destination").addEventListener("change", () => {
  document.getElementById("flatpickr").value
    ? (console.log("date exists as well"), sendInfosToServer())
    : console.log("no date");
});
