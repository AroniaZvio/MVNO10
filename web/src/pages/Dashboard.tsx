import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../lib/api';
import { useConnectedPlan } from '../hooks/usePlans';
import VirtualPhone from '../components/VirtualPhone';

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  balance: number;
  createdAt: string;
}

interface DashboardData {
  user: User;
  connectedNumbers: Array<{
    id: string;
    mobileNumber?: string;
    number800?: string;
    countryName?: string;
    countryCode?: string;
    isActive?: boolean;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [_activeNumberId, setActiveNumberId] = useState<string | null>(null);
  const [showVirtualPhone, setShowVirtualPhone] = useState(false);
  const { connectedPlan, reload: reloadPlan } = useConnectedPlan();

  // Функция для загрузки данных кабинета
  const refetch = async () => {
    try {
      const dashboardData = await userApi.getDashboard();

      // Use balance from dashboard response instead of separate API call
      const dataWithCurrentBalance = {
        ...dashboardData,
        user: {
          ...dashboardData.user,
          // balance is now included in dashboard response
        },
        connectedNumbers: dashboardData.connectedNumbers.map((num: Record<string, unknown>, index: number) => ({
          ...num,
          isActive: index === 0 // Первый номер по умолчанию активен
        }))
      };
      setData(dataWithCurrentBalance);

      // Устанавливаем первый номер как активный по умолчанию
      // if (dashboardData.connectedNumbers.length > 0) {
      //   setActiveNumberId(dashboardData.connectedNumbers[0].id);
      // }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // При ошибке создаем тестовые данные
      setData({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Тестовый',
          lastName: 'пользователь',
          balance: 0,
          createdAt: new Date().toISOString()
        },
        connectedNumbers: [
          {
            id: '1',
            mobileNumber: '+7 (999) 123-45-67',
            countryName: 'Россия',
            countryCode: 'RU',
            isActive: true
          },
          {
            id: '2',
            number800: '8-800-555-35-35',
            countryName: 'Россия',
            countryCode: 'RU',
            isActive: false
          }
        ]
      });

      // Устанавливаем первый тестовый номер как активный
        // setActiveNumberId('1');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    refetch();
  }, []);

  // Слушаем обновления баланса
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { newBalance } = event.detail;

