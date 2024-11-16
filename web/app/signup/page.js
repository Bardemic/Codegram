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
import { Label } from "@/components/ui/label"
import {ws} from "@/lib/ws"
import { useState } from "react"
import bcrypt from "bcryptjs"

async function hashPassword(password) {
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}


async function signup(username, password) {
    console.log(username, password);
    console.log(JSON.stringify({type: "signup", role: "tutor", username: username, passwordHash: hashPassword(password)}));
    ws.send(JSON.stringify({type: "signup", role: "tutor", username: username, passwordHash: await hashPassword(password)})); //role, username, passwordHash
    const listener = (message) => {
        ws.removeEventListener("message", listener);
        console.log(message);
        const data = JSON.parse(message.data);
        if(data.type === "error"){
            alert(data.message);
            return;
        }
        //redirect here
        /*data.user = {
            role: data.role,
            username: data.username
        };*/
    }
    ws.addEventListener("message", listener);

}


 

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="p-10 flex flex-col">
            <Card className="w-72">
                <CardHeader>
                    <CardTitle>Sign Up!</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input id="username" type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <Input id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </CardContent>
                <CardFooter>
                    <Button onClick={() => signup(username, password)}>Sign Up</Button>
                </CardFooter>
            </Card>
        </div>
    )
}