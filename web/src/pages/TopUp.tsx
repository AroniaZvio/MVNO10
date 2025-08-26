import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { billingApi } from "../lib/api";

export default function TopUp() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("10.00");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    
    try {
      // Конвертируем сумму в центы для API
      const amountInCents = Math.round(Number(amount) * 100);
      
      if (amountInCents <= 0) {
        setMsg("Сумма должна быть больше 0");
        return;
      }
      
      const result = await billingApi.topup(amountInCents);
      
      setMsg(`✅ Пополнение успешно. Новый баланс: $${(result.balance / 100).toFixed(2)}`);
      
      // Уведомляем другие компоненты об обновлении баланса
      window.dispatchEvent(new CustomEvent('balance-updated', {
        detail: { newBalance: result.balance }
      }));
      
      // Очищаем форму
      setAmount("10.00");
      
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || "Ошибка пополнения";
      setMsg(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center">
                <img 
                  src="/logo/logo.png" 
                  alt="Mobilive" 
                  className="h-8"
                />
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              ← Назад в кабинет
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Пополнение баланса</h1>
            <p className="text-slate-600">Пополните ваш счет для использования услуг</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Сумма пополнения ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                <input
                  className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10.00"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Минимальная сумма: $0.01
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-white font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200"
              style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
            >
              {loading ? "⏳ Обработка..." : "💳 Пополнить баланс"}
            </button>
          </form>

          {msg && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${
              msg.startsWith('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {msg}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Способы пополнения</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-medium text-slate-900">Банковская карта</div>
                <div className="text-sm text-slate-600">Visa, MasterCard, МИР</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-2">🏦</div>
                <div className="font-medium text-slate-900">Банковский перевод</div>
                <div className="text-sm text-slate-600">Счет в банке</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-slate-900">Мобильный платеж</div>
                <div className="text-sm text-slate-600">SMS, USSD</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-2">💼</div>
                <div className="font-medium text-slate-900">Электронные кошельки</div>
                <div className="text-sm text-slate-600">QIWI, Яндекс.Деньги</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-lg">ℹ️</div>
              <div>
                <div className="font-medium text-blue-900 mb-1">Информация</div>
                <div className="text-sm text-blue-700">
                  Пополнение происходит мгновенно. Средства сразу доступны для использования услуг.
                  При возникновении вопросов обратитесь в службу поддержки.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
