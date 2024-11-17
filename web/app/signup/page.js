"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { current, ws } from "@/lib/ws";
import { useState } from "react";
import sha256 from "js-sha256";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function signup(username, password, isTutor, router) {
  const passwordHash = sha256(password);
  ws.send(
    JSON.stringify({
      type: "signup",
      role: isTutor ? "tutor" : "student",
      username: username,
      passwordHash,
    })
  ); //role, username, passwordHash
  const listener = (message) => {
    ws.removeEventListener("message", listener);
    console.log(message);
    const data = JSON.parse(message.data);
    if (data.type === "error") {
      alert(data.message);
      return;
    }
    localStorage.setItem("username", username);
    localStorage.setItem("passwordHash", passwordHash);
    current.user = data.user;
    router.push("/login");
  };
  ws.addEventListener("message", listener);
}

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isTutor, setIsTutor] = useState(false);
  const router = useRouter();
  return (
    <div className="p-10 flex flex-col items-center">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Sign Up!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            id="username"
            type="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="isTutor"
              checked={isTutor}
              onCheckedChange={(e) => setIsTutor(e)}
            />
            <label htmlFor="isTutor">I am a tutor</label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3">
          <Button onClick={() => signup(username, password, isTutor, router)}>
            Sign Up
          </Button>
          <CardDescription>
            Have an account?
            <Button variant="link" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
