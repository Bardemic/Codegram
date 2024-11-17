'use client';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; 
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function StudentHelpCard({ name, avatarUrl, id, language }) {
  const onOfferHelpClick = () => {
    alert(`Offering help to ${name}`)
  };

  return (
    <Card className="flex items-center p-4">
      {/* <div className="relative w-16 h-16 bg-gray-300 rounded-full flex justify-center items-center mr-4"> */}
        <Avatar>
          <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      {/* </div> */}
      <CardContent className="flex-grow">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <div className="text-sm text-gray-600">
          Needs help with:{" "}
          <Badge className="ml-2 bg-neutral-800 text-white">
            {language}
          </Badge>
        </div>
      </CardContent>
      <Button
        className="ml-auto border-2 border-white text-white bg-transparent hover:bg-black hover:text-white"
        onClick={onOfferHelpClick}
      >
        Offer Help
      </Button>
    </Card>
  );
};