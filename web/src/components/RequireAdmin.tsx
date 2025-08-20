// D:\APP\MVNO10\web\src\guards\RequireAdmin.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import { setToken } from "../lib/api";

interface RequireAdminProps {
  children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAdmin(false);
          return;
        }

        // Проставляем токен (axios и т.п.)
        setToken(token);

        // Лучше использовать относительный путь, если настроен прокси: /api/users/me
        const res = await fetch("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const user = await res.json();
        setIsAdmin(user.role === "ADMIN");
      } catch (e) {
        console.error("Ошибка проверки админских прав:", e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Проверка прав доступа…</div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
