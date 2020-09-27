const dateFormat = require("../src/server/dateFormat");

//Testing if date gets formatted correctly to send to APIs and use for moment.js
test("Testing fields_ok function:", () => {
  let projectData;
  expect(dateFormat("30/09/2020")).toBe("2020-09-30");
});
