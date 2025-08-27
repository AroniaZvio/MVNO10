import { useState } from "react";
import { Link } from "react-router-dom";
import { usePlans, useConnectedPlan } from "../hooks/usePlans";

export default function Plans() {
  const { plans, loading, error } = usePlans();
  const { connectedPlan } = useConnectedPlan();
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="block group">
            {/* Логотип на всю ширину */}
            <div className="h-12 w-auto max-w-[200px] group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo/logo.png" 
                alt="Mobilive Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {/* Dropdown меню для Услуги */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
               <button className="flex items-center gap-1 text-slate-700 hover:transition-colors relative after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all hover:after:bg-[#1C9C94]">
                 Услуги
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающее меню Услуги - 2 колонки */}
              <div className={`absolute top-full left-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                isServicesDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="grid grid-cols-2 gap-0">
                  {/* Колонка 1 - Основные услуги */}
                  <div className="p-4 border-r border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Основные услуги</h4>
                    
                    <Link 
                      to="/numbers" 
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                        📱
                      </div>
                      <div>
                        <div className="font-medium">Телефонные номера</div>
                        <div className="text-xs text-slate-500">Красивые и простые номера</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/esim" 
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                        📟
                      </div>
                      <div>
                        <div className="font-medium">eSIM</div>
                        <div className="text-xs text-slate-500">Виртуальные SIM-карты</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/sms" 
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                        💬
                      </div>
                      <div>
                        <div className="font-medium">SMS</div>
                        <div className="text-xs text-slate-500">Сообщения и рассылки</div>
                      </div>
                    </Link>
                  </div>

                  {/* Колонка 2 - Для бизнеса */}
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Для бизнеса</h4>
                    
                    <Link 
                      to="/virtual-pbx" 
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                        🏢
                      </div>
                      <div>
                        <div className="font-medium">Виртуальная АТС</div>
                        <div className="text-xs text-slate-500">Корпоративная телефония</div>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/crm" 
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                        📊
                      </div>
                      <div>
                        <div className="font-medium">CRM</div>
                        <div className="text-xs text-slate-500">Управление клиентами</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-white hover:shadow-lg transition-all duration-200 font-medium"
              style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 4px 14px rgba(10, 123, 117, 0.25)'}}
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Тарифные планы</h1>
          <p className="text-slate-600">Выберите подходящий тариф для ваших потребностей</p>
          
          {/* Кнопка тестирования API */}
          <div className="mt-4">
            <button
              onClick={async () => {
                const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mobilive.ge';
                const token = localStorage.getItem('token');
                console.log('🔧 Testing API connection...');
                console.log('API URL:', API_URL);
                console.log('Token present:', !!token);
                
                try {
                  const response = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                  });
                  console.log('Response status:', response.status);
                  const data = await response.json();
                  console.log('Response data:', data);
                  alert(`API тест: ${response.status} - ${JSON.stringify(data)}`);
                } catch (err: any) {
                  console.error('API test failed:', err);
                  alert(`API тест failed: ${err.message || err}`);
                }
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              🔧 Тест API
            </button>
          </div>
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
              const isConnecting = false; // Removed connectingPlanId state, so always false
              
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
                        onClick={() => {
                          // handleConnectPlan(plan); // Removed handleConnectPlan
                          alert(`Подключение тарифа "${plan.name}" пока не реализовано.`);
                        }}
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