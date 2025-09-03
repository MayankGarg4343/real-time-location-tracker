// this is how we used to set up the code for the express.
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

// this is how we used to set up the code for the socket.io
const socket = require("socket.io"); // socket.io usually works on the http servers.
const server = http.createServer(app);
const io = socket(server);

// setting up the ejs. and other static files.
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnected", function(){
     io.emit("user-disconnected",socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});
server.listen(3000);
