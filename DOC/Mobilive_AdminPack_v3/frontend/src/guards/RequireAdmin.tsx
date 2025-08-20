import { Navigate } from 'react-router-dom';

function useAuth() {
  const json = localStorage.getItem('user');
  try { return json ? JSON.parse(json) : null; } catch { return null; }
}

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}
