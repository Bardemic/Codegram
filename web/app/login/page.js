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
import {ws, call} from "@/lib/ws"
import { useState } from "react"
import bcrypt from "bcryptjs"
import { Checkbox } from "@/components/ui/checkbox"

async function hashPassword(password) {
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


async function login(username, password) {
    try {
        const data = await call("login", {username: username, passwordHash: await hashPassword(password)});
        console.log(data);
    } catch (error) {
        alert(error);
        return;
    }
    
    //{role, username, dateCreated} < what is returned ^
    /*const listener = (message) => {
        ws.removeEventListener("message", listener);
        console.log(message);
        const data = JSON.parse(message.data);
        if(data.type === "error"){
            alert(data.message);
            return;
        }
        console.log(data);
        //redirect here
        //isTutor ? window.location.href = "/tutor" : window.location.href = "/student";
        /*data.user = {
            role: data.role,
            username: data.username
        };*/
    }
    //ws.addEventListener("message", listener);*/



 

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isTutor, setIsTutor] = useState(false);
    return (
        <div className="p-10 flex flex-col items-center">
            <Card className="w-72">
                <CardHeader>
                    <CardTitle>Sign Up!</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Input id="username" type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <Input id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <div className="flex items-center gap-2">
                        <Checkbox id="isTutor" checked={isTutor} onCheckedChange={(e) => setIsTutor(e)} />
                        <label htmlFor="isTutor">I am a tutor</label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => login(username, password)}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}