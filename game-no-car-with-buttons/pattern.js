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

var temp = [...patterns];
var patt = document.getElementById("sky");

var startTime;
var timeoutId;
var elapsedTime = 0;

var change = true;
var all = false;
var newPattern;

var result = [];
var db = "no-car-with-buttons";
console.log("started");

function updateSky() {
    shuffle(patterns);

    if (patterns.length > 0) {
        newPattern = patterns.shift();
    }

    patt.className = newPattern;
    if (newPattern != undefined) {
        // console.log("New Pattern: ", newPattern);
    }
}

function start() {
    if (change) {
        updateSky();
        change = false;

        elapsedTime = 0;
        startTime = Date.now();
        countUp();
    }
    if (patterns.length < 1) {
        console.log("All Patterns done");
        all = true;
    }
}

function stop() {
    // console.log("Pattern stopped");
    patt.className = "";
    change = true;

    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
    elapsedTime = (elapsedTime / 1000).toFixed(2);

    result.push([newPattern, elapsedTime]);
    if (all) {
        console.log("close window");

        jsonify(result);
        // readDB(db);
        writeUserData2(result);

        setTimeout(() => {
            window.close();
        }, 2000);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function countUp() {
    timeoutId = setTimeout(() => {
        countUp();
    }, 10);
}

function jsonify(result) {
    var json = '{"result":{}}';
    var obj = JSON.parse(json);

    result.forEach((element) => {
        var newuser = element[0];
        obj.result[newuser] = element[1];
    });
    console.log(obj);
    writeUserData2(obj);
}
