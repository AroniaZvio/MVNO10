import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const tab = (p: string) => pathname === p ? "font-semibold underline" : "opacity-80";
  const isActiveTab = (p: string) => pathname === p || (p === '/admin' && pathname === '/admin');
  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Mobilive Admin</Link>
          <nav className="flex gap-5 text-sm">
            <Link to="/admin" className={isActiveTab('/admin') ? "font-semibold underline" : "opacity-80"}>Dashboard</Link>
            <Link to="/admin/users" className={tab("/admin/users")}>Users</Link>
            <Link to="/admin/plans" className={tab("/admin/plans")}>Plans</Link>
            <Link to="/admin/transactions" className={tab("/admin/transactions")}>Transactions</Link>
            <Link to="/admin/phone-numbers" className={tab("/admin/phone-numbers")}>Phone Numbers</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}