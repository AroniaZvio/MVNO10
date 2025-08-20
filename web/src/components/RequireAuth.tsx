import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { setToken } from "../lib/api";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const hasToken = !!localStorage.getItem("token");
  if (!hasToken) return <Navigate to="/login" replace />;
  // Проставляем токен в axios по умолчанию, чтобы защищённые страницы работали сразу
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    setToken(token);
  }, []);
  return <>{children}</>;
}
