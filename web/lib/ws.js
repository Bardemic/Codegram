"use client";

// send() fails if not opened yet so we queue up until the conn is opened
if (globalThis.__ws === undefined) {
  const __ws = new WebSocket("ws://localhost:9000/connect");
  const send = __ws.send.bind(__ws);
  const queue = [];
  __ws.send = (...args) => queue.push(args);
  __ws.onopen = () => {
    __ws.send = send;
    for (const args of queue) {
      send(...args);
    }
    queue.length = 0;
  };
  globalThis.__ws = __ws;
  globalThis.__call = call;
}

export const current = { user: null };
export const ws = globalThis.__ws;

if (globalThis.__current === undefined) {
  globalThis.__current = current;
}

/** Stringifies data and requests with the given data. */
export function call(type, info) {
  info.type = type;
  return new Promise((resolve, reject) => {
    const listener = ({ data: dataStr }) => {
      ws.removeEventListener("message", listener);
      const data = JSON.parse(dataStr);
      if (data.type === `${type}-success`) {
        resolve(data);
      } else if (data.type === `${type}-error`) {
        reject(data.message);
      }
    };
    ws.addEventListener("message", listener);
    ws.send(JSON.stringify(info));
  });
}
