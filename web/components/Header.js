"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { current } from "@/lib/ws";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

function logout(router) {
    try {
        localStorage.removeItem("username");
        localStorage.removeItem("passwordHash");
        localStorage.removeItem("role");
        current.user = null;
        router.push("/login");
    } catch (error) {
        console.error(error);
    }
}

export default function Header() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        try {
            setUser(localStorage.getItem("username"));
            setRole(localStorage.getItem("role"));
        } catch (error) {
            console.error(error);
        }
    }, []);


    return (
        <header className="border-b shadow">
            <div className="w-full mx-auto flex h-16 items-center justify-between px-10">
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
                <nav className="hidden md:flex space-x-4">
                    <Link
                        href="/"
                        className={cn(
                            "text-md font-medium"
                        )}
                    >
                        Home
                    </Link>
                    {/* {current.user ? <>
                        <Link
                            href={current.user.role === "tutor" ? "/tutor" : "/student"}
                            className={cn(
                                "text-md font-medium"
                            )}
                        >
                            {current.user.role === "tutor" ? "Tutoring" : "Learning"}
                        </Link>
                    </> : null} */}
                    {user ? <>
                        <Link
                            href={role === "tutor" ? "/tutor" : "/student"}
                            className={cn(
                                "text-md font-medium"
                            )}
                        >
                            {role === "tutor" ? "Tutoring" : "Learning"}
                        </Link>
                    </> : null}
                    <Link
                        href="/about"
                        className={cn(
                            "text-md font-medium"
                        )}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className={cn(
                            "text-md font-medium"
                        )}
                    >
                        Contact
                    </Link>
                </nav>
                <div className="flex gap-4">
                    {user ? (
                        <div className="flex justify-end items-center gap-4">
                            <p>{user}</p>
                            <Button variant="outline" onClick={() => logout(router)} size="sm">Log Out</Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm">Sign Up</Button>
                            <Button size="sm">Log In</Button>
                        </div>
                    )}
                    {mounted && <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Image
                            src={theme === "dark" ? "/lightmode.svg" : "/darkmode.svg"}
                            alt="Toggle theme"
                            width={16}
                            height={16}
                        />
                    </Button>}
                </div>
            </div>
        </header>
    );
}

