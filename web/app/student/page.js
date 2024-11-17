"use client";

import StudentPLCard from "@/components/StudentPLCard";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div>
      <Header />
      <div className="p-10">
        <StudentPLCard id={0} />
        <StudentPLCard id={1} />
        <StudentPLCard id={2} />
        <StudentPLCard id={3} />
      </div>
    </div>
  );
}
