import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <Header />
      <title>Contact Codegram!</title>
      <div className="container mx-auto p-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Contacting Us!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg text-center text-gray-500">
                Feel free to reach out to us with any questions at{" "}
                <a
                  href="mailto:SwanHacksWinner@gmail.com"
                  className="underline"
                  style={{ color: "#702cdc" }}
                >
                  SwanHacksWinner@gmail.com
                </a>
              </p>

              <form className="space-y-4">
                <Input
                  placeholder="Your Name"
                  className="w-full"
                  aria-label="Your Name"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  className="w-full"
                  aria-label="Your Email"
                />
                <Textarea
                  placeholder="Your Message"
                  className="w-full"
                  rows={4}
                  aria-label="Your Message"
                />
                <Button
                  size="lg"
                  className="w-full"
                  style={{ backgroundColor: "#702cdc", color: "white" }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


