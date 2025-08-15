import { useAuth } from "@/context/AuthProvider";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (role !== "admin") {
        navigate("/unauthorized");
      }
    }
  }, [user, role, loading, navigate]);

  return <>{children}</>;
};

export default RequireAdmin;
