import { useAuth } from "@/context/AuthProvider";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role === "admin") {
      navigate("/dashboard");
    }
  }, [role]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">401</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! You are not an admin.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
