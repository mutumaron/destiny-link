import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "admin" | "user" | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedRole = localStorage.getItem("user_role") as
      | "admin"
      | "user"
      | null;
    if (cachedRole) {
      setRole(cachedRole);
    }

    const getSessionAndProfile = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.error("Error fetching role:", error.message);
          setRole(null);
          localStorage.removeItem("user_role");
        } else {
          setRole(profile.role);
          localStorage.setItem("user_role", profile.role);
        }
      }

      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", currentUser.id)
              .single();

            if (!error && profile) {
              setRole(profile.role);
            } else {
              setRole(null);
            }
          } else {
            setRole(null);
          }

          setLoading(false);
        }
      );
      return () => {
        listener.subscription.unsubscribe();
      };
    };

    getSessionAndProfile();
  }, []);
  return (
    <AuthContext.Provider value={{ user, session, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
