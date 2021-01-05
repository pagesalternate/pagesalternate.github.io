var $ = {
    canvas: null,
    ctx: null,
    canvas2: null,
    ctx2: null,
    colors: {
        sky: "#D4F5FE",
        mountains: "#000",
        // mountains: "#83CACE",

        ground: "#8FC04C",
        groundDark: "#73B043",
        road: "#606a7c",
        roadLine: "#FFF",
        hud: "#FFF",
        circle: "#000",
        randomCircle: "#ff0000",
    },
    settings: {
        fps: 60,
        skySize: 200,
        ground: {
            size: 350,
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
        turn: 1,
        speed: 27,
        xpos: 0,
        section: 50,
        car: {
            maxSpeed: 70,
            friction: 0.4,
            acc: 0.85,
            deAcc: 0.5,
        },
        keypress: {
            up: false,
            left: false,
            right: false,
            down: false,
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
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

drawBg();
draw();

function draw() {
    setTimeout(function () {
        calcMovement();

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
        drawRoad($.settings.road.min, $.settings.road.max, 10, $.colors.road);
        drawRoad(3, 24, 0, $.ctx.createPattern($.canvas2, "repeat"));
        drawCar();
        drawHUD($.ctx, 630, 340, $.colors.hud);

        requestAnimationFrame(draw);
    }, 1000 / $.settings.fps);
}

function drawHUD(ctx, centerX, centerY, color) {
    var radius = 50,
        tigs = [0, 90, 135, 180, 225, 270, 315],
        angle = 90;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 7;
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();

    for (var i = 0; i < tigs.length; i++) {
        drawTig(ctx, centerX, centerY, radius, tigs[i], 7);
    }

    // draw pointer
    angle = map($.state.speed, 0, $.state.car.maxSpeed, 90, 360);
    drawPointer(ctx, color, 50, centerX, centerY, angle);
}

function drawPointer(ctx, color, radius, centerX, centerY, angle) {
    var point = getCirclePoint(centerX, centerY, radius - 20, angle),
        point2 = getCirclePoint(centerX, centerY, 2, angle + 90),
        point3 = getCirclePoint(centerX, centerY, 2, angle - 90);

    ctx.beginPath();
    ctx.strokeStyle = "#FF9166";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.moveTo(point2.x, point2.y);
    ctx.lineTo(point.x, point.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 9, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawTig(ctx, x, y, radius, angle, size) {
    var startPoint = getCirclePoint(x, y, radius - 4, angle),
        endPoint = getCirclePoint(x, y, radius - size, angle);

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}

function getCirclePoint(x, y, radius, angle) {
    var radian = (angle / 180) * Math.PI;

    return {
        x: x + radius * Math.cos(radian),
        y: y + radius * Math.sin(radian),
    };
}

function calcMovement() {
    var move = $.state.speed * 0.01,
        newCurve = 0;

    if ($.state.keypress.up) {
        $.state.speed += $.state.car.acc - $.state.speed * 0.015;
    } else if ($.state.speed > 0) {
        $.state.speed -= $.state.car.friction;
    }

    if ($.state.keypress.down && $.state.speed > 0) {
        $.state.speed -= 1;
    }

    // Left and right
    $.state.xpos -= $.state.currentCurve * $.state.speed * 0.005;

    if ($.state.speed) {
        if ($.state.keypress.left) {
            $.state.xpos +=
                (Math.abs($.state.turn) +
                    7 +
                    ($.state.speed > $.state.car.maxSpeed / 4
                        ? $.state.car.maxSpeed - $.state.speed / 2
                        : $.state.speed)) *
                0.2;
            $.state.turn -= 1;
        }

        if ($.state.keypress.right) {
            $.state.xpos -=
                (Math.abs($.state.turn) +
                    7 +
                    ($.state.speed > $.state.car.maxSpeed / 4
                        ? $.state.car.maxSpeed - $.state.speed / 2
                        : $.state.speed)) *
                0.2;
            $.state.turn += 1;
        }

        if (
            $.state.turn !== 0 &&
            !$.state.keypress.left &&
            !$.state.keypress.right
        ) {
            $.state.turn += $.state.turn > 0 ? -0.25 : 0.25;
        }
    }

    $.state.turn = clamp($.state.turn, -5, 5);
    $.state.speed = clamp($.state.speed, 0, $.state.car.maxSpeed);

    // section
    $.state.section -= $.state.speed;

    if ($.state.section < 0) {
        $.state.section = randomRange(1000, 9000);

        newCurve = randomRange(-50, 50);

        if (Math.abs($.state.curve - newCurve) < 20) {
            newCurve = randomRange(-50, 50);
        }

        $.state.curve = newCurve;
    }

    if (
        $.state.currentCurve < $.state.curve &&
        move < Math.abs($.state.currentCurve - $.state.curve)
    ) {
        $.state.currentCurve += move;
    } else if (
        $.state.currentCurve > $.state.curve &&
        move < Math.abs($.state.currentCurve - $.state.curve)
    ) {
        $.state.currentCurve -= move;
    }

    if (Math.abs($.state.xpos) > 550) {
        $.state.speed *= 0.96;
    }

    $.state.xpos = clamp($.state.xpos, -650, 650);
}

function keyUp(e) {
    move(e, false);
}

function keyDown(e) {
    move(e, true);
}

function move(e, isKeyDown) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
    }

    if (e.keyCode === 37) {
        $.state.keypress.left = isKeyDown;
    }

    if (e.keyCode === 38) {
        $.state.keypress.up = isKeyDown;
    }

    if (e.keyCode === 39) {
        $.state.keypress.right = isKeyDown;
    }

    if (e.keyCode === 40) {
        $.state.keypress.down = isKeyDown;
    }
}

function norm(value, min, max) {
    return (value - min) / (max - min);
}

function lerp(norm, min, max) {
    return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
    return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function drawBg() {
    $.ctx.fillStyle = $.colors.sky;
    $.ctx.fillRect(0, 0, $.canvas.width, $.settings.skySize);
    // drawMountain(0, 60, 200);
    // drawMountain(280, 40, 200);
    // drawMountain(400, 80, 200);
    // drawMountain(550, 60, 200);

    // drawCircles(110);
    drawDots(192);
    // drawRandomCircles(110);
    // drawLinesNE(113);
    // drawLinesNW(113);

    // drawLinesNS(113);
    // drawLinesEW();

    // drawTriangles();
    // drawPlanes();
    $.storage.bg = $.ctx.getImageData(0, 0, $.canvas.width, $.canvas.height);
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawMountain(pos, height, width) {
    $.ctx.fillStyle = $.colors.circle;
    $.ctx.strokeStyle = $.colors.circle;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 5;

    // $.ctx.moveTo(pos, $.settings.skySize);
    // $.ctx.lineTo(pos + (width / 2), $.settings.skySize - height);
    // $.ctx.lineTo(pos + width, $.settings.skySize);
}

function drawSky() {
    $.ctx.fillStyle = $.colors.sky;
    $.ctx.fillRect(0, 0, $.canvas.width, $.settings.skySize);
}

function drawRoad(min, max, squishFactor, color) {
    var basePos = $.canvas.width + $.state.xpos;

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

function drawCar() {
    var carWidth = 160,
        carHeight = 50,
        carX = $.canvas.width / 2 - carWidth / 2,
        carY = 320;

    // shadow
    roundedRect(
        $.ctx,
        "rgba(0, 0, 0, 0.35)",
        carX - 1 + $.state.turn,
        carY + (carHeight - 35),
        carWidth + 10,
        carHeight,
        9
    );

    // tires
    roundedRect($.ctx, "#111", carX, carY + (carHeight - 30), 30, 40, 6);
    roundedRect(
        $.ctx,
        "#111",
        carX - 22 + carWidth,
        carY + (carHeight - 30),
        30,
        40,
        6
    );

    drawCarBody($.ctx);
}

function drawCarBody(ctx) {
    var startX = 299,
        startY = 311,
        lights = [10, 26, 134, 152],
        lightsY = 0;

    /* Front */
    roundedRect(
        $.ctx,
        "#C2C2C2",
        startX + 6 + $.state.turn * 1.1,
        startY - 18,
        146,
        40,
        18
    );

    ctx.beginPath();
    ctx.lineWidth = "12";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.moveTo(startX + 30, startY);
    ctx.lineTo(startX + 46 + $.state.turn, startY - 25);
    ctx.lineTo(startX + 114 + $.state.turn, startY - 25);
    ctx.lineTo(startX + 130, startY);
    ctx.fill();
    ctx.stroke();
    /* END: Front */

    ctx.lineWidth = "12";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.fillStyle = "#DEE0E2";
    ctx.strokeStyle = "#DEE0E2";
    ctx.moveTo(startX + 2, startY + 12 + $.state.turn * 0.2);
    ctx.lineTo(startX + 159, startY + 12 + $.state.turn * 0.2);
    ctx.quadraticCurveTo(
        startX + 166,
        startY + 35,
        startX + 159,
        startY + 55 + $.state.turn * 0.2
    );
    ctx.lineTo(startX + 2, startY + 55 - $.state.turn * 0.2);
    ctx.quadraticCurveTo(
        startX - 5,
        startY + 32,
        startX + 2,
        startY + 12 - $.state.turn * 0.2
    );
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = "12";
    ctx.fillStyle = "#DEE0E2";
    ctx.strokeStyle = "#DEE0E2";
    ctx.moveTo(startX + 30, startY);
    ctx.lineTo(startX + 40 + $.state.turn * 0.7, startY - 15);
    ctx.lineTo(startX + 120 + $.state.turn * 0.7, startY - 15);
    ctx.lineTo(startX + 130, startY);
    ctx.fill();
    ctx.stroke();

    roundedRect(ctx, "#474747", startX - 4, startY, 169, 10, 3, true, 0.2);
    roundedRect(ctx, "#474747", startX + 40, startY + 5, 80, 10, 5, true, 0.1);

    ctx.fillStyle = "#FF9166";

    lights.forEach(function (xPos) {
        ctx.beginPath();
        ctx.arc(startX + xPos, startY + 20 + lightsY, 6, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        lightsY += $.state.turn * 0.05;
    });

    ctx.lineWidth = "9";
    ctx.fillStyle = "#222222";
    ctx.strokeStyle = "#444";

    roundedRect($.ctx, "#FFF", startX + 60, startY + 25, 40, 18, 3, true, 0.05);
}

function roundedRect(
    ctx,
    color,
    x,
    y,
    width,
    height,
    radius,
    turn,
    turneffect
) {
    var skew = turn === true ? $.state.turn * turneffect : 0;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y - skew);

    // top right
    ctx.lineTo(x + width - radius, y + skew);
    ctx.arcTo(x + width, y + skew, x + width, y + radius + skew, radius);
    ctx.lineTo(x + width, y + radius + skew);

    // down right
    ctx.lineTo(x + width, y + height + skew - radius);
    ctx.arcTo(
        x + width,
        y + height + skew,
        x + width - radius,
        y + height + skew,
        radius
    );
    ctx.lineTo(x + width - radius, y + height + skew);

    // down left
    ctx.lineTo(x + radius, y + height - skew);
    ctx.arcTo(x, y + height - skew, x, y + height - skew - radius, radius);
    ctx.lineTo(x, y + height - skew - radius);

    // top left
    ctx.lineTo(x, y + radius - skew);
    ctx.arcTo(x, y - skew, x + radius, y - skew, radius);
    ctx.lineTo(x + radius, y - skew);
    ctx.fill();
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

function drawCircles(height) {
    $.ctx.fillStyle = $.colors.circle;
    $.ctx.strokeStyle = $.colors.circle;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 5;

    // Pattern of Circles
    for (var i = 0; i < 50; i++) {
        for (var j = 0; j < 6; j++) {
            $.ctx.beginPath();
            $.ctx.arc(
                6 + 15 * i,
                $.settings.skySize - height + j * 20,
                2,
                0,
                2 * Math.PI,
                false
            );
            $.ctx.closePath();
            $.ctx.stroke();
            $.ctx.fill();
        }
    }
}

function drawDots(height) {
    $.ctx.fillStyle = $.colors.circle;
    $.ctx.strokeStyle = $.colors.circle;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 1;

    // Pattern of Circles
    for (var i = 0; i < 75; i++) {
        for (var j = 0; j < 19; j++) {
            $.ctx.beginPath();
            $.ctx.arc(
                6 + 10 * i,
                $.settings.skySize - height + j * 10,
                2,
                0,
                2 * Math.PI,
                false
            );
            $.ctx.closePath();
            $.ctx.stroke();
            $.ctx.fill();
        }
    }
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}
function drawRandomCircles(height) {
    $.ctx.fillStyle = $.colors.circle;
    $.ctx.strokeStyle = $.colors.circle;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 1;

    for (var i = 0; i < 600; i++) {
        $.ctx.beginPath();
        $.ctx.arc(
            6 + 10 * randomNumber(0, 50),
            $.settings.skySize - height + randomNumber(0, 100),
            2,
            0,
            2 * Math.PI,
            false
        );
        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}

function drawLinesNE(height) {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 3;

    srcX = 0;

    for (var i = 1; i <= 37; i++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, $.settings.skySize);
        $.ctx.lineTo(srcX + 100, $.settings.skySize - height);

        srcX = i * 20;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }

    srcX = 0;
    for (var i = 1; i <= 4; i++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, $.settings.skySize - 33);
        $.ctx.lineTo(srcX + 71, $.settings.skySize - height);

        srcX = -i * 20;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}

function drawLinesNW(height) {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 3;

    srcX = 0;

    for (var i = 1; i <= 37; i++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, $.settings.skySize - height);
        $.ctx.lineTo(srcX + 100, $.settings.skySize);

        srcX = i * 20;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }

    srcX = 0;
    for (var i = 1; i <= 4; i++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, $.settings.skySize - 80);
        $.ctx.lineTo(srcX + 71, $.settings.skySize);

        srcX = -i * 20;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}

function drawLinesNS(height) {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 1;

    srcX = 0;

    for (var i = 0; i <= 76; i++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, $.settings.skySize);
        $.ctx.lineTo(srcX, $.settings.skySize - height);

        srcX = i * 10;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}

function drawLinesEW() {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 1;

    srcX = 0;

    for (var i = 0; i <= 11; i++) {
        $.ctx.beginPath();
        y = $.settings.skySize - 10 * i;

        $.ctx.moveTo(srcX, y);
        $.ctx.lineTo(srcX + $.canvas.width, y);

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}

function rowOfTriangles(srcX, lvl) {
    for (var j = 1; j <= 18; j++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, lvl);
        $.ctx.lineTo(srcX + 20, lvl - 20);
        $.ctx.lineTo(srcX + 40, lvl);
        $.ctx.lineTo(srcX, lvl);

        srcX = srcX + 44;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}
function drawTriangles() {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 5;

    srcX = 4;
    lvl = $.settings.skySize - 9;

    for (var j = 0; j < 4; j++) {
        rowOfTriangles(srcX, lvl);
        lvl -= 28;
    }
}

function rowOfRevTriangles(srcX, lvl) {
    for (var j = 1; j <= 18; j++) {
        $.ctx.beginPath();
        $.ctx.moveTo(srcX, lvl - 20);
        $.ctx.lineTo(srcX + 20, lvl);
        $.ctx.lineTo(srcX + 40, lvl - 20);

        srcX = srcX + 44;

        $.ctx.closePath();
        $.ctx.stroke();
        $.ctx.fill();
    }
}
function drawPlanes() {
    $.ctx.fillStyle = $.colors.mountains;
    $.ctx.strokeStyle = $.colors.mountains;
    $.ctx.lineJoin = "round";
    $.ctx.lineWidth = 5;

    srcX = 4;
    lvl = $.settings.skySize - 5;

    for (var j = 0; j < 2; j++) {
        lvl -= 28;
        rowOfTriangles(srcX, lvl);
        lvl -= 28;
    }

    srcX = 4;
    lvl = $.settings.skySize - 9;

    for (var j = 0; j < 2; j++) {
        rowOfRevTriangles(srcX, lvl);
        lvl -= 56;
    }
}
