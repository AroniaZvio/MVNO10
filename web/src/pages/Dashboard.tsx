import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';
import PhoneNumbersTable, { type PhoneNumberRow } from '../components/PhoneNumbersTable';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
import { loadMyNumbers, markPaidMyNumber, removeMyNumber, type MyNumber } from '../lib/myNumber';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  phoneNumber?: string;
}

interface DashboardData {
  user: User;
  connectedNumbers: any[];
  availableNumbers: any[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 🧪 MVP ТЕСТОВЫЙ РЕЖИМ
  // Для новых пользователей баланс устанавливаем 500$ для тестирования
  const testBalance = 500;
  
  // Функция для получения актуального баланса из localStorage
  const getCurrentBalance = () => {
    const savedBalance = localStorage.getItem('userBalance');
    // Если баланс не установлен, значит это новый пользователь - устанавливаем 500$
    if (savedBalance === null) {
      return testBalance;
    }
    return parseInt(savedBalance, 10);
  };
  
  // Функция для загрузки данных кабинета
  const refetch = async () => {
    try {
      const r = await api.get("/users/me/dashboard");
      // Устанавливаем актуальный баланс из localStorage
      const currentBalance = getCurrentBalance();
      const dataWithCurrentBalance = {
        ...r.data,
        user: {
          ...r.data.user,
          balance: currentBalance
        }
      };
      setData(dataWithCurrentBalance);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // При ошибке создаем тестовые данные с актуальным балансом
      const currentBalance = getCurrentBalance();
      setData({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Тестовый пользователь',
          balance: currentBalance
        },
        connectedNumbers: [],
        availableNumbers: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    // Для MVP тестирования: новые пользователи начинают с баланса 500$
    if (!localStorage.getItem('userBalance')) {
      localStorage.setItem('userBalance', testBalance.toString());
    }
    
    refetch();
  }, []);
  
  // Слушаем обновления баланса и подключенных номеров
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { newBalance, connectedNumber } = event.detail;
      
      // Обновляем баланс
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, balance: newBalance }
      } : prev);
      
      // Если есть новый подключенный номер, добавляем его в myNumbers
      if (connectedNumber) {
        const now = Date.now();
        const newNumber: MyNumber = {
          id: connectedNumber.id,
          mobileNumber: connectedNumber.mobileNumber,
          countryName: connectedNumber.countryName,
          countryCode: connectedNumber.countryCode,
          status: 'paid',
          reservedAt: now,
          expiresAt: null
        };
        
        setMyNumbers(prev => [...prev, newNumber]);
        
        // Уведомляем другие компоненты
        window.dispatchEvent(new Event('my-numbers-updated'));
      }
    };
    
    window.addEventListener('balance-updated', handleBalanceUpdate as EventListener);
    return () => window.removeEventListener('balance-updated', handleBalanceUpdate as EventListener);
  }, []);

  function computeDisplayName(me: { firstName?: string | null; lastName?: string | null; username?: string | null; email: string; }): string {
    const first = (me.firstName || '').trim();
    const last = (me.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (me.username && me.username.trim()) return me.username.trim();
    return me.email;
  }

  // Функция пополнения баланса
  async function topup(amount: number) {
    if (!data) return;
    
    // оптимистичное обновление
    setData(prev => prev ? { 
      ...prev, 
      user: { ...prev.user, balance: (prev.user.balance ?? 0) + amount } 
    } : prev);
    
    try {
      // Для тестирования просто обновляем локально
      // await api.post("/billing/topup", { amount });
      // await refetch(); // подтверждение с сервера (гарантируем синхрон с БД)
      
      // Тестовый режим - обновляем локально и в localStorage
      const newBalance = (data?.user.balance ?? 0) + amount;
      localStorage.setItem('userBalance', newBalance.toString());
      
      setTimeout(() => {
        setData(prev => prev ? { 
          ...prev, 
          user: { ...prev.user, balance: newBalance } 
        } : prev);
      }, 500);
    } catch (error) {
      console.error("Topup failed:", error);
      // await refetch(); // откат к фактическому состоянию БД при ошибке
    }
  }

  // Состояние для выпадающих меню
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isPbxDropdownOpen, setIsPbxDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Мои номера (оплаченные и забронированные)
  const [myNumbers, setMyNumbers] = useState<MyNumber[]>(loadMyNumbers());
  const [publicNumbers, setPublicNumbers] = useState<PhoneNumberRow[]>([]);
  const [publicErr, setPublicErr] = useState<string | null>(null);

  async function loadPublicNumbers() {
    try {
      const r = await fetch(`${API}/api/phone-numbers/public`);
      if (!r.ok) throw new Error('Не удалось получить список номеров');
      setPublicNumbers(await r.json());
      setPublicErr(null);
    } catch (e: unknown) {
      const err = e as { message?: string } | undefined;
      setPublicErr(err?.message ?? String(e ?? 'Не удалось получить список номеров'));
    }
  }

  const handleLogout = () => {
    // Очищаем данные пользователя при выходе
    localStorage.removeItem('userBalance');
    localStorage.removeItem('mvno_my_numbers');
    localStorage.removeItem('accessToken');
    
    setToken(undefined);
    navigate('/');
  };

  // Подписываемся на изменения подключённых номеров (локально)
  useEffect(() => {
    const refresh = () => setMyNumbers(loadMyNumbers());
    refresh();
    const onUpdate = () => { refresh(); };
    window.addEventListener('my-numbers-updated', onUpdate);
  loadPublicNumbers();
    return () => window.removeEventListener('my-numbers-updated', onUpdate);
  }, []);

  const paidNumbers = myNumbers.filter(n => n.status === 'paid');
  const reservedNumbers = myNumbers.filter(n => n.status === 'reserved');

  function handleConnect(id: number) {
    markPaidMyNumber(id);
    setMyNumbers(loadMyNumbers());
  }

  function handleCancel(id: number) {
    removeMyNumber(id);
    setMyNumbers(loadMyNumbers());
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Загрузка…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo/logo.png" 
                  alt="Mobilive" 
                  className="h-8"
                />
              </Link>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {/* Мои услуги */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-slate-700 hover:text-teal-600 transition-colors">
                    Мои услуги
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                    isServicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="py-2">
                      <Link to="/call-from-site" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>📞</div>
                        <div>
                          <div className="font-medium">Звонить с сайта</div>
                          <div className="text-xs text-slate-500">Исходящие звонки</div>
                        </div>
                      </Link>
                      <Link to="/add-number" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>📱</div>
                        <div>
                          <div className="font-medium">Подключить номер</div>
                          <div className="text-xs text-slate-500">Новые номера</div>
                        </div>
                      </Link>
                      <Link to="/esim-travel" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>📱</div>
                        <div>
                          <div className="font-medium">eSIM для путешествий</div>
                          <div className="text-xs text-slate-500">Роуминг</div>
                        </div>
                      </Link>
                      <Link to="/sms-broadcast" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>💬</div>
                        <div>
                          <div className="font-medium">SMS рассылка</div>
                          <div className="text-xs text-slate-500">Массовые сообщения</div>
                        </div>
                      </Link>
                      <Link to="/callback" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>↩️</div>
                        <div>
                          <div className="font-medium">Обратный звонок</div>
                          <div className="text-xs text-slate-500">Входящие заявки</div>
                        </div>
                      </Link>
                      <Link to="/hlr-check" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>📋</div>
                        <div>
                          <div className="font-medium">Актуализация контактов (HLR)</div>
                          <div className="text-xs text-slate-500">Проверка номеров</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Настройки */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsSettingsDropdownOpen(true)}
                  onMouseLeave={() => setIsSettingsDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-slate-700 hover:text-teal-600 transition-colors">
                    Настройки
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                    isSettingsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="py-2">
                      <Link to="/sip-settings" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>📡</div>
                        <div>
                          <div className="font-medium">Подключение по SIP</div>
                          <div className="text-xs text-slate-500">Настройки протокола</div>
                        </div>
                      </Link>
                      <Link to="/virtual-numbers" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>🔢</div>
                        <div>
                          <div className="font-medium">Виртуальные номера</div>
                          <div className="text-xs text-slate-500">Управление номерами</div>
                        </div>
                      </Link>
                      <Link to="/api-integrations" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>🔗</div>
                        <div>
                          <div className="font-medium">Интеграции и API</div>
                          <div className="text-xs text-slate-500">Разработчикам</div>
                        </div>
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>👤</div>
                        <div>
                          <div className="font-medium">Мой профиль</div>
                          <div className="text-xs text-slate-500">Личные данные</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Мой счет */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsAccountDropdownOpen(true)}
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-slate-700 hover:text-teal-600 transition-colors">
                    Мой счет
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                    isAccountDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="py-2">
                      <Link to="/call-statistics" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>📊</div>
                        <div>
                          <div className="font-medium">Статистика звонков</div>
                          <div className="text-xs text-slate-500">Отчеты и аналитика</div>
                        </div>
                      </Link>
                      <Link to="/payments-expenses" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>💰</div>
                        <div>
                          <div className="font-medium">Пополнения и расходы</div>
                          <div className="text-xs text-slate-500">История операций</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Мой АТС */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsPbxDropdownOpen(true)}
                  onMouseLeave={() => setIsPbxDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-slate-700 hover:text-teal-600 transition-colors">
                    Мой АТС
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isPbxDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                    isPbxDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="py-2">
                      <Link to="/internal-numbers" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>🏢</div>
                        <div>
                          <div className="font-medium">Внутренние номера</div>
                          <div className="text-xs text-slate-500">Корпоративная телефония</div>
                        </div>
                      </Link>
                      <Link to="/pbx-features" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>🎙️</div>
                        <div>
                          <div className="font-medium">Запись, распознавание речи, переадресация</div>
                          <div className="text-xs text-slate-500">Дополнительные функции</div>
                        </div>
                      </Link>
                      <Link to="/call-history" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>📞</div>
                        <div>
                          <div className="font-medium">История звонков</div>
                          <div className="text-xs text-slate-500">Детализация</div>
                        </div>
                      </Link>
                      <Link to="/external-lines" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>📡</div>
                        <div>
                          <div className="font-medium">Внешние линии</div>
                          <div className="text-xs text-slate-500">Подключения</div>
                        </div>
                      </Link>
                      <Link to="/pbx-statistics" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to right, #1C9C94, #0A7B75)`}}>📈</div>
                        <div>
                          <div className="font-medium">Статистика</div>
                          <div className="text-xs text-slate-500">Аналитика АТС</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-slate-600">
                Мой баланс: <span className="font-bold" style={{color: '#0A7B75'}}>${data.user.balance?.toLocaleString() ?? 0}</span>
              </div>
              
              <div 
                className="relative"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>
                    {(computeDisplayName(data.user) || 'U').charAt(0)}
                  </div>
                  <span className="hidden md:block font-medium">{computeDisplayName(data.user) || 'Профиль'}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                  isUserDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">👤</div>
                      <div>
                        <div className="font-medium">Мой профиль</div>
                        <div className="text-xs text-slate-500">Настройки аккаунта</div>
                      </div>
                    </Link>
                    <Link to="/topup" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-sm">💳</div>
                      <div>
                        <div className="font-medium">Пополнить счет</div>
                        <div className="text-xs text-slate-500">Баланс: ${data.user.balance?.toLocaleString() ?? 0}</div>
                      </div>
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-sm">🚪</div>
                      <div>
                        <div className="font-medium">Выйти из системы</div>
                        <div className="text-xs text-slate-500">Завершить сеанс</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Личный кабинет - основная информация */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">Личный кабинет</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-slate-500">Email:</div>
                <div className="font-medium">{data.user.email}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Баланс:</div>
                <div className="font-bold text-lg" style={{color: '#0A7B75'}}>${data.user.balance?.toLocaleString() ?? 0}</div>
          </div>
        </div>

          </div>
        </section>

        {/* Connected Numbers Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="block">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Подключенные номера</h2>
                {myNumbers.length > 0 ? (
                  <div className="space-y-3">
                    {/* Оплаченные */}
                    {paidNumbers.map(n => (
                      <div key={n.id} className="w-full grid grid-cols-[1fr_auto] items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-2xl font-mono font-bold" style={{color: '#0A7B75'}}>
                            {n.mobileNumber}
                          </div>
                          <span className="text-sm text-slate-500">{n.countryName} {n.countryCode}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => handleCancel(n.id)}
                            className="px-4 py-2 rounded-xl font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors"
                          >
                            Отменить
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Забронированные */}
                    {reservedNumbers.map(n => (
                      <div key={n.id} className="w-full grid grid-cols-[1fr_auto] items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-2xl font-mono font-bold" style={{color: '#0A7B75'}}>
                            {n.mobileNumber}
                          </div>
                          <span className="text-sm text-slate-500">{n.countryName} {n.countryCode}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => handleConnect(n.id)}
                            className="px-4 py-2 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                          >
                            Подключить
                          </button>
                          <button
                            onClick={() => handleCancel(n.id)}
                            className="px-4 py-2 rounded-xl font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors"
                          >
                            Отменить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-600">Ни одного номера не подключено</div>
                )}
              </div>
              
              {/* Кнопка справа убрана по требованию */}
            </div>
          </div>
        </div>

        {/* Available Numbers Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Доступные номера</h2>
            {publicErr && <div className="text-red-600 mb-4">{publicErr}</div>}
            <PhoneNumbersTable
              rows={publicNumbers}
              readOnly={true}
              actionLabel={'Подключить номер'}
              onBuy={(row) => {
                // navigate to connect page with selected number
                navigate('/connect-number', { 
                  state: { 
                    id: row.id, 
                    mobileNumber: row.mobileNumber,
                    connectionFee: row.connectionFee,
                    monthlyFee: row.monthlyFee,
                    countryName: row.countryName,
                    countryCode: row.countryCode
                  } 
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <img 
                src="/logo/logo.png" 
                alt="Mobilive" 
                className="h-8 mb-4 filter brightness-0 invert"
              />
              <h3 className="text-lg font-semibold mb-4">О компании Mobilive</h3>
              <p className="text-slate-300 mb-4">
                Mobilive — современная MVNO платформа, предоставляющая полный спектр телекоммуникационных услуг. 
                Мы помогаем запускать виртуальных мобильных операторов с использованием передовых технологий.
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <div>📧 Email: info@mobilive.ru</div>
                <div>📞 Телефон: +7 (495) 123-45-67</div>
                <div>📍 Адрес: г. Москва, ул. Технологическая, д. 10, стр. 1</div>
                <div>🕒 Режим работы: Пн-Пт 9:00-18:00</div>
              </div>
            </div>

            {/* Legal Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Юридическая информация</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <div>ООО "Мобилайв"</div>
                <div>ИНН: 7704123456</div>
                <div>КПП: 770401001</div>
                <div>ОГРН: 1234567890123</div>
                <div>Лицензия: №123456 от 01.01.2020</div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Полезные ссылки</h4>
              <div className="space-y-2">
                <Link to="/support" className="block text-slate-300 hover:text-white transition-colors">Техподдержка</Link>
                <Link to="/docs" className="block text-slate-300 hover:text-white transition-colors">Документация API</Link>
                <Link to="/privacy" className="block text-slate-300 hover:text-white transition-colors">Политика конфиденциальности</Link>
                <Link to="/terms" className="block text-slate-300 hover:text-white transition-colors">Пользовательское соглашение</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Mobilive. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;