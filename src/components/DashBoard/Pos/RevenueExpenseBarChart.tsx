"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueExpenseBarChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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

      //calculations

      const monthlyData: Record<string, { sales: number; expenses: number }> =
        {};

      //aggregate orders into months
      orders?.forEach((order) => {
        const month = new Date(order.created_at).toLocaleString("default", {
          month: "long",
        });
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, expenses: 0 };
        monthlyData[month].sales += Number(order.total_price) || 0;
      });

      // Aggregate expenses into months
      expenses?.forEach((expense) => {
        const month = new Date(expense.created_at).toLocaleString("default", {
          month: "long",
        });
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, expenses: 0 };
        monthlyData[month].expenses += Number(expense.amount) || 0;
      });

      const orderedMonths = [
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

      const finalData = orderedMonths.map((m) => ({
        month: m,
        sales: monthlyData[m]?.sales || 0,
        expenses: monthlyData[m]?.expenses || 0,
      }));

      setChartData(finalData);
      setLoading(false);
    }
    fetchData();
  }, []);

  console.log(chartData);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales vs Expenses</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="sales" fill="#8884d8" radius={4} />
              <Bar dataKey="expenses" fill="#82ca9d" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing monthly totals for sales & expenses
        </div>
      </CardFooter>
    </Card>
  );
}
