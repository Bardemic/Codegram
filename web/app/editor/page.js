"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function escape(str) {
  return new Option(str).innerHTML;
}

function format(v) {
  switch (typeof v) {
    case "undefined":
    case "number":
    case "boolean":
      return `<span class="text-blue-200">${v}</span>`;
    case "string":
      return `<span class="text-green-200">${escape(v)}</span>`;
    case "object":
      if (v === null) {
        // noice
        return `<span class="text-gray-500">${v}</span>`;
      }
      if (v instanceof Array) {
        return `[${v.map((v) => format(v)).join(", ")}]`;
      }
      if (v instanceof Error) {
        const msg = v.toString();
        const colonIdx = msg.indexOf(":");
        if (colonIdx !== -1) {
          return `<span class="text-red-200">${escape(
            msg.slice(0, colonIdx + 1)
          )}</span>${escape(msg.slice(colonIdx + 1))}`;
        }
        return msg;
      }
      return `{ ${Object.entries(v)
        .map(([k, v]) => `${k}: ${format(v)}`)
        .join(", ")} }`;
  }
}

export default function Editor() {
  const [value, setValue] = useState('console.log("Hello, world!")');
  const [output, setOutput] = useState("");

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    execute();
  };

  const execute = () => {
    const log = console.log;
    setOutput("");
    console.log = (...args) => {
      if (typeof args[0] === "string" && args[0].startsWith("[Fast Refresh]")) {
        // scuffed lol
        return;
      }
      setOutput(
        (old) => old + args.map((s) => format(s)).join("<br>") + "<br>"
      );
      log(output);
    };
    try {
      new Function(value)();
    } catch (err) {
      setOutput((old) => old + `${format(err)}` + "<br>");
      //   reportError(err);
    }
    console.log = log;
  };

  return (
    <div>
      <header className="border-b shadow">
        <div className="container mx-auto grid grid-cols-3 h-16 items-center px-4">
          <div className="text-lg font-bold">CodeGram</div>
          <div className="text-sm text-slate-200 text-center">
            Code the world.
          </div>
          <div className="flex justify-end">
            <Button variant="default" size="sm" onClick={execute}>
              Run code
            </Button>
          </div>
        </div>
      </header>
      <MonacoEditor
        height="60vh"
        defaultLanguage="javascript"
        defaultValue={value}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
      <div className="py-2 px-4 overflow-y">
        <div className="text-sm">Output</div>
        <code>
          {/* yeet */}
          <pre dangerouslySetInnerHTML={{ __html: output }} />
        </code>
      </div>
    </div>
  );
}
