import { useState } from "react";
import { api, setToken } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    setShowResend(false);
    try {
      const r = await api.post("/auth/login", { email, password });
      const token = r.data.token as string;
      const user = r.data.user;

      // Очищаем данные предыдущего пользователя при входе
      localStorage.removeItem('userBalance');
      localStorage.removeItem('mvno_my_numbers');

      // Для MVP тестирования: устанавливаем начальный баланс 500$ для нового пользователя
      localStorage.setItem('userBalance', '500');

      localStorage.setItem("token", token);
      setToken(token);

      // Перенаправляем админов в админ панель, обычных пользователей в dashboard
      if (user.role === 'ADMIN') {
        nav("/admin");
      } else {
        nav("/dashboard");
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || "Login error";
      if (errorMessage === "Email not verified") {
        setMsg("Email not verified. Check your email and follow the link to verify.");
        setShowResend(true);
      } else {
        setMsg(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!email.trim()) {
      setMsg("Enter email for resend");
      return;
    }

    setResendLoading(true);
    setMsg("");
    try {
      await api.post("/auth/resend-verification", { email: email.trim() });
      setMsg("Verification email sent again. Check your email.");
      setShowResend(false);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Error sending email");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="h-16 w-auto max-w-[200px] mx-auto">
              <img
                src="/logo/logo.png"
                alt="Mobilive Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Login form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl text-white font-semibold hover:shadow-xl disabled:opacity-50 transition-all duration-200"
              style={{ background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)' }}
            >
              {loading ? "Signing in..." : "🔐 Sign In"}
            </button>
          </form>

          {msg && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm">
              {msg}
              {showResend && (
                <div className="mt-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {resendLoading ? "Sending..." : "📧 Resend Email"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium underline" style={{ color: '#1C9C94' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0A7B75'} onMouseLeave={(e) => e.currentTarget.style.color = '#1C9C94'}>
                Register
              </Link>
            </p>

            <p className="text-sm">
              <Link
                to="/forgot-password"
                className="text-slate-500 underline transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#1C9C94'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                🔑 Forgot password?
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}