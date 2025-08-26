import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, billingApi } from '../../lib/api';
import DashboardNavigation from '../../components/DashboardNavigation';

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  balance: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);

  // Загружаем данные пользователя
  const loadUserData = async () => {
    try {
      const profileData = await userApi.getProfile();
      
      setUser({
        ...profileData,
        // balance is now included in profile response
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Слушаем обновления баланса
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const { newBalance } = event.detail;
      setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    };
    
    window.addEventListener('balance-updated', handleBalanceUpdate as EventListener);
    return () => window.removeEventListener('balance-updated', handleBalanceUpdate as EventListener);
  }, []);

  // Функция пополнения баланса
  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || topupLoading) return;

    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    setTopupLoading(true);
    try {
      const result = await billingApi.topup(Math.floor(amount * 100)); // конвертируем в центы
      
      // Обновляем баланс
      setUser(prev => prev ? { ...prev, balance: result.balance } : null);
      
      // Уведомляем другие компоненты
      window.dispatchEvent(new CustomEvent('balance-updated', {
        detail: { newBalance: result.balance }
      }));
      
      setTopupAmount('');
      alert(`Баланс успешно пополнен на $${amount.toFixed(2)}!`);
      
    } catch (error: any) {
      console.error("Topup failed:", error);
      const errorMessage = error.response?.data?.message || 'Ошибка при пополнении баланса';
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setTopupLoading(false);
    }
  };

  // Функция выхода
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  function computeDisplayName(user: User): string {
    const first = (user.firstName || '').trim();
    const last = (user.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (user.username && user.username.trim()) return user.username.trim();
    return user.email;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">⏳</div>
            <div className="text-slate-600">Загрузка профиля...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">❌</div>
            <div className="text-slate-600">Ошибка загрузки профиля</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Профиль</h1>
          <p className="text-slate-600 mt-2">Управление личными данными и балансом</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Личные данные */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">Личные данные</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Имя:</div>
                <div className="font-medium text-slate-900">
                  {computeDisplayName(user)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">Email:</div>
                <div className="font-medium text-slate-900">{user.email}</div>
              </div>
              
              <div>
                <div className="text-sm text-slate-500 mb-1">ID пользователя:</div>
                <div className="font-mono text-sm text-slate-600">{user.id}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>

          {/* Баланс и пополнение */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">Баланс</h2>
            
            <div className="mb-6">
              <div className="text-sm text-slate-500 mb-1">Текущий баланс:</div>
              <div className="text-3xl font-bold" style={{color: '#0A7B75'}}>
                ${(user.balance / 100).toFixed(2)}
              </div>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label htmlFor="topupAmount" className="block text-sm font-medium text-slate-700 mb-2">
                  Сумма пополнения ($)
                </label>
                <input
                  type="number"
                  id="topupAmount"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={topupLoading || !topupAmount}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {topupLoading ? 'Пополнение...' : 'Пополнить баланс'}
              </button>
            </form>

            <div className="mt-4 text-xs text-slate-500">
              💡 Минимальная сумма пополнения: $0.01
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
