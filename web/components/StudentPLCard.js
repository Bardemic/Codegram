'use client';

import { Button } from "@/components/ui/button"; // Assuming ShadCN's button component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assuming ShadCN's avatar components

const iconUrls = {
  0: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
  1: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png",
  2: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
  3: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
}

const names = {
  0: "JavaScript",
  1: "Java",
  2: "Python",
  3: "C++",
}

export default function StudentPLCard({ id }) {
  const waitlistCount = 109450 // TODO: use actual waitlistCount using plId
  const name = names[id];
  const iconUrl = iconUrls[id];

  const onJoin = () => {
    alert(`Joining ${name}`);
  };

  return (
    <div className="flex items-center justify-between w-full p-4 my-4 shadow-md rounded-xl border">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Avatar className="w-12 h-12">
          <AvatarImage src={iconUrl} alt={`${name} icon`} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>

        {/* Programming Language Info */}
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-500">
            Currently waiting: <span className="font-medium">{waitlistCount}</span>
          </p>
        </div>
      </div>

      {/* Join Button */}
      <Button onClick={onJoin} className="border border-neutral-300 hover:bg-neutral-700" variant="primary">
        Join
      </Button>
    </div>
  );
};
