$(document).ready(function() {

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

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {


        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().time;
        var trainFrequency = childSnapshot.val().frequency;

        var currentTime = moment();

        var convertedTime = moment(currentTime, "hh:mm").subtract(1, "years");

       var differenceTime = moment().diff(moment(convertedTime), "minutes");

       var remainderTime = differenceTime % trainFrequency;

       var minutesAway = trainFrequency - remainderTime;

       var nextArrival = moment().add(minutesAway, "minutes");

        $("#train-table > tbody").append(
            "<tr><td>" + trainName +
            "</td><td>" + trainDestination +
            "</td><td>" + trainFrequency +
            "</td><td>" + nextArrival.format("hh:mm") +
            "</td><td>" + minutesAway +
            "</td></tr>");

    })

})