import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";

type Tx = { id:number; userId:number; amount:string; type:string; createdAt:string; user?: { id:number; email:string } };

export default function AdminTransactions() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminApi.getTransactions().then(r => setRows(r.data)).catch(e=>setErr(e?.response?.data?.message || "Ошибка")).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div>Загрузка…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Транзакции</h2>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.id}</td>
                <td className="p-2">{t.user?.email || t.userId}</td>
                <td className="p-2">{t.amount}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}