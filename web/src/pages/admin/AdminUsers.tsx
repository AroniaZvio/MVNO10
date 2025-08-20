import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";

type UserRow = { id:number; email:string; role:string; isActive:boolean; createdAt:string; updatedAt:string };

export default function AdminUsers() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    adminApi.getUsers().then(r => setRows(r.data)).catch(e=>setErr(e?.response?.data?.message || "Ошибка")).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, []);

  async function toggle(id:number, v:boolean) {
    await adminApi.setUserStatus(id, v);
    load();
  }

  if (loading) return <div>Загрузка…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Пользователи</h2>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Active</th>
              <th className="text-left p-2">Created</th>
              <th className="p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.isActive ? "Yes" : "No"}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <button onClick={()=>toggle(u.id, !u.isActive)} className="px-3 py-1 rounded border">
                    {u.isActive ? "Заблокировать" : "Разблокировать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}