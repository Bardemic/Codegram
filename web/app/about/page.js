"use client"
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
          
          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold text-[#702cdc]">About Codegram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-500 text-center">
                Welcome to <strong>Codegram</strong>! We are committed to providing the best experience for aspiring programmers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold text-[#702cdc]">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-500 text-center">
                We hope to make the world of code more accessible to those who are eager to learn and improve their skills.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 rounded-lg p-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold text-[#702cdc]">Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-500 text-center">
                We have a dedicated team of passionate individuals, comprised of college undergraduates, who understand the educational needs of aspiring programmers.
              </p>
              <div className="mt-4 flex justify-center gap-2 text-[#702cdc]">
                <Badge variant="outline" color="blue">Web Developer</Badge>
                <Badge variant="outline" color="green">Backend Developer</Badge>
                <Badge variant="outline" color="red">Frontend Developer</Badge>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-[#702cdc]">What is Codegram?</AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Codegram is an online platform designed to help coders receive one-on-one programming assistance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-[#702cdc]">Who can join Codegram?</AccordionTrigger>
              <AccordionContent className="text-gray-500">
                Anyone interested in learning programming, whether you are a complete beginner or have some experience, can join Codegram.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-[#702cdc]">What resources do we offer?</AccordionTrigger>
              <AccordionContent className="text-gray-500">
                We offer software engineers from a variety of backgrounds to be available to help you with whatever problem you may have.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center mt-6">
            <a size="lg" href="/" className="text-sm font-medium text-[#702cdc] hover:text-blue-900">
              Join Us Now
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
