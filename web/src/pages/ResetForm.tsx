import { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function ResetForm() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    setToken(t);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await api.post("/auth/reset-password", { token, newPassword });
      setMsg(r.data.message || "Password updated");
    } catch (e:any) {
      setMsg(e?.response?.data?.message || "Error");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Новый пароль</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" type="password" placeholder="Новый пароль" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <button className="bg-black text-white rounded py-2">Сохранить</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  )
}