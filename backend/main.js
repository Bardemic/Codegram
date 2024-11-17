const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");

require("express-ws")(app); // adds ws stuff to app

const users = {
  john: {
    role: "student",
    username: "john",
    passwordHash:
      "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",
    dateCreated: new Date(),
  },
  cena: {
    role: "tutor",
    username: "cena",
    passwordHash:
      "507f8ded27f5b96fa908bd9bba10996849b4d189c235b117df15c3e73624623e",
    dateCreated: new Date(),
  },
};

const waitingSessions = new Map();

function serializeUser({ role, username, dateCreated, sessionId, peer }) {
  return {
    role,
    username,
    dateCreated: dateCreated.toISOString(),
    sessionId,
    peer: peer ? peer.username : undefined,
  };
}

app.ws("/connect", function (ws, req) {
  let user = null;

  ws.on("close", () => {
    if (user) {
      user.ws = undefined;
      user.sessionId = undefined;
      if (user.peer) {
        user.peer.ws.send(JSON.stringify({ type: "peerleft" }));
        user.peer.sessionId = undefined;
        user.peer.peer = undefined;
        user.peer = undefined;
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
        ws,
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
      user.ws = ws;
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
      if (!user) {
        ws.send(
          JSON.stringify({
            type: "createsession-error",
            message: "User is not logged in.",
          })
        );
        return;
      }
      if (user.sessionId) {
        ws.send(
          JSON.stringify({
            type: "createsession-error",
            message: "User is already waiting for or in a help room.",
          })
        );
        return;
      }
      while (true) {
        const id = uuid();
        if (waitingSessions.has(id)) continue;
        waitingSessions.set(id, user);
        user.sessionId = id;
        ws.send(JSON.stringify({ type: "createsession-success", id }));
        break;
      }
    } else if (data.type === "joinsession") {
      const { sessionId } = data;
      if (typeof sessionId !== "string" || !waitingSessions.has(sessionId)) {
        ws.send(
          JSON.stringify({
            type: "joinsession-error",
            message: "Invalid session data.",
          })
        );
        return;
      }

      const peerUser = waitingSessions.get(sessionId);
      waitingSessions.delete(sessionId);

      if (!peerUser.ws || peerUser.peer) {
        ws.send(
          JSON.stringify({
            type: "joinsession-error",
            message:
              "The user has cancelled the help session or it has already been fulfilled.",
          })
        );
        return;
      }

      user.isDominant = false;
      user.peer = peerUser;
      peerUser.peer = user;
      peerUser.isDominant = true;
      peerUser.ws.send(
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
          sessions: [...waitingSessions.entries()].map(([k, peerUser]) => [
            k,
            serializeUser(peerUser),
          ]),
        })
      );
    } else if (data.type === "codeupdate") {
      const { source } = data;
      if (typeof source !== "string") {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid code update data.",
          })
        );
        return;
      }

      if (!user.isDominant || !user.peer) {
        return;
      }

      user.peer.ws.send(
        JSON.stringify({
          type: "codeupdate",
          source,
        })
      );
    } else if (data.type === "dominantrequest") {
      user.peer.ws.send(
        JSON.stringify({
          type: "dominantrequest",
        })
      );
    } else if (data.type === "dominantresponse") {
      const { status } = data;
      user.isDominant = !status;
      user.peer.isDominant = status;
      user.peer.ws.send(JSON.stringify({ type: "dominantresponse", status }));
    } else if (data.type === "messagepeer") {
      user.peer.ws.send(JSON.stringify(data));
    } else if (data.type === "leavesession") {
      user.sessionId = undefined;
      if (user.peer) {
        user.peer.ws.send(JSON.stringify({ type: "peerleft" }));
        user.peer.sessionId = undefined;
        user.peer.peer = undefined;
        user.peer = undefined;
      }
    } else {
      ws.send(
        JSON.stringify({
          type: `${data.type}-error`,
          message: "Unkown message type. L bozo.",
        })
      );
    }
  });
});

app.listen(9000);
console.log("server listening on http://localhost:9000");
