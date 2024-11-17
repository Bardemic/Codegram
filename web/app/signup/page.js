"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { call } from "@/lib/ws";

async function signup(username, password, isTutor, router, toast) {
  try {
    const passwordHash = sha256(password);
    const data = await call("signup", {
      role: isTutor ? "tutor" : "student",
      username: username,
      passwordHash: passwordHash,
    });
    if (data.type === "signup-success") {
      localStorage.setItem("username", username);
      localStorage.setItem("passwordHash", passwordHash);
      localStorage.setItem("role", data.user.role);
      current.user = data.user;
      router.push(data.user.role === "tutor" ? "/tutor" : "/student");
    }
  } catch (error) {
    toast({
      title: "Sign up Error",
      description: error,
    });
  }
}

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isTutor, setIsTutor] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div className="p-10 h-screen justify-center flex flex-col items-center">
      <title>Sign up</title>
      <Card className="w-80 p-2">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 mt-4">
          <div className="flex flex-col gap-6">
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
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isTutor"
              checked={isTutor}
              onCheckedChange={(e) => setIsTutor(e)}
            />
            <label className="text-sm my-1" htmlFor="isTutor">
              I am a tutor
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button
            className="w-full"
            onClick={() => signup(username, password, isTutor, router, toast)}
          >
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
