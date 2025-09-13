import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, billingApi } from '../../lib/api';
import DashboardNavigation from '../../components/DashboardNavigation';
import AvailableNumbersTable from '../../components/numbers/AvailableNumbersTable';
import { type AvailableNumber } from '../../hooks/useAvailableNumbers';

interface ConnectedNumber {
  id: number;
  mobileNumber?: string | null;
  number800?: string | null;
  countryName: string;
  countryCode: string;
  connectionFee: number;
  monthlyFee: number;
  status: string;
}

const ConnectedNumbers: React.FC = () => {
  const navigate = useNavigate();
  const [connectedNumbers, setConnectedNumbers] = useState<ConnectedNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Функции для обработки подключения номеров
  const handleConnect = (row: AvailableNumber) => {
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
  };

  const handleRowClick = (row: AvailableNumber) => {
    // При клике по строке также переходим к подключению номера
    handleConnect(row);
  };

  // Загружаем подключенные номера
  const loadConnectedNumbers = async () => {
    try {
      const dashboardData = await userApi.getDashboard();
      setConnectedNumbers(dashboardData.connectedNumbers || []);
    } catch (error) {
      console.error("Failed to load connected numbers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnectedNumbers();
  }, []);

  // Слушаем обновления баланса для обновления списка номеров
  useEffect(() => {
    const handleBalanceUpdate = () => {
      loadConnectedNumbers();
    };
    
    window.addEventListener('balance-updated', handleBalanceUpdate);
    return () => window.removeEventListener('balance-updated', handleBalanceUpdate);
  }, []);

  // Функция отключения номера
  const handleDisconnectNumber = async (phoneNumberId: number) => {
    if (!confirm('Вы уверены, что хотите отключить этот номер? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const result = await billingApi.disconnectNumber(phoneNumberId);
      
      alert(`Номер успешно отключен! Возвращено: $${(result.refundAmount / 100).toFixed(2)}`);
      
      // Обновляем список номеров
      await loadConnectedNumbers();
      
    } catch (error: any) {
      console.error("Failed to disconnect number:", error);
      const errorMessage = error.response?.data?.message || 'Ошибка при отключении номера';
      alert(`Ошибка: ${errorMessage}`);
    }
  };

  // Функция обновления
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConnectedNumbers();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">⏳</div>
            <div className="text-slate-600">Загрузка подключенных номеров...</div>
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
          <h1 className="text-3xl font-bold text-slate-900">Мои номера</h1>
          <p className="text-slate-600 mt-2">Управление подключенными номерами</p>
        </div>

        {/* Подключенные номера */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Подключенные номера</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Обновление...' : 'Обновить'}
            </button>
          </div>

          {connectedNumbers.length > 0 ? (
            <div className="space-y-4">
              {connectedNumbers.map(n => (
                <div key={n.id} className="w-full grid grid-cols-[1fr_auto] items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col gap-1">
                      {n.mobileNumber && (
                        <div className="text-2xl font-mono font-bold" style={{color: '#0A7B75'}}>
                          {n.mobileNumber}
                        </div>
                      )}
                      {n.number800 && (
                        <div className="text-lg font-mono font-bold text-green-600">
                          800: {n.number800}
                        </div>
                      )}
                      {!n.mobileNumber && !n.number800 && (
                        <div className="text-lg font-medium text-slate-500">
                          Номер #{n.id}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500">{n.countryName} {n.countryCode}</span>
                      <div className="text-xs text-slate-400">
                        Подключение: ${(n.connectionFee / 100).toFixed(2)} | 
                        Ежемесячно: ${(n.monthlyFee / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Подключен
                    </span>
                    <button
                      onClick={() => handleDisconnectNumber(n.id)}
                      className="px-3 py-1 text-xs font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors rounded-lg"
                      title="Отключить номер"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📱</div>
              <div className="text-lg font-medium text-slate-700 mb-2">Нет подключенных номеров</div>
              <div className="text-slate-500 mb-6">
                У вас пока нет подключенных номеров. Перейдите в раздел "Доступные номера" для подключения.
              </div>
              <div className="text-sm text-slate-400">
                💡 Подключенные номера появятся здесь автоматически после покупки
              </div>
            </div>
          )}
        </div>

        {/* Доступные номера - таблица */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Доступные номера</h2>
              <p className="text-slate-600">Поиск и подключение новых номеров для вашего бизнеса</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-[#0A7B75]">
                <span className="text-lg">💡</span>
                <span>Нажмите на строку номера или кнопку "Подключить" для подключения</span>
              </div>
            </div>
            <a
              href="/dashboard/available-numbers"
              className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Открыть полную таблицу
            </a>
          </div>

          <AvailableNumbersTable
            onConnect={handleConnect}
            onRowClick={handleRowClick}
            className="shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectedNumbers;
