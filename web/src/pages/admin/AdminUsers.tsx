import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";

type UserRow = { id:number; email:string; role:string; isActive:boolean; createdAt:string; updatedAt:string };

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AdminUsers() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; email: string } | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.getUsers().then(r => setRows(r.data)).catch(e=>setErr(e?.response?.data?.message || "Ошибка")).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, []);

  async function toggle(id:number, v:boolean) {
    await adminApi.setUserStatus(id, v);
    load();
  }

  async function deleteUser(id: number) {
    try {
      await adminApi.deleteUser(id);
      setDeleteConfirm(null);
      load();
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as ApiError).response?.data?.message 
        : "Ошибка при удалении пользователя";
      setErr(errorMessage || "Ошибка при удалении пользователя");
    }
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
                  <div className="flex gap-2">
                    <button 
                      onClick={()=>toggle(u.id, !u.isActive)} 
                      className="px-3 py-1 rounded border hover:bg-gray-50"
                    >
                      {u.isActive ? "Заблокировать" : "Разблокировать"}
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ id: u.id, email: u.email })}
                      className="px-3 py-1 rounded border bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Диалог подтверждения удаления */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Подтверждение удаления</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить пользователя <strong>{deleteConfirm.email}</strong>?
              <br />
              <span className="text-red-600 text-sm">Это действие нельзя отменить!</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm.id)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}