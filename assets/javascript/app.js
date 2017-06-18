//https://stackoverflow.com/questions/23449917/run-js-function-every-new-minute

firebase.initializeApp(config);
var trainID = 0;
var database = firebase.database();





database.ref().on("child_added", function(snapshot) {

  // Print the initial data to the console.
  console.log(snapshot.val());
  console.log("test");
  var obj = snapshot.val();
  var key = snapshot.key;
  var arrivalObj = calcNextArrival(obj.firstTime, obj.frequency);
  var row = $('<tr class="trainRow" id="train'+trainID+'">').data("data-key", key).append($('<td>').html(obj.name)).append($('<td>').html(obj.destination)).append($('<td>').html(arrivalObj.nextArrival)).append($('<td>').html(arrivalObj.minutesToNext));
  var button = $("<button>").html("x").addClass("deleteButton").data("data-key", key).attr("data-trainID", trainID);
  row.append($('<td>').append(button));
  $("#tablebody").append(row);
  trainID++;

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  //use local storage for offline
});

$("#submit").on("click", function(event) {
  event.preventDefault();
  var train = {
    name: $("#train-name-input").val().trim(),
    destination: $("#destination-input").val().trim(),
    firstTime: $("#first-time-input").val().trim(),
    frequency: $("#frequency-input").val().trim()
  };
  //use firebase.push
  database.ref().push(train);

});

function calcNextArrival(firstTime, frequency){
  var firstTimeMoment = moment(firstTime, "hh:mm").subtract(1,"years");
  var currentTimeMoment = moment(moment(), "hh:mm");
  var diffTime = currentTimeMoment.diff(firstTimeMoment, "minutes");
  var remainder = diffTime % frequency;
  var minutesToNext = frequency - remainder;
  var nextArrival = currentTimeMoment.add(minutesToNext, "minutes");


  return {
    minutesToNext: minutesToNext,
    nextArrival: nextArrival.format("hh:mm a"),
  };
}

$.tools.validator.fn("[type=timetest]", "Please supply a valid time", function(input, value) {
    return /^\d\d:\d\d$/.test(value);
    });
