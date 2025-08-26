import { useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password || !passwordRepeat) {
      setMsg("Заполните все поля");
      return;
    }
    if (password !== passwordRepeat) {
      setMsg("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const payload = { email: email.trim(), username: username.trim(), password } as const;
      const r = await api.post("/auth/register", payload);
      
      // Очищаем данные предыдущего пользователя при регистрации
      localStorage.removeItem('userBalance');
      localStorage.removeItem('mvno_my_numbers');
      localStorage.removeItem('accessToken');
      
      // Для MVP тестирования: устанавливаем начальный баланс 500$ для нового пользователя
      localStorage.setItem('userBalance', '500');
      
      setMsg(r.data.message || "Мы отправили письмо для подтверждения. Проверьте почту.");
    } catch (e:any) {
      setMsg(e?.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{color: '#0A7B75'}}>Мобильная связь</h1>
            <p className="text-slate-600">Решения нового поколения <span style={{color:'#1C9C94'}}>для MVNO</span></p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-1" style={{color:'#0A7B75'}}>Создать аккаунт</h2>
            <p className="text-sm text-slate-500 mb-6">Заполните поля ниже, чтобы зарегистрироваться</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                <input
                  className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 p-3 rounded-xl outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Имя пользователя</label>
                <input
                  className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 p-3 rounded-xl outline-none transition"
                  placeholder="username"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Пароль</label>
                <input
                  className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 p-3 rounded-xl outline-none transition"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Подтверждение пароля</label>
                <input
                  className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 p-3 rounded-xl outline-none transition"
                  placeholder="••••••••"
                  type="password"
                  value={passwordRepeat}
                  onChange={e=>setPasswordRepeat(e.target.value)}
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl text-white font-medium py-3 shadow-md hover:shadow-lg transition disabled:opacity-60"
                style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                type="submit"
              >
                {loading ? 'Отправка...' : 'Зарегистрироваться'}
              </button>
            </form>

            {msg && (
              <div className={`mt-4 p-4 rounded-xl text-sm ${
                msg.includes('успешно') || msg.includes('почту') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {msg}
                {msg.includes('успешно') && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-green-600 font-medium">
                      📧 Что дальше?
                    </div>
                    <div className="text-xs text-green-600 space-y-1">
                      <p>• Проверьте почту и найдите письмо от Mobilive</p>
                      <p>• Нажмите на ссылку для подтверждения email</p>
                      <p>• После подтверждения вы сможете войти в систему</p>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700">
                        💡 Не получили письмо? Проверьте папку "Спам" или запросите повторную отправку на странице входа
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="mt-4 text-sm text-slate-600 text-center">
              Уже есть аккаунт? <Link to="/login" className="font-medium" style={{color:'#1C9C94'}}>Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}