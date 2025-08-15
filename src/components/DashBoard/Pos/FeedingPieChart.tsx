"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const description = "A donut chart";

const categories = [
  "Feed",
  "Vet",
  "Medicine",
  "Manure",
  "Sawdust",
  "Chickens Purchased",
  "Other",
];

export function FeedingPieChart() {
  const [chartData, setChartData] = useState<
    { category: string; amount: number; fill: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("category, amount");

      if (error) {
        console.error(error);
        return;
      }

      // Sum amounts per category
      const totals: Record<string, number> = {};
      categories.forEach((cat) => (totals[cat] = 0));

      data.forEach((item) => {
        if (totals[item.category] !== undefined) {
          totals[item.category] += item.amount;
        }
      });

      // Map into chart format with colors
      const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-6)",
        "var(--chart-7)",
      ];

      setChartData(
        categories.map((cat, i) => ({
          category: cat,
          amount: totals[cat],
          fill: colors[i % colors.length],
        }))
      );
    };

    fetchData();
  }, []);

  const chartConfig = chartData.reduce(
    (config, item, idx) => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      };
      return config;
    },
    { amount: { label: "Amount" } } as any
  );

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expenses Breakdown</CardTitle>
        <CardDescription>Overall totals by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing all-time expenses totals
        </div>
      </CardFooter>
    </Card>
  );
}
