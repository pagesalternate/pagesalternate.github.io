var $ = {
    canvas: null,
    ctx: null,
    canvas2: null,
    ctx2: null,
    colors: {
        sky: "#D4F5FE",
        ground: "#8FC04C",
        groundDark: "#73B043",
        road: "#606a7c",
        roadLine: "#FFF",
    },
    settings: {
        fps: 120,
        skySize: 00,
        ground: {
            size: 200,
            min: 4,
            max: 120,
        },
        road: {
            min: 76,
            max: 700,
        },
    },
    state: {
        bgpos: 0,
        offset: 0,
        startDark: true,
        curve: 0,
        currentCurve: 0,
        speed: 30,
        xpos: 0,
        section: 50,
        car: {
            maxSpeed: 30,
        },
    },
    storage: {
        bg: null,
    },
};
$.canvas = document.getElementsByTagName("canvas")[0];
$.ctx = $.canvas.getContext("2d");
$.canvas2 = document.createElement("canvas");
$.canvas2.width = $.canvas.width;
$.canvas2.height = $.canvas.height;
$.ctx2 = $.canvas2.getContext("2d");

drawBg();
draw();

function draw() {
    setTimeout(function () {
        //if($.state.speed > 0) {
        $.state.bgpos += $.state.currentCurve * 0.02 * ($.state.speed * 0.2);
        $.state.bgpos = $.state.bgpos % $.canvas.width;

        $.ctx.putImageData($.storage.bg, $.state.bgpos, 5);
        $.ctx.putImageData(
            $.storage.bg,
            $.state.bgpos > 0
                ? $.state.bgpos - $.canvas.width
                : $.state.bgpos + $.canvas.width,
            5
        );
        //}

        $.state.offset += $.state.speed * 0.05;
        if ($.state.offset > $.settings.ground.min) {
            $.state.offset = $.settings.ground.min - $.state.offset;
            $.state.startDark = !$.state.startDark;
        }
        drawGround(
            $.ctx,
            $.state.offset,
            $.colors.ground,
            $.colors.groundDark,
            $.canvas.width
        );
        // sidelines
        drawRoad(
            $.settings.road.min + 6,
            $.settings.road.max + 36,
            10,
            $.colors.roadLine
        );
        drawGround(
            $.ctx2,
            $.state.offset,
            $.colors.roadLine,
            $.colors.road,
            $.canvas.width
        );
        drawRoad($.settings.road.min, $.settings.road.max, 10, $.colors.road); //full road
        drawRoad(3, 24, 0, $.ctx.createPattern($.canvas2, "")); //middle line

        requestAnimationFrame(draw);
    }, 1000 / $.settings.fps);
}

function norm(value, min, max) {
    return (value - min) / (max - min);
}

function drawBg() {
    $.storage.bg = $.ctx.getImageData(0, 0, $.canvas.width, $.canvas.height);
}

function drawRoad(min, max, squishFactor, color) {
    var basePos = $.canvas.width + $.state.xpos;
    // console.log($.state.xpos.toFixed(2), "---------");

    $.ctx.fillStyle = color;
    $.ctx.beginPath();
    $.ctx.moveTo(
        (basePos + min) / 2 - $.state.currentCurve * 3,
        $.settings.skySize
    );

    $.ctx.quadraticCurveTo(
        basePos / 2 + min + $.state.currentCurve / 3 + squishFactor,
        $.settings.skySize + 52,
        (basePos + max) / 2,
        $.canvas.height
    );

    $.ctx.lineTo((basePos - max) / 2, $.canvas.height);
    $.ctx.quadraticCurveTo(
        basePos / 2 - min + $.state.currentCurve / 3 - squishFactor,
        $.settings.skySize + 52,
        (basePos - min) / 2 - $.state.currentCurve * 3,
        $.settings.skySize
    );
    $.ctx.closePath();
    $.ctx.fill();
}

function drawGround(ctx, offset, lightColor, darkColor, width) {
    var pos = $.settings.skySize - $.settings.ground.min + offset,
        stepSize = 1,
        drawDark = $.state.startDark,
        firstRow = true;
    ctx.fillStyle = lightColor;
    ctx.fillRect(0, $.settings.skySize, width, $.settings.ground.size);

    ctx.fillStyle = darkColor;
    while (pos <= $.canvas.height) {
        stepSize =
            norm(pos, $.settings.skySize, $.canvas.height) *
            $.settings.ground.max;
        if (stepSize < $.settings.ground.min) {
            stepSize = $.settings.ground.min;
        }

        if (drawDark) {
            if (firstRow) {
                ctx.fillRect(
                    0,
                    $.settings.skySize,
                    width,
                    stepSize -
                        (offset > $.settings.ground.min
                            ? $.settings.ground.min
                            : $.settings.ground.min - offset)
                );
            } else {
                ctx.fillRect(
                    0,
                    pos < $.settings.skySize ? $.settings.skySize : pos,
                    width,
                    stepSize
                );
            }
        }

        firstRow = false;
        pos += stepSize;
        drawDark = !drawDark;
    }
}
// ======================================================================================