      // Обновляем баланс
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, balance: newBalance }
      } : prev);

      // Обновляем данные после покупки
      refetch();
    };

    window.addEventListener('balance-updated', handleBalanceUpdate as EventListener);
    return () => window.removeEventListener('balance-updated', handleBalanceUpdate as EventListener);
  }, []);

  // Слушаем обновления тарифа
  useEffect(() => {
    const handlePlanUpdate = () => {
      // Обновляем данные тарифа
      reloadPlan();
    };

    window.addEventListener('plan-updated', handlePlanUpdate);
    return () => window.removeEventListener('plan-updated', handlePlanUpdate);
  }, [reloadPlan]);

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
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">⏳</div>
            <div style={{ color: '#0A7B75' }}>Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">❌</div>
            <div style={{ color: '#0A7B75' }}>Error loading data</div>
          </div>
        </div>
      </div>
    );
  }

  // Определяем прогресс квеста
  const questProgress = (() => {
    const hasNumbers = data.connectedNumbers.length > 0;
    const hasTariff = !!connectedPlan;
    const hasBalance = data.user.balance > 0;
    const hasMadeCall = false; // Пока не реализовано отслеживание звонков

    const steps = [
      { id: 'numbers', completed: hasNumbers, title: 'Подключи номер', icon: '📱' },
      { id: 'tariff', completed: hasTariff, title: 'Выбери тариф', icon: '📋' },
      { id: 'balance', completed: hasBalance, title: 'Пополни баланс', icon: '💰' },
      { id: 'call', completed: hasMadeCall, title: 'Соверши звонок', icon: '🌐' }
    ];

    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;

    return { steps, completedSteps, progressPercentage };
  })();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes oceanWave {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes sandTexture {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
          }
          
          @keyframes sandDrift {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(10px) translateY(-5px); }
            50% { transform: translateX(0) translateY(-10px); }
            75% { transform: translateX(-10px) translateY(-5px); }
            100% { transform: translateX(0) translateY(0); }
          }
        `
      }} />
      {/* Ocean background with sand texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(135, 206, 235, 0.3) 0%, 
              rgba(173, 216, 230, 0.4) 25%, 
              rgba(176, 224, 230, 0.3) 50%, 
              rgba(135, 206, 235, 0.2) 75%, 
              rgba(173, 216, 230, 0.3) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(255, 228, 196, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 218, 185, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 239, 213, 0.2) 0%, transparent 50%)
          `,
          backgroundSize: '400% 400%, 300px 300px, 200px 200px, 150px 150px',
          animation: 'oceanWave 20s ease-in-out infinite, sandTexture 15s ease-in-out infinite'
        }}
      />
      
      {/* Sand texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 228, 196, 0.8) 1px, transparent 0),
            radial-gradient(circle at 3px 3px, rgba(255, 218, 185, 0.6) 1px, transparent 0),
            radial-gradient(circle at 5px 5px, rgba(255, 239, 213, 0.4) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 15px 15px, 10px 10px',
          animation: 'sandDrift 25s linear infinite'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Квест-степпер прогресса */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A7B75' }}>
              🎯 Turn on your line
            </h1>
            <p className="text-slate-600">
              4 simple wins
            </p>
          </div>

          {/* Прогресс-бар */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm font-bold" style={{ color: '#0A7B75' }}>
                {questProgress.completedSteps}/4 steps
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${questProgress.progressPercentage}%`,
                  backgroundColor: '#0A7B75'
                }}
              ></div>
            </div>
          </div>

          {/* Шаги квеста */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Подключи номер */}
            <Link
              to="/dashboard/connected-numbers"
              className={`text-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                questProgress.steps[0].completed 
                  ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-2xl mb-2">
                {questProgress.steps[0].completed ? '✅' : '📱'}
              </div>
              <div className={`text-sm font-medium mb-2 ${
                questProgress.steps[0].completed ? 'text-green-700' : 'text-slate-600'
              }`}>
                {questProgress.steps[0].title}
              </div>
              {questProgress.steps[0].completed && data.connectedNumbers.length > 0 && (
                <div className="text-lg font-bold text-slate-500 mb-1">
                  {data.connectedNumbers.find(n => n.isActive)?.mobileNumber || 
                   data.connectedNumbers.find(n => n.isActive)?.number800 || 
                   data.connectedNumbers[0]?.mobileNumber || 
                   data.connectedNumbers[0]?.number800 || 
                   'Номер подключен'}
                </div>
              )}
            </Link>

            {/* 2. Выбери тариф */}
            <Link
              to="/connect-plans"
              className={`text-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                questProgress.steps[1].completed 
                  ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                  : questProgress.steps[0].completed
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-2">
                {questProgress.steps[1].completed ? '✅' : '📋'}
              </div>
              <div className={`text-sm font-medium mb-2 ${
                questProgress.steps[1].completed ? 'text-green-700' : 'text-slate-600'
              }`}>
                {questProgress.steps[1].title}
              </div>
              {questProgress.steps[1].completed && connectedPlan && (
                <div className="text-lg font-bold text-slate-500 mb-1">
                  {connectedPlan.planName}
                </div>
              )}
            </Link>

            {/* 3. Пополни баланс */}
            <Link
              to="/dashboard/profile"
              className={`text-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
                questProgress.steps[2].completed 
                  ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                  : questProgress.steps[1].completed
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-2">
                {questProgress.steps[2].completed ? '✅' : '💰'}
              </div>
              <div className={`text-sm font-medium mb-2 ${
                questProgress.steps[2].completed ? 'text-green-700' : 'text-slate-600'
              }`}>
                {questProgress.steps[2].title}
              </div>
              <div className="text-lg font-bold text-slate-500 mb-1">
                ${(data.user.balance / 100).toFixed(2)}
              </div>
            </Link>

            {/* 4. Соверши звонок */}
            <button
              onClick={() => {
                const activeNumber = data.connectedNumbers.find(n => n.isActive);
                if (activeNumber && connectedPlan && data.user.balance > 0) {
                  setShowVirtualPhone(true);
                }
              }}
              disabled={!questProgress.steps[2].completed || !data.connectedNumbers.find(n => n.isActive) || !connectedPlan}
              className={`text-center p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                questProgress.steps[3].completed 
                  ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                  : questProgress.steps[2].completed && data.connectedNumbers.find(n => n.isActive) && connectedPlan
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer'
                    : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-2">
                {questProgress.steps[3].completed ? '✅' : ''}
              </div>
              <div className={`text-sm font-medium mb-2 ${
                questProgress.steps[3].completed ? 'text-green-700' : 'text-slate-600'
              }`}>
                {questProgress.steps[3].title}
              </div>
              {(() => {
                const activeNumber = data.connectedNumbers.find(n => n.isActive);
                if (activeNumber && connectedPlan) {
                  return (
                    <div className="text-lg font-bold text-slate-500 mb-1">
                      <div>{activeNumber.mobileNumber || activeNumber.number800}</div>
                      <div>{connectedPlan.planName}</div>
                      <div>${(data.user.balance / 100).toFixed(2)}</div>
                    </div>
                  );
                }
                return null;
              })()}
            </button>
          </div>
        </div>

        {/* Основные блоки Dashboard - квест-карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* 1. My Numbers - Квест шаг 1 */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col transition-all duration-300 ${
            questProgress.steps[0].completed 
              ? 'border-green-500 bg-green-50' 
              : 'border-slate-200'
          }`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {questProgress.steps[0].completed ? '✅' : '📱'}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>
                {questProgress.steps[0].completed ? 'Номер активирован!' : 'Подключи номер'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {questProgress.steps[0].completed 
                  ? 'Привяжи свой номер — это паспорт в сеть.' 
                  : 'Привяжи свой номер — это паспорт в сеть.'
                }
              </p>
            </div>
            <div className="flex-1">
              {(() => {
                const activeNumber = data.connectedNumbers.find(n => n.isActive);
                
                if (activeNumber) {
                  return (
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold mb-2" style={{ color: '#0A7B75' }}>
                        {activeNumber.mobileNumber || activeNumber.number800 || `Number #${activeNumber.id}`}
                          </div>
                      <div className="text-sm text-slate-500 mb-2">
                        {activeNumber.countryName} {activeNumber.countryCode}
                        </div>
                      <div className="text-xs text-green-600 font-medium mb-2">
                        ✓ Active number
                      </div>
                      <div className="text-xs text-slate-400">
                        {data.connectedNumbers.length} total numbers
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold mb-2" style={{ color: '#0A7B75' }}>
                        {data.connectedNumbers.length}
                      </div>
                      <div className="text-sm text-slate-500 mb-2">Connected numbers</div>
                      <div className="text-xs text-slate-400">
                        {data.connectedNumbers.filter(n => n.isActive).length} active
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
            <div className="mt-auto pt-4">
              {questProgress.steps[0].completed && (
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <span>🏆</span>
                    <span>+25 XP</span>
                </div>
                </div>
              )}
              <Link
                to="/dashboard/connected-numbers"
                className="block w-full text-center px-4 py-2 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: '#0A7B75' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
              >
                {questProgress.steps[0].completed ? 'Управлять номерами' : 'Подключить номер'}
              </Link>
            </div>
          </div>

          {/* 2. Connected Tariff Plan - Квест шаг 2 */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col transition-all duration-300 ${
            questProgress.steps[1].completed 
              ? 'border-green-500 bg-green-50' 
              : questProgress.steps[0].completed 
                ? 'border-slate-200' 
                : 'border-slate-200 opacity-50'
          }`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {questProgress.steps[1].completed ? '✅' : '📋'}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>
                {questProgress.steps[1].completed ? 'Тариф выбран!' : 'Выбери тариф'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {questProgress.steps[1].completed 
                  ? 'Подбери тариф под свой ритм.' 
                  : 'Подбери тариф под свой ритм.'
                }
              </p>
            </div>
            <div className="flex-1">
              {connectedPlan ? (
                <div className="text-center py-4">
                  <div className="text-sm text-slate-500 mb-2">{connectedPlan.planName}</div>
                  <div className="text-xs text-slate-400 mb-3">
                    {connectedPlan.planDataMb} MB • {connectedPlan.planMinutes} мин • {connectedPlan.planSms} SMS
                  </div>
                  <div className="text-lg font-bold mb-2" style={{ color: '#0A7B75' }}>{connectedPlan.planPrice}</div>
                  <div className="text-xs text-slate-400">
                    Connected: {new Date(connectedPlan.connectedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-slate-500 mb-2">No connected tariff</div>
                  <div className="text-xs text-slate-400">Connect a tariff to use services</div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4">
              {questProgress.steps[1].completed && (
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <span>🏆</span>
                    <span>+25 XP</span>
                  </div>
                </div>
              )}
              <Link
                to="/connect-plans"
                className={`block w-full text-center px-4 py-2 font-medium rounded-lg transition-colors ${
                  questProgress.steps[0].completed 
                    ? 'text-white' 
                    : 'text-slate-400 bg-slate-200 cursor-not-allowed'
                }`}
                style={{ 
                  backgroundColor: questProgress.steps[0].completed ? '#0A7B75' : '#e2e8f0'
                }}
                onMouseEnter={(e) => {
                  if (questProgress.steps[0].completed) {
                    e.currentTarget.style.backgroundColor = '#1C9C97';
                  }
                }}
                onMouseLeave={(e) => {
                  if (questProgress.steps[0].completed) {
                    e.currentTarget.style.backgroundColor = '#0A7B75';
                  }
                }}
              >
                {questProgress.steps[1].completed 
                  ? 'Изменить тариф' 
                  : questProgress.steps[0].completed 
                    ? 'Выбрать тариф' 
                    : '🔒 Сначала подключи номер'
                }
              </Link>
            </div>
          </div>

          {/* 3. Profile & Balance - Квест шаг 3 */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col transition-all duration-300 ${
            questProgress.steps[2].completed 
              ? 'border-green-500 bg-green-50' 
              : questProgress.steps[1].completed 
                ? 'border-slate-200' 
                : 'border-slate-200 opacity-50'
          }`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {questProgress.steps[2].completed ? '✅' : '💰'}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>
                {questProgress.steps[2].completed ? 'Баланс пополнен!' : 'Пополни баланс'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {questProgress.steps[2].completed 
                  ? 'Пополни баланс и разблокируй звонки.' 
                  : 'Пополни баланс и разблокируй звонки.'
                }
              </p>
            </div>
            <div className="flex-1">
              <div className="text-center py-4">
                <div className="font-medium text-slate-900 mb-1">
                  {computeDisplayName(data.user)}
                </div>
                <div className="text-sm text-slate-500 mb-2">{data.user.email}</div>
                <div className="text-2xl font-bold mb-2" style={{ color: '#0A7B75' }}>
                  ${(data.user.balance / 100).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mb-2">Available balance</div>
                <div className="text-xs text-slate-400">
                  Member since {new Date(data.user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-auto pt-4">
              {questProgress.steps[2].completed && (
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <span>🏆</span>
                    <span>+25 XP</span>
                  </div>
                </div>
              )}
              <Link
                to="/dashboard/profile"
                className={`block w-full text-center px-4 py-2 font-medium rounded-lg transition-colors ${
                  questProgress.steps[1].completed 
                    ? 'text-white' 
                    : 'text-slate-400 bg-slate-200 cursor-not-allowed'
                }`}
                style={{ 
                  backgroundColor: questProgress.steps[1].completed ? '#0A7B75' : '#e2e8f0'
                }}
                onMouseEnter={(e) => {
                  if (questProgress.steps[1].completed) {
                    e.currentTarget.style.backgroundColor = '#1C9C97';
                  }
                }}
                onMouseLeave={(e) => {
                  if (questProgress.steps[1].completed) {
                    e.currentTarget.style.backgroundColor = '#0A7B75';
                  }
                }}
              >
                {questProgress.steps[2].completed 
                  ? 'Управлять балансом' 
                  : questProgress.steps[1].completed 
                    ? 'Пополнить баланс' 
                    : '🔒 Сначала выбери тариф'
                }
              </Link>
            </div>
          </div>

          {/* 4. Call from Website - Квест шаг 4 */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col transition-all duration-300 ${
            questProgress.steps[3].completed 
              ? 'border-green-500 bg-green-50' 
              : questProgress.steps[2].completed 
                ? 'border-slate-200' 
                : 'border-slate-200 opacity-50'
          }`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {questProgress.steps[3].completed ? '✅' : '🌐'}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>
                {questProgress.steps[3].completed ? 'Первый звонок!' : 'Соверши звонок'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {questProgress.steps[3].completed 
                  ? 'Жми Start Call — проверь связь!' 
                  : 'Жми Start Call — проверь связь!'
                }
              </p>
            </div>
            <div className="flex-1">
              {(() => {
                const activeNumber = data.connectedNumbers.find(n => n.isActive);
                const hasRequirements = activeNumber && connectedPlan;

                return (
                  <div className="text-center py-4">
                    {hasRequirements ? (
                      <>
                        <div className="text-2xl mb-2">✅</div>
                        <div className="text-sm text-green-600 font-medium mb-1">Ready to call</div>
                        <div className="text-xs text-slate-400">All settings connected</div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl mb-2">⚠️</div>
                        <div className="text-sm text-orange-600 font-medium mb-1">Setup required</div>
                        <div className="text-xs text-slate-400">
                          {!activeNumber && !connectedPlan && 'Connect number and tariff'}
                          {!activeNumber && connectedPlan && 'Select active number'}
                          {activeNumber && !connectedPlan && 'Connect tariff plan'}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="mt-auto pt-4">
              {questProgress.steps[3].completed && (
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <span>🏆</span>
                    <span>+25 XP</span>
                  </div>
                </div>
              )}
              <button
                className={`block w-full text-center px-4 py-2 font-medium rounded-lg transition-colors ${
                  questProgress.steps[2].completed && data.connectedNumbers.find(n => n.isActive) && connectedPlan
                    ? 'text-white' 
                    : 'text-slate-400 bg-slate-200 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: questProgress.steps[2].completed && data.connectedNumbers.find(n => n.isActive) && connectedPlan ? '#0A7B75' : '#e2e8f0'
                }}
                disabled={!questProgress.steps[2].completed || !data.connectedNumbers.find(n => n.isActive) || !connectedPlan}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1C9C97';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#0A7B75';
                  }
                }}
                onClick={() => {
                  const activeNumber = data.connectedNumbers.find(n => n.isActive);
                  if (activeNumber && connectedPlan) {
                    setShowVirtualPhone(true);
                  }
                }}
              >
                {questProgress.steps[3].completed 
                  ? 'Совершить звонок' 
                  : questProgress.steps[2].completed && data.connectedNumbers.find(n => n.isActive) && connectedPlan
                    ? 'Start Call' 
                    : '🔒 Сначала пополни баланс'
                }
              </button>
            </div>
          </div>

        </div>

        {/* Финальный бейдж при завершении квеста */}
        {questProgress.completedSteps === 4 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Поздравляем! Линия запущена! 🚀
            </h2>
            <p className="text-green-100 mb-4">
              Вы успешно прошли все шаги активации и получили 100 XP!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium">
              <span>🏆</span>
              <span>Линия запущена</span>
            </div>
          </div>
        )}

        </div>
      </div>

      {/* Виртуальный телефон */}
      {showVirtualPhone && (
        <VirtualPhone
          activeNumber={data?.connectedNumbers.find(n => n.isActive)?.mobileNumber ||
            data?.connectedNumbers.find(n => n.isActive)?.number800 ||
            'Неизвестный номер'}
          userBalance={data?.user.balance || 0}
          onClose={() => setShowVirtualPhone(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;