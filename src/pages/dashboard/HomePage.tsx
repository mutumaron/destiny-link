import NewOrder from "@/components/DashBoard/Orders/NewOrder";
import AddExpense from "@/components/DashBoard/Pos/AddExpense";
import DetailCards from "@/components/DashBoard/Pos/DetailCards";
import { ExpenseCard } from "@/components/DashBoard/Pos/ExpensesCard";
import { FeedingPieChart } from "@/components/DashBoard/Pos/FeedingPieChart";
import { ProfitBarChart } from "@/components/DashBoard/Pos/ProfitBarChart";
import ProfitCard from "@/components/DashBoard/Pos/ProfitCard";
import { RevenueCard } from "@/components/DashBoard/Pos/RevenueCard";
import { RevenueExpenseBarChart } from "@/components/DashBoard/Pos/RevenueExpenseBarChart";
import Welcome from "@/components/DashBoard/Pos/Welcome";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
};

export type Order = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string | null;
  total_price: number;
  status: "pending" | "processing" | "delivered";
  created_at: string; // ISO timestamp
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number; // generated: quantity * unit_price
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  created_at: string;
};

interface ChickenData {
  id: string;
  title: string;
  chicken: number;
  created_at: string; // Make sure your table has timestamps
}

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ChickenData[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    setLoading(true);
    const query = supabase
      .from("orders")
      .select(`*,order_items(*)`)
      .eq("status", "delivered")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to fetch orders", { description: error.message });
    } else {
      setOrders(data as OrderWithItems[]);
    }
    setLoading(false);
  };

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const fetchChickenStats = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("chicken_stats").select("*");

    if (error) {
      console.error("Error fetching stats", error);
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchChickenStats();
  }, []);

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-4 items-center">
        <NewOrder title="Add Sale" />
        <AddExpense onRefetch={fetchExpenses} />
      </div>
      <div className="flex gap-5 flex-col lg:flex-row">
        <div className="grid grid-cols-2 gap-5 w-full">
          <Welcome profile={profile} />
          <ProfitCard />
          {stats.map((stat) => (
            <DetailCards
              key={stat.title}
              onRefetch={fetchChickenStats}
              stats={stat}
            />
          ))}
        </div>

        <FeedingPieChart />
      </div>
      <div className="flex gap-5 w-full flex-col lg:flex-row">
        <RevenueExpenseBarChart />
        <ProfitBarChart />
      </div>
      <div className="flex w-full gap-5 flex-col lg:flex-row">
        <ExpenseCard expenses={expenses} />
        <RevenueCard orders={orders} />
      </div>
    </div>
  );
};

export default HomePage;
