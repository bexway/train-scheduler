firebase.initializeApp(config);

var trainID = 0;
var database = firebase.database();

//https://stackoverflow.com/questions/23449917/run-js-function-every-new-minute
var time = new Date(),
    secondsRemaining = (60 - time.getSeconds()) * 1000;

setTimeout(function() {
    setInterval(function(){
      $('.trainRow').each(function(){
        var nextArrival = $(this).children(".nextArrival").text();
        var arrivalObj = calcNextArrival($(this).data("data-firstTime"), $(this).data("data-frequency"));
        $(this).children(".nextArrival").text(arrivalObj.nextArrival);
        $(this).children(".minutesToNext").text(arrivalObj.minutesToNext);

      });
    }, 60000);
}, secondsRemaining);



$("#submit").on("click", function(event) {
  event.preventDefault();
  var inputHours = $("#time-input-one").val().trim();
  var inputMinutes = $("#time-input-two").val().trim();
  if(isValidTime(inputHours, inputMinutes)){
    $("#time-warning").addClass("hidden");
    //turn the two input time numbers into one time
    //var firstTime = inputHours.toString() + ":" + inputMinutes.toString();

    var train = {
      name: $("#train-name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      firstTime: inputHours.toString() + ":" + inputMinutes.toString(),
      frequency: $("#frequency-input").val().trim()
    };

    database.ref().push(train);
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
  }
  else{
    //if an invalid first train time was entered, don't add it to the database and put a warning on screen.
    console.log("invalid");
    $("#time-warning").removeClass("hidden");
  }
});

database.ref().on("child_added", function(snapshot) {
  //variables for easy access
  var obj = snapshot.val();
  var key = snapshot.key;
  //creating an object with the next train's arrival time and the minutes to the next train
  var arrivalObj = calcNextArrival(obj.firstTime, obj.frequency);
  //creates a row with a bunch of columns
  var row = $('<tr class="trainRow" id="train'+trainID+'">').data("data-key", key).append($('<td>').html(obj.name)).append($('<td>').html(obj.destination)).append($('<td class="nextArrival">').html(arrivalObj.nextArrival)).append($('<td class="minutesToNext">').html(arrivalObj.minutesToNext));
  //creating a button with the key for the db data attached, and the ID to find this row
  var button = $("<button>").html("x").addClass("deleteButton").data("data-key", key).attr("data-trainID", trainID);
  //add the button, firsttime and frequency to the row (for deleting and updating each minute)
  row.append($('<td>').append(button)).data("data-frequency", obj.frequency).data("data-firstTime", obj.firstTime);
  //append the row to the table and increment the train IDs
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
