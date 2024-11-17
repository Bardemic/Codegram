"use client";

import { Button } from "@/components/ui/button"; // Assuming ShadCN's button component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assuming ShadCN's avatar components
import { call } from "@/lib/ws";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const iconUrls = {
  0: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
  1: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png",
  2: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
  3: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
};

const names = {
  0: "JavaScript",
  1: "Java",
  2: "Python",
  3: "C++",
};

export default function StudentPLCard({ id }) {
  const router = useRouter();
  // const waitlistCount = 109450; // TODO: use actual waitlistCount using plId
  const name = names[id];
  const iconUrl = iconUrls[id];
  const { toast } = useToast();
  const [waitlistCount, setWaitlistCount] = useState(null);

  useEffect(() => {
    if (id !== 0) return;
    (async () => {
      const { count } = await call("getwaitlistcount", {});
      setWaitlistCount(count);
    })();
  }, []);

  return (
    <div className="flex items-center justify-between w-full p-4 my-4 shadow-md rounded-xl border">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={iconUrl} alt={`${name} icon`} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">
            {name}
            {id !== 0 ? " (Coming soon)" : ""}
          </p>
          <p className="text-sm text-gray-500">
            {id === 0 ? (
              <>
                Currently waiting:{" "}
                <span className="font-medium">{waitlistCount}</span>
              </>
            ) : (
              "Language support not yet implemented"
            )}
          </p>
        </div>
      </div>
      <Button
        className="border"
        variant="outline"
        onClick={async () => {
          try {
            const { id } = await call("createsession", {});
            router.push(`/sessions/${id}`);
          } catch (error) {
            toast({
              title: "Create session Error",
              description: error.toString(),
            });
          }
        }}
      >
        Get help
      </Button>
    </div>
  );
}
