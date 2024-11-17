
'use client'
import Header from "@/components/Header";
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Page() {

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-8">
          
          {/* About Codegram Section */}
          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">About Codegram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 text-center">
                Welcome to <strong>Codegram</strong>! We are committed to providing the best experience for aspiring programmers.
              </p>
            </CardContent>
          </Card>

          {/* Our Mission Section */}
          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 text-center">
                We hope to make the world of code more accessible to those who are eager to learn and improve their skills.
              </p>
            </CardContent>
          </Card>

          {/* Our Team Section */}
          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 text-center">
                We have a dedicated team of passionate individuals, comprised of college undergraduates, who understand the educational needs of aspiring programmers.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="outline" color="blue">Web Developer</Badge>
                <Badge variant="outline" color="green">Backend Developer</Badge>
                <Badge variant="outline" color="red">Frontend Developer</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Accordion for FAQs */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Codegram?</AccordionTrigger>
              <AccordionContent>
                Codegram is an online platform designed to help coders recieve one-on-one programming asistance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Who can join Codegram?</AccordionTrigger>
              <AccordionContent>
                Anyone interested in learning programming, whether you are a complete beginner or have some experience, can join Codegram.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What resources do we offer?</AccordionTrigger>
              <AccordionContent>
                We offer software engineers from a variety of backgrounds to be available to help you with whatever problem you may have.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Call to Action Section */}
          <div className="text-center mt-6">
            <a size="lg" href="/" className="text-sm font-medium text-blue-600 hover:text-blue-900">
              Join Us Now
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}

  
