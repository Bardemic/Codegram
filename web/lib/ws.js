"use client";

if (!globalThis.__ws) {
  globalThis.__ws = new WebSocket("ws://localhost:9000/connect");
}

export const ws = globalThis.__ws;
