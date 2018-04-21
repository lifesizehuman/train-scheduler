
var config = {
    apiKey: "AIzaSyCCFTtP84qjShv7EzKpmVSSLarJoDa_mc4",
    authDomain: "train-scheduler-5cc49.firebaseapp.com",
    databaseURL: "https://train-scheduler-5cc49.firebaseio.com",
    projectId: "train-scheduler-5cc49",
    storageBucket: "train-scheduler-5cc49.appspot.com",
    messagingSenderId: "379506602196"
};
firebase.initializeApp(config);

database = firebase.database();

$('#add-train').on('click', function(event) {
    event.preventDefault();

    var name = $('#train-input').val().trim();
    var destination = $('#destination-input').val().trim();
    var time = $('#time-input').val().trim();
    var frequency = $('#frequency-input').val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency
    })

    $('#train-input').val("");
    $('#destination-input').val("");
    $('#time-input').val("");
    $('#frequency-input').val("");
})

database.ref().limitToLast(5).on("child_added", function(childSnapshot, prevChildKey) {

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = moment(childSnapshot.val().time, "HH:mm a");
    var trainFrequency = childSnapshot.val().frequency;

    var currentTime = moment();
    var firstArrivalTime = moment(childSnapshot.val().time, "HH:mm a");
    
    var currentMinutes = ((currentTime.hour() * 60) + currentTime.minutes());
    var trainMinutes = ((trainTime.hour() * 60) + trainTime.minutes());

    var differenceMinutes = (currentMinutes - trainMinutes);
    var remainderTime = differenceMinutes % trainFrequency;
    var minutesAway = trainFrequency - remainderTime ;
    var nextArrival = moment(currentTime).add(minutesAway, "minutes");

    changeArrival = () => {
        if (nextArrival > firstArrivalTime) {
           console.log(nextArrival.format("hh:mm a"));
           return nextArrival.format('hh:mm a');
        } else {
          return firstArrivalTime.format('hh:mm a'); 
        }
    }

    changeMinutes = () => {
        if (nextArrival < firstArrivalTime) {
            return (parseInt(minutesAway) + parseInt(trainFrequency));
        } else {
            return minutesAway;
        }
    }

    console.log('First Arrival Time: ' + firstArrivalTime);
     console.log("Train Frequency: " + trainFrequency);
     console.log("Minutes Away: " + minutesAway); 
    


    $("#train-table > tbody").prepend(
        "<tr><td>" + trainName +
        "</td><td>" + trainDestination +
        "</td><td>" + trainFrequency +
        "</td><td>" + firstArrivalTime.format('hh:mm a') +
        "</td><td>" + changeArrival() +
        "</td><td>" + changeMinutes() +
        "</td></tr>");
})