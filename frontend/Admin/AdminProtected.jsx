import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../src/components/New folder/Loading";

const AdminProtected = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/verify`, {
            method : "GET",
            credentials: "include", // important for cookies
        });
        const data = await res.json();
        console.log(data);
        setIsAdmin(data.valid);
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) return <LoadingSpinner/>;
  if (!isAdmin) return <Navigate to = {"/admin/login"}/>;
  

  return <Outlet/>;
};

export default AdminProtected;
