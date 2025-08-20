import { useEffect, useState } from "react";
import { api, setToken } from "../lib/api";

interface Me {
  id: number;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      // Гарантируем, что Authorization установлен перед запросом профиля
      const token = localStorage.getItem("token") || "";
      setToken(token);
      try {
        const r = await api.get("/users/me");
        setMe(r.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Ошибка загрузки профиля");
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Мой профиль</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {!me ? (
        <p>Загрузка...</p>
      ) : (
        <div className="space-y-2">
          <div><span className="text-slate-500">Email: </span>{me.email}</div>
          <div><span className="text-slate-500">Имя пользователя: </span>{me.username || "—"}</div>
          <div><span className="text-slate-500">Имя: </span>{me.firstName || "—"}</div>
          <div><span className="text-slate-500">Фамилия: </span>{me.lastName || "—"}</div>
        </div>
      )}
    </div>
  );
}

