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
import { ws, call, current } from "@/lib/ws";
import { useState } from "react";
import sha256 from "js-sha256";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function login(username, password, router, toast) {
  try {
    console.log(username, password);
    const passwordHash = sha256(password);
    const data = await call("login", { username: username, passwordHash });
    current.user = data.user;
    localStorage.setItem("username", username);
    localStorage.setItem("passwordHash", passwordHash);
    localStorage.setItem("role", data.user.role);
    console.log(data);
    data.user.role === "tutor"
      ? router.push("/tutor")
      : router.push("/student");
  } catch (error) {
    toast({
      title: "Login Error",
      description: error,
    });
    return;
  }
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div className="p-16 h-screen flex flex-col items-center justify-center">
      <Card className="w-80 p-2">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 mt-4">
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
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button className="w-full" onClick={() => login(username, password, router, toast)}>
            Login
          </Button>
          <CardDescription>
            Don't have an account?
            <Button variant="link" size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
