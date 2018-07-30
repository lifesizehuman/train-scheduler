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

$('#add-train').on('click', function (event) {
    event.preventDefault();

    var name = $('#train-input').val().trim();
    var destination = $('#destination-input').val().trim();
    var time = $("#time-input").val().trim();
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

database.ref().limitToLast(5).on("child_added", function (childSnapshot, prevChildKey) {

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var firstArrivalTime = moment(childSnapshot.val().time, 'hh:mm a');

    var remainderTime = moment().diff(firstArrivalTime, 'minutes') % trainFrequency;
    var minutesAway = trainFrequency - remainderTime;


    nextArrival = () => {
        if (firstArrivalTime <= moment()) {
            console.log('first time <= moment')
            return moment().add(minutesAway, 'm').format("hh:mm a");
        } else {
            console.log('first time > moment')
            return firstArrivalTime.format('hh:mm a');
        }
    }

    console.log('First Arrival Time: ' + firstArrivalTime);
    console.log("Train Frequency: " + trainFrequency);
    console.log("Minutes Away: " + minutesAway);


    var currentTime = moment().format('HH:mm');
    document.getElementById('currentTime').innerHTML = currentTime;

    $("#train-table > tbody").prepend(
        "<tr><td>" + trainName +
        "</td><td>" + trainDestination +
        "</td><td>" + trainFrequency +
        "</td><td>" + firstArrivalTime.format('hh:mm a') +
        "</td><td>" + nextArrival() +
        "</td><td>" + minutesAway +
        "</td></tr>");
});

addCurrentTime = () => {
    var currentTime = moment().format('h:mm:ss a');
    document.getElementById('currentTime').innerHTML = currentTime;

}