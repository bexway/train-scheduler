//https://stackoverflow.com/questions/23449917/run-js-function-every-new-minute

firebase.initializeApp(config);
var trainID = 0;
var database = firebase.database();





$("#submit").on("click", function(event) {
  event.preventDefault();
  var inputHours = $("#time-input-one").val().trim();
  var inputMinutes = $("#time-input-two").val().trim();
  if(isValidTime(inputHours, inputMinutes)){
    $("#time-warning").addClass("hidden");
    //turn the two input time numbers into one time
    var firstTime = inputHours.toString() + ":" + inputMinutes.toString();

    var train = {
      name: $("#train-name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      // firstTime: $("#first-time-input").val().trim(),
      firstTime: firstTime,
      frequency: $("#frequency-input").val().trim()
    };
    //use firebase.push
    database.ref().push(train);
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
  }
  else{
    console.log("invalid");
    $("#time-warning").removeClass("hidden");
  }


});

database.ref().on("child_added", function(snapshot) {
  // Print the initial data to the console.
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









function calcNextArrival(firstTime, frequency){
  var firstTimeMoment = moment(firstTime, "HH:mm").subtract(1,"years");
  var diffTime = moment().diff(firstTimeMoment, "minutes");
  var remainder = diffTime % frequency;
  var minutesToNext = frequency - remainder;
  var nextArrival = moment().add(minutesToNext, "minutes");


  return {
    minutesToNext: minutesToNext,
    nextArrival: nextArrival.format("hh:mm a"),
  };
}

function isValidTime(hours, minutes){
  if(hours>23||minutes>59){
    return false;
  }
  else{
    console.log(true);
    return true;
  }
}
