setInterval(change_autorefreshdiv, 2000);

var patternsALL = [
    "lines normal",
    "lines thick",
    "lines big",
    "lines custom_thickness",
    "lines custom_angle",
    "lines colored",
    "lines colored_plus_bkg",
    "dots normal",
    "dots heavy ",
    "dots light",
    "dots spread",
    "dots close",
    "dots colored",
    "dots colored_with_bkg",
    "polka normal",
    "polka heavy",
    "polka light",
    "polka colored",
    "checkered normal",
    "checkered heavy",
    "checkered light",
    "checkered colored",
    "lines multiple",
    "mixed",
    "ugly",
    "blend modes",
];

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

function change_autorefreshdiv() {
    shuffle(patterns);

    var patt = document.getElementById("sky");
    var currentPattern = patt.className;

    if (patterns.length > 1) {
        var newPattern = patterns.shift();
    } else {
        var newPattern = patterns.shift();
        patterns = [...temp];
        console.log("RESET");
    }

    patt.className = newPattern;
    console.log("Old Pattern: ", currentPattern, "\tNew Pattern: ", newPattern);
    console.log("Length of delta is ", delta.length);
}
