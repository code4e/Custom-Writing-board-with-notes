let canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 3;
let isMousePressed = false;
let drawCanvas = false;
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let pencilColorCont = pencilToolCont.querySelector(".pencil-color-cont");
let eraser = document.querySelector(".eraser");
let downloadBtn = document.querySelector(".download");
let undoBtn = document.querySelector(".undo");
let redoBtn = document.querySelector(".redo");
let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array


let eraserToolCont = document.querySelector(".eraser-tool-cont");
let eraserWidthCont = eraserToolCont.querySelector("input");
pencilColorCont.addEventListener("click", function (event) {
    let color = event.target;
    let classArr = Array.from(color.classList);
    socket.emit("chooseColor", classArr[0]);
    // colorPicker(color);
});

eraser.addEventListener("click", function (event) {
    let color = event.target;
    let classArr = Array.from(color.classList);
    console.log(classArr[0]);
    socket.emit("chooseColor", classArr[0]);
    // colorPicker(color);
});
eraserWidthCont.addEventListener("change", function (event) {

    socket.emit("setLineWidth", parseInt(this.value));
    // setLineWidth(parseInt(this.value));
});
downloadBtn.addEventListener("click", function (event) {
    canvasURL = canvas.toDataURL();
    console.log(canvasURL);

    let aTag = document.createElement("a");
    aTag.setAttribute("href", canvasURL);
    aTag.setAttribute("download", "board.jpg");

    aTag.click();
});

undoBtn.addEventListener("click", (e) => {
    if (track >= 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("undoRedo", data);
    // renderCurrentState(data);

})

redoBtn.addEventListener("click", function () {
    if (track < undoRedoTracker.length - 1) {
        track++;

    }
    let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("undoRedo", data);
    // renderCurrentState(data);
});

function renderCurrentState(trackerObj) {

    let track = trackerObj.trackValue;
    let undoRedoTracker = trackerObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let image = new Image();
    if (url != undefined) {
        image.src = url;
        image.onload = (e) => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }


}




let pencilWidthCont = pencilToolCont.querySelector(".pencil-width-cont");
let pencilWidthInput = pencilWidthCont.querySelector("input");
pencilWidthInput.addEventListener("change", function (event) {

    // setLineWidth(parseInt(this.value));
    socket.emit("setLineWidth", parseInt(this.value));
    
});

setLineWidth = (width) => ctx.lineWidth = width; 


// pencil stroking, eraser stroke
canvas.addEventListener("mousedown", function (event) {
    if (drawCanvas) {
        isMousePressed = true;
        let strokeObj = {
            x : event.clientX,
            y : event.clientY
        };

        // pathBegin(strokeObj);

        socket.emit("beginPath", strokeObj);
    }
});
canvas.addEventListener("mousemove", function (event) {
    if (isMousePressed == true) {
        let strokeObj = {
            x : event.clientX,
            y : event.clientY
        };
        // draw(strokeObj);
        socket.emit("drawPath", strokeObj);
    }

});
canvas.addEventListener("mouseup", function () {
    isMousePressed = false;



    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

function pathBegin(strokeObj) {
    ctx.beginPath();
    ctx.moveTo(strokeObj.x, strokeObj.y);
}
function draw(strokeObj) {
    ctx.lineTo(strokeObj.x, strokeObj.y);
    ctx.stroke();
}
function colorPicker(color) {
    if (color === "black") {
        ctx.strokeStyle = "black";
    }
    else if (color === "green") {
        ctx.strokeStyle = "green";
    }
    else if (color === "red") {
        ctx.strokeStyle = "red";
    }
    else {
        ctx.strokeStyle = "white";
    }
}

socket.on("beginPath", (data) => {
    pathBegin(data);
});

socket.on("drawPath", (data) => {
    draw(data);
});

socket.on("chooseColor", (color) => {
    colorPicker(color);
});

socket.on("setLineWidth", (width) => {
    setLineWidth(width);
});

socket.on("undoRedo", (trackerObj) => {
    
    renderCurrentState(trackerObj);
});

