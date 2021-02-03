setInterval(change_autorefreshdiv, 1000);

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
var i = 0;

var ip;
json(`https://api.ipify.org?format=json`).then((data) => {
    console.log(data.ip);
    ip = data.ip;
});

var dbname = "with-car";

function change_autorefreshdiv() {
    shuffle(patterns);

    var patt = document.getElementById("sky");

    if (patterns.length > 0) {
        var newPattern = patterns.shift();
    } else {
        if (i == 0) {
            i = 1;

            writeUserData(dbname, ip, delta);
            readDB(dbname);

            setTimeout(() => {
                console.log("Window Closed!");
                window.close();
            }, 2000);
        }
    }

    patt.className = newPattern;
    console.log("New Pattern: ", newPattern);
}

function json(url) {
    return fetch(url).then((res) => res.json());
}
