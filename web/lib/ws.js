"use client";

if (!globalThis.__ws) {
  globalThis.__ws = new WebSocket("ws://localhost:9000/connect");
}

export const ws = globalThis.__ws;

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
