let ws;

function init() {
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket("ws://localhost:8088");
    ws.onopen = () => {
        console.log("WS connection opened!");
    };
    ws.onmessage = ({ data }) => {
        data = JSON.parse(data);
        if (data.type === "draw") {
            drawFromDistantClient(data);
        }
    };
    ws.onclose = function () {
        console.log("WS connection closed");
        ws = null;
    };
}
init();

// CANVAS STUFF
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let coord = { x: 0, y: 0 };

document.addEventListener("mousedown", start);
document.addEventListener("mouseup", stop);
window.addEventListener("resize", resize);

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}
resize();

function start(event) {
    document.addEventListener("mousemove", draw);
    reposition(event);
}

function stop() {
    document.removeEventListener("mousemove", draw);
}

function reposition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
}

function draw(event, color, distantDrawing) {
    color = color ? color : "#444";
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(coord.x, coord.y);
    reposition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();

    if (distantDrawing) {
        return;
    }
    sendDrawingMessage("draw");
}

function sendDrawingMessage(type) {
    if (type === "draw") {
        const message = JSON.stringify({ type: type, x: coord.x, y: coord.y });
        ws.send(message);
    }
}

function drawFromDistantClient(data) {
    let event = {};
    event.clientX = data.x;
    event.clientY = data.y;
    draw(event, "blue", true);
}
