import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout } from "lucide-react";
import React from "react";

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
};

interface WelcomeProps {
  profile: Profile | null;
}

const Welcome = ({ profile }: WelcomeProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="bg-orange-300 h-10 w-10 items-center flex rounded-full ">
          <Sprout className="text-orange-600" size={35} />
        </div>
      </CardHeader>
      <CardContent>
        {!profile ? (
          <Skeleton className="h-6" />
        ) : (
          <CardTitle>Welcome,{profile.first_name}!</CardTitle>
        )}
      </CardContent>
      <CardFooter>
        <CardDescription>
          Hey {!profile ? "user" : profile.last_name} welcome to the destiny
          link admin dashBoard.Enjoy!
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default Welcome;
