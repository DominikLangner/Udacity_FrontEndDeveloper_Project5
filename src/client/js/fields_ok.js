/////////check if fields "destination" & "date" are set
function fields_ok(test_date, test_destination) {
  let x, a, b;
  if (test_date && test_destination) {
    //for testing:
    a = test_date;
    b = test_destination;
  } else {
    //for real:
    a = document.getElementById("flatpickr").value;
    b = document.getElementById("destination").value;
  }
  //field-check:
  x = !!(a && b);
  console.log(x);
  return x;
}

export { fields_ok };
