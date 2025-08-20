import { useEffect, useState } from "react";
import { api, setToken } from "../lib/api";

export default function TopUp() {
  const [amount, setAmount] = useState<string>("10.00");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Подхватываем токен из localStorage, чтобы Authorization отправлялся автоматически
    const token = localStorage.getItem("token") || "";
    setToken(token);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const r = await api.post("/topup", { amount: Number(amount) });
      setMsg(`✅ Пополнение успешно. Новый баланс: ${r.data.balance}`);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Ошибка пополнения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Пополнение баланса</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          Сумма ($)
          <input
            className="mt-1 border p-2 rounded w-full"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10.00"
          />
        </label>
        <button
          disabled={loading}
          className="bg-black text-white rounded py-2 disabled:opacity-60"
        >
          {loading ? "Обработка..." : "Пополнить (MVP)"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm">{msg}</p>}

      <p className="mt-6 text-xs text-zinc-500">
        * Вариант MVP: имитация успешного платежа на бэкенде без провайдера.
      </p>
    </div>
  );
}
