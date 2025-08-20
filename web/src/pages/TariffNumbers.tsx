import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import SiteHeader from '../components/SiteHeader';

type Row = {
  id: number;
  countryName: string;
  countryCode: string; // пример: "+7"
  mobileNumber: string;
  number800?: string | null; // пример: "800" | "0800" | "1800"
  connectionFee: number;
  monthlyFee: number;
};

export default function TariffNumbers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'mobile' | 'tf'>('mobile');
  const [showYear, setShowYear] = useState(false);
  const [category, setCategory] = useState<'all'|'simple'|'gold'|'platinum'|'vip'>('all');

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get('/phone-numbers/public');
        setRows(r.data as Row[]);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Не удалось загрузить номера');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function getCategory(r: Row): 'simple'|'gold'|'platinum'|'vip' {
    const fee = r.connectionFee || 0;
    if (fee >= 10000) return 'vip';
    if (fee >= 5000) return 'platinum';
    if (fee >= 1500) return 'gold';
    return 'simple';
  }

  const mobile = useMemo(() => rows.filter(r => !!r.mobileNumber && !r.number800), [rows]);
  const tollfree = useMemo(() => rows.filter(r => !!r.number800), [rows]);
  const viewBase = tab === 'mobile' ? mobile : tollfree;
  const view = useMemo(() => {
    if (category === 'all') return viewBase;
    return viewBase.filter(r => getCategory(r) === category);
  }, [viewBase, category]);

  return (
    <div>
      <SiteHeader />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Телефонные номера</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex rounded-xl overflow-hidden border" style={{borderColor:'#1C9C94'}}>
            <button onClick={()=>setTab('mobile')} className={`px-4 py-2 text-sm font-medium ${tab==='mobile'?'text-white':'text-slate-700'}`} style={tab==='mobile'?{background: 'linear-gradient(to right, #0A7B75, #1C9C94)'}:{}}>
              Мобильные + SMS
            </button>
            <button onClick={()=>setTab('tf')} className={`px-4 py-2 text-sm font-medium ${tab==='tf'?'text-white':'text-slate-700'}`} style={tab==='tf'?{background: 'linear-gradient(to right, #0A7B75, #1C9C94)'}:{}}>
              Номера 800
            </button>
          </div>
          {/* Фильтр категории по цене подключения */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Категория</label>
            <select
              value={category}
              onChange={e=>setCategory(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Все категории</option>
              <option value="simple">Простые ($300)</option>
              <option value="gold">Золотые ($1500+)</option>
              <option value="platinum">Платиновые ($5000+)</option>
              <option value="vip">VIP ($10000+)</option>
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={!showYear? 'font-semibold text-slate-900':'text-slate-600'}>Месячная оплата</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="sr-only peer" checked={showYear} onChange={e=>setShowYear(e.target.checked)} />
              <div className="w-12 h-6 bg-slate-300 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
            </label>
            <span className={showYear? 'font-semibold text-slate-900':'text-slate-600'}>Оплата за год</span>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div className="text-slate-500">Загрузка…</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-amber-50">
              <tr>
                <th className="text-left px-4 py-3 w-28">Код</th>
                <th className="text-left px-4 py-3">Направление</th>
                <th className="text-left px-4 py-3 w-56">Плата за подключение</th>
                <th className="text-left px-4 py-3 w-56">Абонплата в месяц</th>
              </tr>
            </thead>
            <tbody>
              {view.map(r => (
                <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap">{tab==='tf' ? (r.number800 || '—') : r.countryCode}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* эмодзи-флаг можно добавить позже при наличии ISO кода */}
                      <span className="text-slate-900">{r.countryName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">${r.connectionFee}</td>
                  <td className="px-4 py-3">{showYear ? `$${r.monthlyFee * 12}` : `$${r.monthlyFee}`}</td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>Список пуст</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

