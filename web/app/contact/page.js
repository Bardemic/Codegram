import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/Header";

export default function Page() {

    return (
      <div>
        <Header />
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
            <CardTitle className="text-2xl">Contacting Us!</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-lg">
                Feel free to reach out to us with any questions at{" "}
                <a
                href="mailto:SwanHacksWinner@gmail.com"
                className="text-blue-600 underline hover:text-blue-800"
                >
                SwanHacksWinner@gmail.com
                </a>
            </p>
            </CardContent>
        </Card>
        </div>
      </div>
    );
  }

