const express = require("express");
const app = express();

require("express-ws")(app); // adds ws stuff to app

const users = {};

function serializeUser({ role, username }) {
  return { role, username };
}

app.ws("/connect", function (ws, req) {
  let user = null;

  ws.on("close", () => {
    if (user) {
      user.connection = null;
      if (user.peer) {
        // TODO: Send person left message to peer.
      }
    }
  });

  ws.on("message", function (msg) {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (err) {
      console.error({ msg, err });
    }

    if (typeof data !== "object") {
      ws.send(
        JSON.stringify({ type: "error", message: "Message is not an object." })
      );
      return;
    }

    if (data.type === "signup") {
      const { role, username, passwordHash } = data;

      if (
        (role !== "tutor" && role !== "student") ||
        typeof username !== "string" ||
        typeof passwordHash !== "string"
      ) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid user data." })
        );
        return;
      }

      if (username in users) {
        ws.send(JSON.stringify({ type: "error", message: "Username taken." }));
        return;
      }

      user = users[username] = {
        role,
        username,
        passwordHash,
      };
      ws.send(JSON.stringify({ type: "success", user: serializeUser(user) }));
    } else if (data.type === "login") {
      const { username, passwordHash } = data;

      if (
        !(username in users) ||
        users[username].passwordHash !== passwordHash
      ) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown username/password combination.",
          })
        );
        return;
      }
      user = users[username];
      ws.send(JSON.stringify({ type: "success", user: serializeUser(user) }));
    }
  });
});

app.listen(9000);
console.log("server listening on http://localhost:9000");
