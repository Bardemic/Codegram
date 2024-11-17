"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { current } from "@/lib/ws";

function logout(router) {
    try {
        localStorage.removeItem("username");
        localStorage.removeItem("passwordHash");
        current.user = null;
        router.push("/login");
    } catch (error) {
        console.error(error);
    }
}

export default function Header() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    useEffect(() => {
        try {
            setUser(localStorage.getItem("username"));
        } catch (error) {
            console.error(error);
        }
    }, []);
  return (
    <header className="border-b shadow">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-10">
        <div className="flex items-center">
          <img
            src="/favicon.ico"
            alt="Codegram Logo"
            className="w-6 h-6 mr-2"
          />
          <div className="text-lg font-bold">Codegram</div>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a
            href="/"
            className={cn(
              "text-sm font-medium text-gray-600 hover:text-gray-900"
            )}
          >
            Home
          </a>
          <a
            href="/about"
            className={cn(
              "text-sm font-medium text-gray-600 hover:text-gray-900"
            )}
          >
            About
          </a>
          <a
            href="/contact"
            className={cn(
              "text-sm font-medium text-gray-600 hover:text-gray-900"
            )}
          >
            Contact
          </a>
        </nav>
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
      </div>
    </header>
  );
}

