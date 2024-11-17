"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ws, current, call } from "@/lib/ws";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun2.1.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 2,
};

export default function Editor() {
  if (!current.user) return <span>Session has ended.</span>;

  console.info(current.user.peer);

  const router = useRouter();
  let madeCall = false;
  let pc;
  let value = 'console.log("Hello, world!")\n';
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const editorRef = useRef(null);
  const [isDominant, setIsDominant] = useState(current.user.role === "student");
  const [peerUsername, setPeerUsername] = useState(
    current.user.role === "student" ? "Waiting for tutor..." : current.user.peer
  );

  let remoteVideo = useRef(null);
  let localVideo = useRef(null);
  let localStream;

  async function handleOffer(offer) {
    try {
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        ws.send(JSON.stringify({ type: "messagepeer", message }));
      };
      pc.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      ws.send(
        JSON.stringify({
          type: "messagepeer",
          message: { type: "answer", sdp: answer.sdp },
        })
      );
      await pc.setLocalDescription(answer);
    } catch (e) {
      console.info(e);
    }
  }

  async function handleAnswer(answer) {
    if (!pc) {
      console.error("no peerconnection");
      return;
    }
    try {
      await pc.setRemoteDescription(answer);
    } catch (e) {
      console.info(e);
    }
  }

  async function handleCandidate(candidate) {
    try {
      if (!pc) {
        console.error("no peerconnection");
        return;
      }
      if (!candidate) {
        await pc.addIceCandidate(null);
      } else {
        await pc.addIceCandidate(candidate);
      }
    } catch (e) {
      console.info(e);
    }
  }
  async function hangup(router, title) {
    if (pc) {
      pc.close();
      pc = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }
    await call("leavesession", {});
    toast({
      title,
      description: "You have left the session.",
    });
    router.push(`/${current.user.role}`);
  }

  async function makeCall() {
    try {
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        ws.send(JSON.stringify({ type: "messagepeer", message }));
      };
      pc.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
      const offer = await pc.createOffer();
      ws.send(
        JSON.stringify({
          type: "messagepeer",
          message: { type: "offer", sdp: offer.sdp },
        })
      );
      await pc.setLocalDescription(offer);
    } catch (e) {
      console.info(e);
    }
  }

  useEffect(() => {
    const listener = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "tutorjoined") {
        const description = `${data.user.username} has joined the session`;
        current.user.peer = data.user.username;
        toast({
          title: "Tutor joined",
          description,
        });
        setPeerUsername(data.user.username);
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
      } else if (data.type === "messagepeer") {
        data = data.message;

        if (data.type === "offer") {
          handleOffer(data);
        } else if (data.type === "answer") {
          handleAnswer(data);
        } else if (data.type === "candidate") {
          handleCandidate(data);
        }
      } else if (data.type === "peerleft") {
        hangup(router, `${current.user.peer} left the session`);
      }
    };
    ws.addEventListener("message", listener);

    (async () => {
      if (localStream) return;
      try {
        localStream = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: { echoCancellation: true },
        });
        localStream = await localStream;
        localVideo.current.srcObject = localStream;

        if (current.user.role === "tutor" && !madeCall) {
          console.info("make call");
          madeCall = true;
          makeCall();
        }
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      ws.removeEventListener("message", listener);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      hangup(router, "You have left the session.");
    };

    router.events?.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

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
          <div className="flex items-center">
            <Image
              src="/favicon.ico"
              alt="Codegram Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <div className="text-lg font-bold">Codegram</div>
          </div>
          <div className="text-sm text-slate-200 text-center">
            {current.user.role === "tutor"
              ? current.user.peer
              : current.user.username}
            's help session
          </div>
          <div className="flex justify-end gap-5">
            <Link href={`/${current.user.role}`}>
              <Button variant="secondary" size="sm">
                Leave session
              </Button>
            </Link>
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
          options={{ readOnly: current.user.role !== "student", fontSize: 16 }}
        />
        <div
          className="grid h-[60vh]"
          style={{ gridTemplateRows: "30vh 30vh" }}
        >
          <div className="relative">
            <span className="absolute" style={{ bottom: "1rem", left: "1rem" }}>
              {peerUsername}
            </span>
            <video
              ref={remoteVideo}
              className="border-l border-t border-r border-gray-800 h-[30vh] w-full"
              autoPlay
            ></video>
          </div>
          <div className="relative">
            <span className="absolute" style={{ bottom: "1rem", left: "1rem" }}>
              {current.user.username} (You)
            </span>
            <video
              ref={localVideo}
              className="border border-gray-800 h-[30vh] w-full"
              autoPlay
            ></video>
          </div>
        </div>
      </div>
      <div className="py-2 px-4 overflow-y-scroll">
        <div className="text-sm">Output</div>
        <code className="text-[1.1rem]">
          {/* yeet */}
          <pre dangerouslySetInnerHTML={{ __html: output }} />
        </code>
      </div>
    </div>
  );
}
