"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "A bar chart with negative values";

const chartConfig = {
  profit: {
    label: "Profit",
  },
} satisfies ChartConfig;

export function ProfitBarChart() {
  const [chartData, setChartData] = useState<
    { month: string; profit: number; sales: number; expenses: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfitLoss = async () => {
      setLoading(true);
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total_price, created_at")
        .eq("status", "delivered");

      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("amount, created_at");

      if (ordersError || expensesError) {
        console.error(ordersError || expensesError);
        setLoading(false);
        return;
      }

      const monthly: Record<string, { sales: number; expenses: number }> = {};

      orders?.forEach((order) => {
        const date = new Date(order.created_at);
        const key = date.toLocaleString("default", { month: "long" });
        if (!monthly[key]) monthly[key] = { sales: 0, expenses: 0 };
        monthly[key].sales += order.total_price;
      });

      expenses?.forEach((exp) => {
        const date = new Date(exp.created_at);
        const key = date.toLocaleString("default", { month: "long" });
        if (!monthly[key]) monthly[key] = { sales: 0, expenses: 0 };
        monthly[key].expenses += exp.amount;
      });

      const monthsOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const finalData = monthsOrder
        .map((m) => ({
          month: m,
          sales: monthly[m]?.sales || 0,
          expenses: monthly[m]?.expenses || 0,
          profit: (monthly[m]?.sales || 0) - (monthly[m]?.expenses || 0),
        }))
        .filter((item) => item.sales !== 0 || item.expenses !== 0);

      setChartData(finalData);
      setLoading(false);
    };
    fetchProfitLoss();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Profit/Loss</CardTitle>
        <CardDescription>Positive = Profit, Negative = Loss</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
              <Bar dataKey="profit">
                <LabelList position="top" dataKey="month" fillOpacity={1} />
                {chartData.map((item) => (
                  <Cell
                    key={item.month}
                    fill={
                      item.profit < 0
                        ? "var(--chart-1)" // Green for profit
                        : "var(--chart-2)" // Red for loss
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Based on sales and expenses from the database
        </div>
      </CardFooter>
    </Card>
  );
}
