var patterns = [
    "dots normal",
    "polka normal",
    "lines horizontal",
    "lines vertical",
    "lines plus",
    "lines cross",
    "lines left",
    "lines right",
    "dots heavy",
    "triangles",
    "planes",
];

shuffle(patterns);
getTime();
setInterval(change_autorefreshdiv, 20000);

var temp = [...patterns];
var i = 0;
var datetime;
var db = "no-car-no-buttons";

function change_autorefreshdiv() {
    var patt = document.getElementById("sky");

    if (patterns.length > 0) {
        var newPattern = patterns.shift();
    } else {
        if (i == 0) {
            i = 1;
            console.log(temp);
            // readDB(db);
            var pattern = temp;
            writeUserData(db, datetime, pattern);
            window.close();
        }
    }

    patt.className = newPattern;
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
function getTime() {
    var currentdate = new Date();
    datetime =
        "Game started on: " +
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds() +
        " in " +
        seconds_with_leading_zeros(currentdate);
    console.log(datetime);
}
function seconds_with_leading_zeros(dt) {
    return /\((.*)\)/.exec(dt.toString())[1];
}
