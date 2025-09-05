import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../lib/api';
import DashboardNavigation from '../components/DashboardNavigation';
import { useConnectedPlan } from '../hooks/usePlans';
import VirtualPhone from '../components/VirtualPhone';

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  balance: number;
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
  const [_activeNumberId, setActiveNumberId] = useState<string | null>(null);
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
        connectedNumbers: dashboardData.connectedNumbers.map((num: any, index: number) => ({
          ...num,
          isActive: index === 0 // Первый номер по умолчанию активен
        }))
      };
      setData(dataWithCurrentBalance);

      // Устанавливаем первый номер как активный по умолчанию
      if (dashboardData.connectedNumbers.length > 0) {
        setActiveNumberId(dashboardData.connectedNumbers[0].id);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // При ошибке создаем тестовые данные
      setData({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Тестовый',
          lastName: 'пользователь',
          balance: 0
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
      setActiveNumberId('1');
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

  // Функция для изменения активного номера
  const handleNumberActivation = (numberId: string) => {
    setActiveNumberId(numberId);

    // Обновляем состояние номеров
    setData(prev => prev ? {
      ...prev,
      connectedNumbers: prev.connectedNumbers.map(num => ({
        ...num,
        isActive: num.id === numberId
      }))
    } : prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <DashboardNavigation />
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
        <DashboardNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">❌</div>
            <div style={{ color: '#0A7B75' }}>Error loading data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <DashboardNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#0A7B75' }}>Welcome!</h1>
          <p className="text-slate-600 mt-2">Overview of your account and quick access to features</p>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Профиль */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">👤</div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>Profile</h3>
            </div>
            <div className="text-center mb-4">
              <div className="font-medium text-slate-900 mb-1">
                {computeDisplayName(data.user)}
              </div>
              <div className="text-sm text-slate-500">{data.user.email}</div>
            </div>
            <Link
              to="/dashboard/profile"
              className="block w-full text-center px-4 py-2 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: '#0A7B75' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
            >
              Manage Profile
            </Link>
          </div>

          {/* Баланс */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>Balance</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold" style={{ color: '#0A7B75' }}>
                ${(data.user.balance / 100).toFixed(2)}
              </div>
              <div className="text-sm text-slate-500">Available funds</div>
            </div>
            <Link
              to="/dashboard/profile"
              className="block w-full text-center px-4 py-2 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: '#0A7B75' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
            >
              Top Up Balance
            </Link>
          </div>

          {/* Подключенные номера */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="text-lg font-semibold" style={{ color: '#0A7B75' }}>My Numbers</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold" style={{ color: '#0A7B75' }}>
                {data.connectedNumbers.length}
              </div>
              <div className="text-sm text-slate-500">Connected numbers</div>
            </div>
            <Link
              to="/dashboard/connected-numbers"
              className="block w-full text-center px-4 py-2 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: '#0A7B75' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
            >
              Manage Numbers
            </Link>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#0A7B75' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/available-numbers"
              className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
              style={{
                backgroundColor: '#f0f9f8',
                borderColor: '#0A7B75',
                color: '#0A7B75'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0f2f1';
                e.currentTarget.style.borderColor = '#1C9C97';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9f8';
                e.currentTarget.style.borderColor = '#0A7B75';
              }}
            >
              <div className="text-2xl">🔍</div>
              <div>
                <div className="font-medium">Find New Number</div>
                <div className="text-sm opacity-80">Browse available numbers for connection</div>
              </div>
            </Link>

            <Link
              to="/connect-plans"
              className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
              style={{
                backgroundColor: '#f0f9f8',
                borderColor: '#0A7B75',
                color: '#0A7B75'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0f2f1';
                e.currentTarget.style.borderColor = '#1C9C97';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9f8';
                e.currentTarget.style.borderColor = '#0A7B75';
              }}
            >
              <div className="text-2xl">📋</div>
              <div>
                <div className="font-medium">Connect Tariff</div>
                <div className="text-sm opacity-80">Select and connect tariff plan</div>
              </div>
            </Link>

            <Link
              to="/ats-services"
              className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
              style={{
                backgroundColor: '#f0f9f8',
                borderColor: '#0A7B75',
                color: '#0A7B75'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0f2f1';
                e.currentTarget.style.borderColor = '#1C9C97';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9f8';
                e.currentTarget.style.borderColor = '#0A7B75';
              }}
            >
              <div className="text-2xl">🏢</div>
              <div>
                <div className="font-medium">Additional Services</div>
                <div className="text-sm opacity-80">Connect PBX with internal numbers</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Информационные блоки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Подключенные номера */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#0A7B75' }}>
              Connected Numbers
              {data.connectedNumbers.length > 0 && (
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({data.connectedNumbers.filter(n => n.isActive).length} active)
                </span>
              )}
            </h2>
            <div className="flex-1">
              {data.connectedNumbers.length > 0 ? (
                <div className="space-y-3">
                  {data.connectedNumbers.slice(0, 2).map(n => (
                    <div
                      key={n.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${n.isActive
                          ? 'bg-green-50 border-green-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      onClick={() => handleNumberActivation(n.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">📱</div>
                        <div>
                          <div className="font-medium text-sm">
                            {n.mobileNumber || n.number800 || `Number #${n.id}`}
                          </div>
                          <div className="text-xs text-slate-500">{n.countryName} {n.countryCode}</div>
                        </div>
                      </div>

                      {/* Галочка активного номера */}
                      <div className="flex items-center gap-2">
                        {n.isActive && (
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            Active
                          </div>
                        )}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${n.isActive
                              ? 'border-green-500 bg-green-500'
                              : 'border-slate-300 bg-white'
                            }`}
                        >
                          {n.isActive && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.connectedNumbers.length > 2 && (
                    <div className="text-center pt-2">
                      <Link
                        to="/dashboard/connected-numbers"
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        +{data.connectedNumbers.length - 2} more →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-sm text-slate-500">No connected numbers</div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4">
              <Link
                to="/dashboard/connected-numbers"
                className="block w-full text-center px-3 py-2 text-white font-medium rounded-lg transition-colors text-sm"
                style={{ backgroundColor: '#0A7B75' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
              >
                Manage Numbers
              </Link>
            </div>
          </div>

          {/* Подключенный тарифный план */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#0A7B75' }}>Connected Tariff Plan</h2>
            <div className="flex-1">
              {connectedPlan ? (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm text-slate-500 mb-2">{connectedPlan.planName}</div>
                  <div className="text-xs text-slate-400 mb-3">
                    {connectedPlan.planDataMb} MB данных, {connectedPlan.planMinutes} минут, {connectedPlan.planSms} SMS
                  </div>
                  <div className="text-lg font-bold" style={{ color: '#0A7B75' }}>{connectedPlan.planPrice}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Connected: {new Date(connectedPlan.connectedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm text-slate-500 mb-2">No connected tariff</div>
                  <div className="text-xs text-slate-400 mb-3">Connect a tariff to use services</div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4">
              <Link
                to="/connect-plans"
                className="block w-full text-center px-3 py-2 text-white font-medium rounded-lg transition-colors text-sm"
                style={{ backgroundColor: '#0A7B75' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C9C97'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A7B75'}
              >
                {connectedPlan ? 'Change Tariff' : 'Connect Tariff'}
              </Link>
            </div>
          </div>

          {/* Позвонить с сайта */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#0A7B75' }}>Call from Website</h2>
            <div className="flex-1">
              {(() => {
                const activeNumber = data.connectedNumbers.find(n => n.isActive);
                const hasRequirements = activeNumber && connectedPlan;

                return (
                  <div className="space-y-3">
                    {/* Активный номер */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">Active number:</div>
                      {activeNumber ? (
                        <div className="flex items-center gap-2">
                          <div className="text-lg">📱</div>
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#0A7B75' }}>
                              {activeNumber.mobileNumber || activeNumber.number800 || `Number #${activeNumber.id}`}
                            </div>
                            <div className="text-xs text-slate-400">
                              {activeNumber.countryName} {activeNumber.countryCode}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">No active number</div>
                      )}
                    </div>

                    {/* Подключенный тариф */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">Tariff plan:</div>
                      {connectedPlan ? (
                        <div className="flex items-center gap-2">
                          <div className="text-lg">📋</div>
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#0A7B75' }}>
                              {connectedPlan.planName}
                            </div>
                            <div className="text-xs text-slate-400">
                              {connectedPlan.planMinutes} мин • {connectedPlan.planDataMb} MB
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">No connected tariff</div>
                      )}
                    </div>

                    {/* Статус готовности */}
                    {hasRequirements ? (
                      <div className="text-center py-2">
                        <div className="text-sm text-green-600 font-medium">✓ Ready to call</div>
                        <div className="text-xs text-slate-400">All settings connected</div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <div className="text-sm text-orange-600 font-medium">⚠ Setup required</div>
                        <div className="text-xs text-slate-400">
                          {!activeNumber && !connectedPlan && 'Connect number and tariff'}
                          {!activeNumber && connectedPlan && 'Select active number'}
                          {activeNumber && !connectedPlan && 'Connect tariff plan'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="mt-auto pt-4">
              <button
                className="block w-full text-center px-3 py-2 text-white font-medium rounded-lg transition-colors text-sm"
                style={{
                  backgroundColor: data.connectedNumbers.find(n => n.isActive) && connectedPlan ? '#0A7B75' : '#9ca3af'
                }}
                disabled={!data.connectedNumbers.find(n => n.isActive) || !connectedPlan}
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
                {data.connectedNumbers.find(n => n.isActive) && connectedPlan ? 'Start Call' : 'Setup Required'}
              </button>
            </div>
          </div>
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