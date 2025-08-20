import { useState } from "react";
import { api } from "../lib/api";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await api.post("/auth/forgot-password", { email });
      setMsg(r.data.message || "If email exists, reset link sent.");
    } catch (e:any) {
      setMsg(e?.response?.data?.message || "Error");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Восстановление пароля</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="bg-black text-white rounded py-2">Отправить ссылку</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  )
}