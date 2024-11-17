"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ws, current } from "@/lib/ws";

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
      const entries = Object.entries(v);
      if (entries.length === 0) return "{}";
      return `{ ${entries.map(([k, v]) => `${k}: ${format(v)}`).join(", ")} }`;
  }
}

export default function Editor() {
  let value = 'console.log("Hello, world!")\n';
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const editorRef = useRef(null);
  const [isDominant, setIsDominant] = useState(current.user.role === "student");

  useEffect(() => {
    const listener = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "tutorjoined") {
        const description = `${data.user.username} has joined the session`;
        toast({
          title: "Tutor joined",
          description,
        });
        console.info(description);
      } else if (data.type === "codeupdate") {
        editorRef.current.setValue(data.source);
      } else if (data.type === "dominantrequest") {
        const status = confirm(`Allow ${current.user.peer} to take control?`);
        setIsDominant(!status);
        if (status) {
          editorRef.current.updateOptions({ readOnly: true });
        }
        ws.send(JSON.stringify({ type: "dominantresponse", status }));
      } else if (data.type === "dominantresponse") {
        const { status } = data;
        setIsDominant(status);
        toast({
          title: `Request ${status ? "accepted" : "denied"}`,
          description: `${current.user.peer} responded to your control request.`,
        });
        if (status) {
          editorRef.current.updateOptions({ readOnly: false });
        }
      }
    };
    ws.addEventListener("message", listener);
    return () => {
      ws.removeEventListener("message", listener);
    };
  }, []);

  const handleEditorChange = (newValue) => {
    value = newValue;
    ws.send(
      JSON.stringify({
        type: "codeupdate",
        source: newValue,
      })
    );
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
        (old) => old + args.map((s) => format(s)).join("&nbsp;") + "<br>"
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
    <div
      className="h-screen overflow-hidden grid"
      style={{ gridTemplateRows: "auto 60vh 1fr" }}
    >
      <header className="border-b shadow">
        <div className="container mx-auto grid grid-cols-3 h-16 items-center px-4">
          <div className="text-lg font-bold">CodeGram</div>
          <div className="text-sm text-slate-200 text-center">
            {current.user.role === "tutor"
              ? current.user.peer
              : current.user.username}
            's help session
          </div>
          <div className="flex justify-end gap-5">
            {!isDominant ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  ws.send(JSON.stringify({ type: "dominantrequest" }));
                  toast({
                    title: "Control request sent",
                    description: `You have requested control from ${current.user.peer}!`,
                  });
                }}
              >
                Request Control
              </Button>
            ) : null}
            <Button variant="default" size="sm" onClick={execute}>
              Run code
            </Button>
          </div>
        </div>
      </header>
      <div className="grid" style={{ gridTemplateColumns: "3fr 1fr" }}>
        <MonacoEditor
          height="60vh"
          defaultLanguage="javascript"
          defaultValue={value}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{ readOnly: current.user.role !== "student" }}
        />
        <div></div>
      </div>
      <div className="py-2 px-4 overflow-y-scroll">
        <div className="text-sm">Output</div>
        <code>
          {/* yeet */}
          <pre dangerouslySetInnerHTML={{ __html: output }} />
        </code>
      </div>
    </div>
  );
}
