"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {ws, call} from "@/lib/ws"
import { useState } from "react"
import sha256 from "js-sha256"


async function login(username, password) {
    try {
        console.log(username, password);
        const data = await call("login", {username: username, passwordHash: sha256(password)});
        console.log(data);
        data.role === "tutor" ? window.location.href = "/tutor" : window.location.href = "/student";
    } catch (error) {
        alert(error);
        return;
    }
}



 

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="p-10 flex flex-col items-center">
            <Card className="w-72">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Input id="username" type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <Input id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </CardContent>
                <CardFooter>
                    <Button onClick={() => login(username, password)}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}