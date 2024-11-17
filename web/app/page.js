"use client"
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto p-6 mt-12">
        <main className="flex flex-col gap-12">
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Learn Smarter, Not Harder
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with expert tutors and enhance your learning journey with our
                intelligent tutoring platform
              </p>
              <div className="flex gap-4">
                <Button>
                  <Link href="/signup">
                    Get Started
                  </Link>
                </Button>
                <Button variant="secondary">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg border bg-card shadow-lg overflow-hidden">
              <Image 
                src="/demo-placeholder.gif"
                alt="Platform Demo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                <Image src="/window.svg" alt="Live Sessions" width={40} height={40} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">Live Interactive Sessions</h3>
                <p className="text-muted-foreground text-center">
                  Connect with tutors in real-time through our seamless platform
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                <Image src="/file.svg" alt="Code Pass Off" width={40} height={40} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">Code Pass Offs</h3>
                <p className="text-muted-foreground text-center">
                  Demonstrate your skills through guided code reviews with tutors
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
                <Image src="/globe.svg" alt="Progress" width={40} height={40} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground text-center">
                  Monitor your learning journey with detailed analytics
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer className="flex justify-center pt-12">
          <p>© 2024 Codegram</p>
        </footer>
      </div>
    </>
  );
}
