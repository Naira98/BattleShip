const http = require("http");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
