const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");

require("express-ws")(app); // adds ws stuff to app

const users = {};

const waitingSessions = {};

function serializeUser({ role, username, dateCreated }) {
  return { role, username, dateCreated: dateCreated.toISOString() };
}

app.ws("/connect", function (ws, req) {
  let user = null;
  let peerConnection = null;

  ws.on("close", () => {
    if (user) {
      user.connection = null;
      if (peerConnection) {
        peerConnection.send({ type: "peerleft" });
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
        username === "__proto__" ||
        typeof passwordHash !== "string"
      ) {
        ws.send(
          JSON.stringify({ type: "signup-error", message: "Invalid data." })
        );
        return;
      }

      if (username in users) {
        ws.send(
          JSON.stringify({ type: "signup-error", message: "Username taken." })
        );
        return;
      }

      user = users[username] = {
        role,
        username,
        passwordHash,
        dateCreated: new Date(),
      };
      ws.send(
        JSON.stringify({ type: "signup-success", user: serializeUser(user) })
      );
    } else if (data.type === "login") {
      const { username, passwordHash } = data;

      if (
        !(username in users) ||
        users[username].passwordHash !== passwordHash
      ) {
        ws.send(
          JSON.stringify({
            type: "login-error",
            message: "Unknown username/password combination.",
          })
        );
        return;
      }
      user = users[username];
      ws.send(
        JSON.stringify({ type: "login-success", user: serializeUser(user) })
      );
    } else if (data.type === "getuser") {
      const { username } = data;
      if (typeof username !== "string") {
        ws.send(
          JSON.stringify({ type: "getuser-error", message: "Invalid data." })
        );
        return;
      }
      if (!(username in users)) {
        ws.send(
          JSON.stringify({ type: "getuser-error", message: "User not found." })
        );
        return;
      }
      ws.send(
        JSON.stringify({
          type: "getuser-success",
          user: serializeUser(users[username]),
        })
      );
    } else if (data.type === "createsession") {
      waitingSessions[uuid()] = {
        user,
        ws,
      };
    } else if (data.type === "joinsession") {
      const { sessionId } = data;
      if (typeof sessionId !== "string" || !(sessionId in waitingSessions)) {
        ws.send(
          JSON.stringify({
            type: "joinsession-error",
            message: "Invalid session data.",
          })
        );
        return;
      }

      const { ws: peerWs, user: peerUser } = waitingSessions[sessionId];
      waitingSessions[sessionId] = undefined;

      peerWs.send(
        JSON.stringify({ type: "tutorjoined", user: serializeUser(user) })
      );
      ws.send(
        JSON.stringify({
          type: "joinsession-success",
          user: serializeUser(peerUser),
        })
      );
    } else if (data.type === "getsessions") {
      ws.send(
        JSON.stringify({
          type: "getsessions-success",
          sessions: Object.entries(sessions).map(([k, { user: peerUser }]) => [
            k,
            serializeUser(peerUser),
          ]),
        })
      );
    }
  });
});

app.listen(9000);
console.log("server listening on http://localhost:9000");
