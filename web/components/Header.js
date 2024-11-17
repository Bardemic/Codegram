"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function EditorHeader() {
    const router = useRouter();
  return (
    <header className="border-b shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="text-lg font-bold">MyLogo</div>
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
        <div className="flex items-center space-x-4">
          <Input placeholder="Search" className="w-36" />
          <Button variant="outline" size="sm" onClick={() => router.push("/signup")}>
            Sign Up
          </Button>
          <Button size="sm" onClick={() => router.push("/login")}>Log In</Button>
        </div>
      </div>
    </header>
  );
}
