import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [msg, setMsg] = useState("Подтверждаем...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMsg("Отсутствует токен подтверждения");
      return;
    }
    (async () => {
      try {
        const r = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        setMsg(r.data?.message || "Email подтверждён. Теперь вы можете войти.");
      } catch (e: any) {
        setMsg(e?.response?.data?.message || "Ошибка подтверждения");
      }
    })();
  }, [params]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Подтверждение email</h2>
      <p className="mb-4">{msg}</p>
      <Link to="/login" className="underline">Перейти ко входу</Link>
    </div>
  );
}

