'use client';

import { Button } from "@/components/ui/button"; // Assuming ShadCN's button component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assuming ShadCN's avatar components
import { Badge } from "@/components/ui/badge"; // Assuming ShadCN's badge component

export default function TutorCard({ avatarUrl, name, subjects, tutorId }) {
  const onInvite = () => {
    alert(`Invitation sent to ${tutorId}`);
  };

  return (
    <div className="flex items-center justify-between w-full p-4 my-2 shadow-md rounded-xl border">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Tutor Info */}
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {subjects.map((subject, index) => (
              <Badge key={index} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Button */}
      <Button className="border" onClick={onInvite} variant="primary">
        Invite
      </Button>
    </div>
  );
};
