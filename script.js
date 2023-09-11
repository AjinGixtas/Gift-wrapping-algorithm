let canvas0 = document.getElementById("canvas0")
let canvas1 = document.getElementById("canvas1")

let points = []
let pointCount = 100
let buffer = 30
let halfWidthCanvas = 650
let halfHeightCanvas = 270
let width, height, widthContent, heightContent
let colorMultiplier = 36
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.ctx = canvas1.getContext("2d");

        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black"
        this.ctx.fill();
        this.ctx.closePath()
    }
    ChangePointColor(colorName) {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = `hsla(${360 / borderPointCount * counter}, 100%, 50%, 1)`
        this.ctx.fill();
        this.ctx.closePath()
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
let limit = 0
function SetupPoint() {
    points = []
    width = window.innerWidth
    height = window.innerHeight
    halfWidthCanvas = width / 2
    halfHeightCanvas = height / 2
    xContent = width - buffer
    yContent = height - buffer
    if (width > height) {
        limit = height - buffer * 2
    } else limit = width - buffer * 2
    canvas0.width = width
    canvas0.height = height
    canvas0.style.width = width + "px"
    canvas0.style.height = height + "px"
    canvas1.width = width
    canvas1.height = height
    canvas1.style.width = width + "px"
    canvas1.style.height = height + "px"
    canvas0.getContext('2d').clearRect(0, 0, canvas0.width, canvas0.height);
    canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height);
    for (let i = 0; i < pointCount; i++) {
        let x = randomFloat(buffer, xContent)
        let y = randomFloat(buffer, yContent)
        while ((x - halfWidthCanvas) * (x - halfWidthCanvas) + (y - halfHeightCanvas) * (y - halfHeightCanvas) > limit * limit / 4) {
            x = randomFloat(buffer, xContent)
            y = randomFloat(buffer, yContent)
        }
        points[i] = new Point(x, y)

    }
    let foo = randomInt(0, 5)
    switch (foo) {
        case 0:
            points.sort((a, b) => a.x - b.x)
            break
        case 1:
            points.sort((a, b) => a.y - b.y)
            break
        case 2:
            points.sort((a, b) => b.x - a.x)
            break
        case 3:
            points.sort((a, b) => b.y - a.y)
            break
        case 4:
            points.sort((a, b) => Math.abs(a.x) + Math.abs(a.y) - Math.abs(b.x) - Math.abs(b.y))
            break
        case 5:
            points.sort((a, b) => Math.abs(b.x) + Math.abs(b.y) - Math.abs(a.x) - Math.abs(a.y))
            break
    }
}
let borderPointCount = 0
let counter = 0

