import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ellipsis, TrendingUp } from "lucide-react";
import AddChicken from "./AddChicken";

interface ChickenData {
  id: string;
  title: string;
  chicken: number;
  created_at: string; // Make sure your table has timestamps
}

interface DetailCardProps {
  stats: ChickenData;
  onRefetch: () => void;
}

const DetailCards = ({ stats, onRefetch }: DetailCardProps) => {
  return (
    <Card className="max-h-fit">
      <CardHeader>
        <div className="flex justify-between items-centre">
          <CardTitle>{stats.title}</CardTitle>
          <AddChicken stat={stats} onRefetch={onRefetch} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{stats.chicken}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <TrendingUp className="text-green-700" />
        <p>
          5% <span>from last month</span>{" "}
        </p>
      </CardFooter>
    </Card>
  );
};

export default DetailCards;
