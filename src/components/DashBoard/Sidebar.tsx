"use client";

import {
  ArrowDownToLine,
  BusFront,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Home,
  Inbox,
  Package,
  Plus,
  Projector,
  Search,
  Settings,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { useEffect, useRef, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Skeleton } from "../ui/skeleton";

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
};

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Inbox,
  },
  {
    title: "Packages",
    url: "/dashboard/products",
    icon: Package,
  },

  {
    title: "History",
    url: "/dashboard/history",
    icon: ArrowDownToLine,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const DashBoardSideBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
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
    };

    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout!", {
        description: error.message,
      });
      setLoading(false);
    } else {
      localStorage.removeItem("user_role");
      toast.success("Succesfully logged out");
      setLoading(false);
    }
  };

  useEffect(() => {
    const div = ref.current;
    if (!div) return;

    const handleScroll = () => {
      div.classList.add("scrollbar-show");
      setTimeout(() => div.classList.remove("scrollbar-show"), 1000);
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to={"/"}>
                <span>Destiny Link</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent ref={ref} className="scrollbar-hide hover:scrollbar-show">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.title === "Bookings" && (
                    <SidebarMenuBadge>4</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {authLoading || !profile ? (
                    <Skeleton className="h-5 w-48" />
                  ) : (
                    <>
                      {profile.first_name} {profile.last_name}
                    </>
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashBoardSideBar;
