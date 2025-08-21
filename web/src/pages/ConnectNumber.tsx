import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { addPaidMyNumber } from '../lib/myNumber';

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  balance: number;
}

export default function ConnectNumber() {
  const navigate = useNavigate();
  const { state } = useLocation() as { 
    state?: { 
      id?: number; 
      mobileNumber?: string;
      connectionFee?: number;
      monthlyFee?: number;
      countryName?: string;
      countryCode?: string;
    } 
  };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const id = state?.id;
  const mobileNumber = state?.mobileNumber;
  const connectionFee = state?.connectionFee;
  const monthlyFee = state?.monthlyFee;
  const countryName = state?.countryName;
  const countryCode = state?.countryCode;
  
  // Функция для подключения номера
  const handleConfirmConnection = async () => {
    if (!user || !connectionFee || !monthlyFee || !mobileNumber) return;
    
    const totalCost = connectionFee + monthlyFee;
    
    if (user.balance < totalCost) {
      alert('Недостаточно средств для подключения номера');
      return;
    }
    
    // Списываем средства с баланса
    const newBalance = user.balance - totalCost;
    
    // Обновляем баланс в localStorage для синхронизации между компонентами
    localStorage.setItem('userBalance', newBalance.toString());
    
    // Обновляем локальное состояние
    setUser(prev => prev ? {
      ...prev,
      balance: newBalance
    } : null);
    
    // Создаем объект подключенного номера
    const connectedNumber = {
      id: Date.now(), // Временный ID для демонстрации
      mobileNumber: mobileNumber,
      countryName: countryName || '',
      countryCode: countryCode || '',
      status: 'paid' as const,
      connectionFee: connectionFee,
      monthlyFee: monthlyFee
    };
    
    // Сохраняем номер в localStorage используя функцию из myNumber.ts
    addPaidMyNumber({
      id: connectedNumber.id,
      mobileNumber: connectedNumber.mobileNumber,
      countryName: connectedNumber.countryName,
      countryCode: connectedNumber.countryCode
    });
    
    // Отправляем событие об обновлении баланса для Dashboard
    window.dispatchEvent(new CustomEvent('balance-updated', {
      detail: { 
        newBalance,
        connectedNumber: connectedNumber
      }
    }));
    
    // Показываем уведомление об успехе
    alert(`Номер ${mobileNumber} успешно подключен! Списано: $${totalCost.toLocaleString()}`);
    
    // Перенаправляем в Dashboard
    navigate('/dashboard');
  };

  // Загружаем данные пользователя
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get('/users/me');
        // Устанавливаем актуальный баланс из localStorage
        const savedBalance = localStorage.getItem('userBalance');
        // Для MVP тестирования: новые пользователи начинают с баланса 500$
        const currentBalance = savedBalance ? parseInt(savedBalance, 10) : 500;
        
        setUser({
          ...response.data,
          balance: currentBalance
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        // При ошибке создаем тестовые данные с актуальным балансом
        const savedBalance = localStorage.getItem('userBalance');
        // Для MVP тестирования: новые пользователи начинают с баланса 500$
        const currentBalance = savedBalance ? parseInt(savedBalance, 10) : 500;
        
        setUser({
          id: '1',
          email: 'test@example.com',
          firstName: 'Тестовый',
          lastName: 'Пользователь',
          username: 'testuser',
          balance: currentBalance
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  
  // Слушаем обновления баланса от других компонентов
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { newBalance } = event.detail;
      setUser(prev => prev ? { ...prev, balance: newBalance } : null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Загрузка…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Ошибка загрузки данных пользователя</div>
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
              <div className="flex items-center">
                <img 
                  src="/logo/logo.png" 
                  alt="Mobilive" 
                  className="h-8"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-slate-600">
                Мой баланс: <span className="font-bold" style={{color: '#0A7B75'}}>${user.balance?.toLocaleString() ?? 0}</span>
              </div>
              
              {/* Логотип и профиль пользователя */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>
                  {(computeDisplayName(user) || 'U').charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-slate-700">{computeDisplayName(user)}</div>
                  <div className="text-xs text-slate-500">Личный кабинет</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ← Назад в кабинет
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Подключение номера</h1>
          <p className="text-slate-600">Завершите подключение выбранного номера</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Block 1: Balance */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Баланс</h3>
            <div className="text-3xl font-bold" style={{color: '#0A7B75'}}>${user.balance?.toLocaleString() ?? 0}</div>
            <div className="mt-4">
              <button onClick={() => navigate('/topup')} className="px-4 py-2 rounded-xl text-white font-medium" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>Пополнить баланс</button>
            </div>
          </div>

          {/* Block 2: Personal data */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Личные данные</h3>
            <div className="text-sm text-slate-600">Имя: {computeDisplayName(user)}</div>
            <div className="text-sm text-slate-600">Email: {user.email}</div>
            <div className="text-sm text-slate-600">ID: {user.id}</div>
          </div>

          {/* Block 3: Connected numbers */}
          <div className="bg-white rounded-xl border shadow-sm p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Подключение номера</h3>
            {id ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-medium text-slate-700 mb-2">Вы подключаете номер:</div>
                  <div className="text-3xl font-mono font-bold" style={{color: '#0A7B75'}}>{mobileNumber ?? `#${id}`}</div>
                  {countryName && countryCode && (
                    <div className="text-sm text-slate-500 mt-1">{countryName} {countryCode}</div>
                  )}
                </div>
                
                {/* Информация о стоимости */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Стоимость подключения</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Подключение:</span>
                      <span className="font-semibold text-blue-900">${connectionFee?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Абонентская плата:</span>
                      <span className="font-semibold text-blue-900">${monthlyFee?.toLocaleString() ?? 0}/мес</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Итого за первый месяц:</span>
                      <span className="text-lg font-bold text-blue-900">${((connectionFee ?? 0) + (monthlyFee ?? 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Предупреждение о недостатке средств */}
                {user.balance < ((connectionFee ?? 0) + (monthlyFee ?? 0)) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-red-500 text-lg">⚠️</div>
                      <div>
                        <div className="font-medium text-red-800 mb-1">Недостаточно средств</div>
                        <div className="text-sm text-red-700">
                          Для подключения номера необходимо: ${((connectionFee ?? 0) + (monthlyFee ?? 0)).toLocaleString()}<br/>
                          Ваш баланс: ${user.balance?.toLocaleString() ?? 0}
                        </div>
                        <button 
                          onClick={() => navigate('/topup')} 
                          className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Пополнить баланс
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {user.balance >= ((connectionFee ?? 0) + (monthlyFee ?? 0)) ? (
                    <button 
                      onClick={handleConfirmConnection}
                      className="px-6 py-3 rounded-xl text-white font-medium text-lg hover:shadow-xl transition-all duration-200"
                      style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                    >
                      ✅ Подтвердить подключение
                    </button>
                  ) : (
                    <button 
                      className="px-6 py-3 rounded-xl text-white font-medium text-lg opacity-50 cursor-not-allowed"
                      style={{background: `linear-gradient(to right, #6B7280, #9CA3AF)`}}
                      disabled
                    >
                      ⚠️ Недостаточно средств
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-600 mb-4">Нет выбранного номера</div>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Вернуться в кабинет
                </button>
              </div>
            )}
          </div>

          {/* Block 4: PBX service */}
          <div className="bg-white rounded-xl border shadow-sm p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Услуга АТС</h3>
            <div className="text-slate-600 mb-4">
              Подключите виртуальную АТС для обработки вызовов и маршрутизации. 
              Это позволит вам управлять входящими и исходящими звонками, настраивать переадресацию и многое другое.
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/virtual-pbx')} 
                className="px-4 py-2 rounded-xl text-white font-medium" 
                style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
              >
                🏢 Перейти к АТС
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
