import { useEffect, useState } from "react";
import { api } from "../lib/api";
import SiteHeader from "../components/SiteHeader";

type Plan = { id:number; name:string; description?:string; price:string; dataMb:number; minutes:number; sms:number };

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/plans");
        setPlans(r.data as Plan[]);
      } catch (e:any) {
        setError(e?.response?.data?.message || "Не удалось загрузить тарифы");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <SiteHeader />
      <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Тарифы</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div className="text-slate-500">Загрузка…</div>
      ) : plans.length === 0 ? (
        <div className="text-slate-500">Тарифов пока нет</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(p => (
            <div key={p.id} className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}></div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                  <div className="text-2xl font-bold" style={{color: '#0A7B75'}}>{p.price} $</div>
                </div>
                <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{p.description || '—'}</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>📶 Данные: <span className="font-medium">{p.dataMb} MB</span></li>
                  <li>📞 Минуты: <span className="font-medium">{p.minutes}</span></li>
                  <li>💬 SMS: <span className="font-medium">{p.sms}</span></li>
                </ul>
                <button
                  className="mt-6 w-full px-4 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                >
                  Выбрать план
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}