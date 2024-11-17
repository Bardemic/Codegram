'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import StudentHelpCard from "@/components/StudentHelpCard";
import { call } from "@/lib/ws";

const tutoringStats = [
  { day: "Monday", sessions: 7 },
  { day: "Tuesday", sessions: 5 },
  { day: "Wednesday", sessions: 8 },
  { day: "Thursday", sessions: 6 },
  { day: "Friday", sessions: 10 },
  { day: "Saturday", sessions: 4 },
  { day: "Sunday", sessions: 3 },
];

const languageData = [
  { name: "JavaScript", value: 26 },
  { name: "Python", value: 39 },
  { name: "Java", value: 25 },
  { name: "C++", value: 10 },
];



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

async function getOpenTutees() {
    try {
        const response = await call("getsessions", {});
        return response.sessions.map(([sessionId, user]) => ({
            id: sessionId,
            name: user.username,
            avatarUrl: "", 
            language: "JavaScript"
        }));
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }
}

  export default function TutorPage() {
  const totalSessions = tutoringStats.reduce((acc, stat) => acc + stat.sessions, 0);
  const languageTotal = languageData.reduce((acc, data) => acc + data.value, 0);
  const [openTutees, setOpenTutees] = useState([]);
  useEffect(() => {
    getOpenTutees().then((data) => {
        setOpenTutees(data);
    })
}, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6 grid grid-cols-2 gap-6">
        {/* Left Section: Students Asking for Help */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Students Asking for Help</h2>
          <div className="space-y-4">
            {openTutees.map((student) => (
              <StudentHelpCard 
                key={student.id}
                name={student.name}
                avatarUrl={student.avatarUrl}
                id={student.id}
                language={student.language}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Progress Bar for Language Stats and Table for Daily Sessions */}
        <div className="space-y-6">
          {/* Progress Bar for Language Stats */}
          <Card>
            <CardTitle className="text-lg font-medium p-4">
              Languages Tutored
            </CardTitle>
            <CardContent>
              {languageData.map((data) => {
                const percentage = (data.value / languageTotal) * 100;
                return (
                  <div key={data.name} className="mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{data.name}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Table for Daily Sessions */}
          <Card>
            <CardTitle className="text-lg font-medium p-4">
              Weekly Tutoring Sessions
            </CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Sessions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutoringStats.map((stat) => (
                    <TableRow key={stat.day}>
                      <TableCell>{stat.day}</TableCell>
                      <TableCell>{stat.sessions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
