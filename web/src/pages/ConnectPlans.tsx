import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavigation from "../components/DashboardNavigation";
import { usePlans, useConnectedPlan, type Plan } from "../hooks/usePlans";

export default function ConnectPlans() {
  const navigate = useNavigate();
  const { plans, loading, error } = usePlans();
  const { connectedPlan, connectPlan } = useConnectedPlan();
  const [connectingPlanId, setConnectingPlanId] = useState<number | null>(null);

  const handleConnectPlan = async (plan: Plan) => {
    try {
      setConnectingPlanId(plan.id);
      console.log('🚀 Starting plan connection for plan:', plan);
      
      await connectPlan(plan.id);
      
      // Показываем уведомление об успехе
      alert(`Тариф "${plan.name}" успешно подключен!`);
      
      // Перенаправляем обратно в дашборд
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Plan connection failed:', error);
      alert(`Ошибка подключения тарифа: ${error.message}`);
    } finally {
      setConnectingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Назад в дашборд
            </a>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Подключить тариф</h1>
          <p className="text-slate-600">Выберите и подключите подходящий тариф для ваших потребностей</p>
        </div>

        {/* Информация о текущем тарифе */}
        {connectedPlan && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-green-500 text-lg">✅</div>
              <div>
                <div className="font-medium text-green-800">Текущий тариф: {connectedPlan.planName}</div>
                <div className="text-sm text-green-700">
                  {connectedPlan.planDataMb} MB данных, {connectedPlan.planMinutes} минут, {connectedPlan.planSms} SMS
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-4">⏳</div>
            <div className="text-slate-600">Загрузка тарифных планов...</div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-4">📋</div>
            <div className="text-slate-600">Тарифов пока нет</div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map(plan => {
              const isConnected = connectedPlan?.planId === plan.id;
              const isConnecting = connectingPlanId === plan.id;
              
              return (
                <div key={plan.id} className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden ${
                  isConnected ? 'border-green-300 bg-green-50' : 'border-slate-200'
                }`}>
                  {isConnected && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-green-500"></div>
                  )}
                  {!isConnected && (
                    <div className="absolute inset-x-0 top-0 h-1" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}></div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                      <div className="text-2xl font-bold" style={{color: '#0A7B75'}}>{plan.price} $</div>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{plan.description || '—'}</p>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>📶 Данные: <span className="font-medium">{plan.dataMb} MB</span></li>
                      <li>📞 Минуты: <span className="font-medium">{plan.minutes}</span></li>
                      <li>💬 SMS: <span className="font-medium">{plan.sms}</span></li>
                    </ul>
                    
                    {isConnected ? (
                      <div className="mt-6 p-3 bg-green-100 text-green-800 rounded-lg text-center text-sm font-medium">
                        ✅ Подключен
                      </div>
                    ) : (
                      <button
                        className="mt-6 w-full px-4 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                        onClick={() => handleConnectPlan(plan)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? '⏳ Подключение...' : 'Подключить тариф'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
