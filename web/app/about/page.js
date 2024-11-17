import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/Header";

export default function Page() {

    return (
      <div>
        <Header />
        <div className="container mx-auto p-6">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About Codegram</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  Welcome to Codegram! We are committed to providing the best experience for aspiring programmers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  We hope to make the world of code more accessible to those who are wanting to learn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  We have a dedicated team comprised of college undergraduates who are in a position to understand a programmer's educational needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
