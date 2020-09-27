function dateFormat(d) {
  var moment = require("moment");
  let date = d.split("/")[2] + "-" + d.split("/")[1] + "-" + d.split("/")[0];
  return date;
}

//export { dateFormat };
module.exports = dateFormat;
