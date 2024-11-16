"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { Separator } from "@/components/ui/separator"
  import { call } from "@/lib/ws"


  async function getOpenTutees() {
    const data = await call("getsessions", {});
    console.log(data)
    return Array.isArray(data) ? data : [];
  }

export default function TutorPage() {
    //const [openTutees, setOpenTutees] = useState([{name: "Person 1", language: "Python"}, {name: "Person 2", language: "Javascript"}, {name: "Person 3", language: "C++"}]);
    const [openTutees, setOpenTutees] = useState([]);
    useEffect(() => {
        getOpenTutees().then((data) => {
            setOpenTutees(data);
        })
    }, []);
  return (
    <div>
      <Header />
      <main className="p-4">
          <Card className="w-64 h-80">
            <CardHeader>Open Tutees</CardHeader>
            <CardContent className="flex flex-col gap-4">
                {openTutees.map((tutee) => {
                    return(
                        <div key={tutee.name}>
                            <div className="flex flex-row justify-between">
                                <div><p>{tutee.name}</p><p>{tutee.language}</p></div>
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                            <Separator className="my-2" />
                        </div>
                    )
                })}
                {openTutees.length === 0 && <p>No open tutees</p>}
            </CardContent>
          </Card>
      </main>
    </div>
  );
}
