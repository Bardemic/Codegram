const express = require("express");
const app = express();

require("express-ws")(app); // adds ws stuff to app

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.ws("/echo", function (ws, req) {
  ws.on("message", function (msg) {
    ws.send(msg);
  });
});

app.listen(9000);
console.log("server listening on http://localhost:9000");
