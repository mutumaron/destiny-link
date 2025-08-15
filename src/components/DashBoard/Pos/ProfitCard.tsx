import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const ProfitCard = () => {
  const [loading, setLoading] = useState(true);
  const [profit, setProfit] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const firstDayTwoMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 2,
        1
      );

      const { data: lastMonthOrders, error: ordersError } = await supabase
        .from("orders")
        .select("total_price, created_at")
        .gte("created_at", firstDayLastMonth.toISOString())
        .lt("create_at", firstDayThisMonth.toISOString());

      const { data: lastMonthExpenses, error: expensesError } = await supabase
        .from("expenses")
        .select("amount, expense_date")
        .gte("expense_date", firstDayLastMonth.toISOString())
        .lt("expense_date", firstDayThisMonth.toISOString());

      // Fetch previous month sales
      const { data: prevMonthOrders } = await supabase
        .from("orders")
        .select("total_price, created_at")
        .gte("created_at", firstDayTwoMonthsAgo.toISOString())
        .lt("created_at", firstDayLastMonth.toISOString());

      // Fetch previous month expenses
      const { data: prevMonthExpenses } = await supabase
        .from("expenses")
        .select("amount, expense_date")
        .gte("expense_date", firstDayTwoMonthsAgo.toISOString())
        .lt("expense_date", firstDayLastMonth.toISOString());

      if (ordersError || expensesError) {
        console.error("Error fetching data:", ordersError || expensesError);
        setLoading(false);
        return;
      }

      // Calculate totals
      const lastMonthSalesTotal =
        lastMonthOrders?.reduce((sum, o) => sum + o.total_price, 0) || 0;
      const lastMonthExpensesTotal =
        lastMonthExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

      const prevMonthSalesTotal =
        prevMonthOrders?.reduce((sum, o) => sum + o.total_price, 0) || 0;
      const prevMonthExpensesTotal =
        prevMonthExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

      const lastMonthProfit = lastMonthSalesTotal - lastMonthExpensesTotal;
      const prevMonthProfit = prevMonthSalesTotal - prevMonthExpensesTotal;

      // Calculate % change
      let change = 0;
      if (prevMonthProfit !== 0) {
        change =
          ((lastMonthProfit - prevMonthProfit) / Math.abs(prevMonthProfit)) *
          100;
      }

      setProfit(lastMonthProfit);
      setPercentChange(change);
      setLoading(false);
    };
    fetchData();
  }, []);

  const isPositive = percentChange >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardDescription>Total Revenue</CardDescription>
          <Card className="flex gap-2 items-center text-sm">
            {isPositive ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
            {percentChange.toFixed(1)}%
          </Card>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl">
          {loading ? (
            <Skeleton className="h-6" />
          ) : (
            `Ksh ${profit.toLocaleString("en-KE", {
              minimumFractionDigits: 2,
            })}`
          )}
        </CardTitle>
      </CardContent>
      <CardFooter>
        <CardDescription>Total revenue last month</CardDescription>
      </CardFooter>
    </Card>
  );
};

export default ProfitCard;
