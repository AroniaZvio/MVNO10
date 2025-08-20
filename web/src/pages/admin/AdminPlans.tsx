import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";

type Plan = { id:number; name:string; description?:string; price:string; dataMb:number; minutes:number; sms:number };

export default function AdminPlans() {
  const [rows, setRows] = useState<Plan[]>([]);
  const [form, setForm] = useState<Partial<Plan>>({ name:"", description:"", price:"9.99", dataMb:1000, minutes:100, sms:50 });
  const [err, setErr] = useState("");

  const load = () => {
    // читаем публичный GET /plans (можно и админский, но публичный тоже ок)
    fetch("http://localhost:4000/api/plans").then(r=>r.json()).then(setRows).catch(()=>setErr("Ошибка загрузки планов"));
  };

  useEffect(() => { load(); }, []);

  async function createPlan(e: React.FormEvent) {
    e.preventDefault();
    await adminApi.createPlan({
      name: String(form.name),
      description: form.description || "",
      price: String(form.price || "0"),
      dataMb: Number(form.dataMb || 0),
      minutes: Number(form.minutes || 0),
      sms: Number(form.sms || 0),
    });
    setForm({ name:"", description:"", price:"9.99", dataMb:1000, minutes:100, sms:50 });
    load();
  }

  async function updatePlan(p: Plan) {
    await adminApi.updatePlan(p.id, p);
    load();
  }

  async function deletePlan(id:number) {
    await adminApi.deletePlan(id);
    load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Тарифы</h2>

      <form onSubmit={createPlan} className="grid gap-2 md:grid-cols-6 items-end">
        <input className="border p-2 rounded" placeholder="Name" value={form.name||""} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
        <input className="border p-2 rounded md:col-span-2" placeholder="Description" value={form.description||""} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        <input className="border p-2 rounded" placeholder="Price" value={form.price||""} onChange={e=>setForm(f=>({...f, price:e.target.value}))} />
        <input className="border p-2 rounded" placeholder="DataMb" value={form.dataMb||0} onChange={e=>setForm(f=>({...f, dataMb:Number(e.target.value)}))} />
        <input className="border p-2 rounded" placeholder="Minutes" value={form.minutes||0} onChange={e=>setForm(f=>({...f, minutes:Number(e.target.value)}))} />
        <input className="border p-2 rounded" placeholder="SMS" value={form.sms||0} onChange={e=>setForm(f=>({...f, sms:Number(e.target.value)}))} />
        <button className="bg-black text-white rounded py-2 md:col-span-6">Добавить тариф</button>
      </form>

      {err && <div className="text-red-600">{err}</div>}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Minutes</th>
              <th className="text-left p-2">SMS</th>
              <th className="p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">
                  <input className="border p-1 rounded w-40" defaultValue={p.name} onBlur={(e)=>updatePlan({ ...p, name: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-24" defaultValue={p.price} onBlur={(e)=>updatePlan({ ...p, price: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" defaultValue={p.dataMb} onBlur={(e)=>updatePlan({ ...p, dataMb: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" defaultValue={p.minutes} onBlur={(e)=>updatePlan({ ...p, minutes: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" defaultValue={p.sms} onBlur={(e)=>updatePlan({ ...p, sms: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <button onClick={()=>deletePlan(p.id)} className="px-3 py-1 rounded border">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}