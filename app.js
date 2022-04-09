const express = require('express');
const socket = require('socket.io');

let app = express();


app.use(express.static("public"));

let port = 5000;
let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log(`Made connection`);

    socket.on("beginPath", (data) => {
        //transfer to all connected devices
  
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawPath", (data) => {

        io.sockets.emit("drawPath", data);
    });

    socket.on("chooseColor", (color) => {
 
        io.sockets.emit("chooseColor", color);
    });

    socket.on("setLineWidth", (width) => {
        io.sockets.emit("setLineWidth", width);
    });

    socket.on("undoRedo", (data) => {
        
        io.sockets.emit("undoRedo", data);
    });
});

//node app.js = to launch the app server

