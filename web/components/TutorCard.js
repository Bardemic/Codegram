import { Button } from "@/components/ui/button"; // Assuming ShadCN's button component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assuming ShadCN's avatar components
import { Badge } from "@/components/ui/badge"; // Assuming ShadCN's badge component

export default function TutorCard({ avatarUrl, name, subjects, onInvite }) {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-white shadow-md rounded-md border">
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
      <Button onClick={onInvite} variant="primary">
        Invite
      </Button>
    </div>
  );
};