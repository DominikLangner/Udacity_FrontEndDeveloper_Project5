const fields_ok = require("../src/client/js/fields_ok");
//const index = require("../src/client/js/index.js");

//Testing different variations of the URL
test("Testing fields_ok function:", () => {
  expect(fields_ok.fields_ok("30/09/2020", "Munich, Germany")).toBe(true);
});