function Unknown() {
    SetupPoint()
    borderPointCount = 0
    counter = 0
    let reusePoints = [...points]

    let starterStarter = points[0]
    let candidate = points[0], length = 0
    let borderPoints = [starterStarter]
    for (let i = 0; i < points.length; i++) {
        length = zCrossProduct(getVector(borderPoints[borderPoints.length - 1], points[i]), getVector(borderPoints[borderPoints.length - 1], candidate))
        if (length <= 0) {
            candidate = points[i]
        }
    }
    borderPoints.push(candidate)
    filter(candidate, points)
    borderPointCount += 1

    while (borderPoints[borderPoints.length - 1] != borderPoints[0]) {
        if (borderPoints[borderPoints.length - 1] == borderPoints[0]) { break }
        for (let i = 0; i < points.length; i++) {
            length = zCrossProduct(getVector(borderPoints[borderPoints.length - 1], points[i]), getVector(borderPoints[borderPoints.length - 1], candidate))
            if (length <= 0) {
                candidate = points[i]
            }
        }
        borderPoints.push(candidate)
        filter(candidate, points)
        borderPointCount += 1
    }
    //
    //
    //
    points = reusePoints
    starterStarter = points[0]
    candidate = points[0], length = 0
    borderPoints = [starterStarter]

    for (let i = 0; i < points.length; i++) {
        length = zCrossProduct(getVector(borderPoints[borderPoints.length - 1], points[i]), getVector(borderPoints[borderPoints.length - 1], candidate))
        if (length <= 0) {
            candidate = points[i]
            DrawEvalLinearGradientLine(new Vector(candidate.x, candidate.y),
                new Vector(borderPoints[borderPoints.length - 1].x, borderPoints[borderPoints.length - 1].y),
                1, canvas0)
        }
    }
    DrawResultLine(new Vector(candidate.x, candidate.y),
        new Vector(borderPoints[borderPoints.length - 1].x, borderPoints[borderPoints.length - 1].y), 1, canvas0)
    borderPoints[borderPoints.length - 1].ChangePointColor("red")
    counter++
    borderPoints.push(candidate)
    filter(candidate, points)

    while (borderPoints[borderPoints.length - 1] != borderPoints[0]) {
        borderPoints[borderPoints.length - 1].ChangePointColor("red")
        for (let i = 0; i < points.length; i++) {
            length = zCrossProduct(getVector(borderPoints[borderPoints.length - 1], points[i]), getVector(borderPoints[borderPoints.length - 1], candidate))
            if (length <= 0) {
                candidate = points[i]

                DrawEvalLinearGradientLine(new Vector(candidate.x, candidate.y),
                    new Vector(borderPoints[borderPoints.length - 1].x, borderPoints[borderPoints.length - 1].y),
                    1, canvas0)
            }
        }
        DrawResultLine(new Vector(candidate.x, candidate.y),
            new Vector(borderPoints[borderPoints.length - 1].x, borderPoints[borderPoints.length - 1].y), 1, canvas0)
        counter++
        borderPoints.push(candidate)
        filter(candidate, points)
    }
}
Unknown()
function DrawEvalLinearGradientLine(pos_a, pos_b, size, canvas) {
    let ctx = canvas.getContext("2d");
    let grd = ctx.createLinearGradient(pos_a.x, pos_a.y, pos_b.x, pos_b.y)
    grd.addColorStop(0, `hsla(${360 / borderPointCount * counter}, 100%, 50%, 0)`)
    grd.addColorStop(1, `hsla(${360 / borderPointCount * counter}, 100%, 50%, 0.25)`)
    ctx.strokeStyle = grd
    ctx.beginPath()
    ctx.moveTo(pos_a.x, pos_a.y)
    ctx.lineTo(pos_b.x, pos_b.y)
    ctx.lineWidth = size
    ctx.stroke()
}
function DrawResultLine(pos_a, pos_b, size, canvas) {
    let ctx = canvas.getContext("2d");
    let grd = ctx.createLinearGradient(pos_a.x, pos_a.y, pos_b.x, pos_b.y)
    grd.addColorStop(0, `hsla(${360 / borderPointCount * (counter + 1)}, 100%, 50%, 1)`)
    grd.addColorStop(1, `hsla(${360 / borderPointCount * counter}, 100%, 50%, 1)`)
    ctx.strokeStyle = grd
    ctx.beginPath()
    ctx.moveTo(pos_a.x, pos_a.y)
    ctx.lineTo(pos_b.x, pos_b.y)
    ctx.lineWidth = size
    ctx.stroke()
}
function WipeCanvas(canvasToWipe) {
    const context = canvasToWipe.getContext('2d');
    context.clearRect(0, 0, canvasToWipe.width, canvasToWipe.height);
}
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y
}
function zCrossProduct(a, b) {
    return a.x * b.y - a.y * b.x
}
function filter(element, array) {
    let index = array.indexOf(element);
    if (index != -1) { array.splice(index, 1); }
}
function getVector(a, b) {
    return new Vector(b.x - a.x, b.y - a.y)
}
document.getElementById('foo').addEventListener('click', function (e) {
    Unknown()
});
document.getElementById('inputPointCount').value = 100
document.getElementById('inputPointCount').oninput = (() => pointCount = Number(document.getElementById('inputPointCount').value))