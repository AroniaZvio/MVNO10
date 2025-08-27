import { useState, useMemo } from 'react';
import { useAvailableNumbers, type AvailableNumber } from '../../hooks/useAvailableNumbers';

type Props = {
  onConnect?: (row: AvailableNumber) => void;
  className?: string;
};

export default function AvailableNumbersTable({ 
  onConnect, 
  className = ''
}: Props) {
  const { data, loading, error, reload } = useAvailableNumbers();
  const [filterView, setFilterView] = useState<'all'|'mobile'|'tf'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all'|'vip'|'platinum'|'gold'|'simple'|'other'>('all');

  const getCategory = (monthlyFee: number) => {
    // categories based on monthly fee (USD)
    if (monthlyFee >= 10000) return { key: 'vip', label: '💎 VIP', order: 4, color: 'bg-indigo-600 text-white' };
    if (monthlyFee >= 5000) return { key: 'platinum', label: '⚪ Платиновые', order: 3, color: 'bg-gray-200 text-gray-800' };
    if (monthlyFee >= 1500) return { key: 'gold', label: '🟡 Золотые', order: 2, color: 'bg-amber-400 text-gray-900' };
    if (monthlyFee >= 300) return { key: 'simple', label: '🔵 Простые', order: 1, color: 'bg-blue-500 text-white' };
    return { key: 'other', label: '—', order: 0, color: 'bg-gray-100 text-gray-700' };
  };

  const filteredData = useMemo(() => {
    // Apply category filter first
    const baseFiltered = data.filter(r => {
      const catKey = (r.category ?? getCategory(r.monthlyFee).key) as string;
      return selectedCategory === 'all' ? true : catKey === selectedCategory;
    });

    // Apply type filter
    if (filterView === 'mobile') {
      return baseFiltered.filter(r => r.mobileNumber);
    } else if (filterView === 'tf') {
      return baseFiltered.filter(r => r.number800);
    }
    return baseFiltered;
  }, [data, filterView, selectedCategory]);

  const mobileRows = filteredData.filter(r => r.mobileNumber);
  const tfRows = filteredData.filter(r => r.number800);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl mb-4">⏳</div>
        <div className="text-slate-600">Загрузка доступных номеров…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-red-500 text-lg">⚠️</div>
          <div>
            <div className="font-medium text-red-800 mb-1">Ошибка загрузки</div>
            <div className="text-sm text-red-700">{error}</div>
            <button 
              onClick={reload}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
            >
              Попробовать снова
            </button>
            <button 
              onClick={() => {
                const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mobilive.ge';
                window.open(`${API_URL}/api/phone-numbers/public`, '_blank');
              }}
              className="mt-2 ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
            >
              Тест API
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border bg-white ${className}`}>
      {/* Filter controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type filter tabs */}
          <div className="inline-flex rounded-md shadow-sm">
            <button 
              onClick={() => setFilterView('all')} 
              className={`px-3 py-1 border border-gray-300 text-sm ${
                filterView === 'all' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Все
            </button>
            <button 
              onClick={() => setFilterView('mobile')} 
              className={`px-3 py-1 border-t border-b border-gray-300 text-sm ${
                filterView === 'mobile' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Мобильные
            </button>
            <button 
              onClick={() => setFilterView('tf')} 
              className={`px-3 py-1 border border-gray-300 text-sm ${
                filterView === 'tf' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Номера 800
            </button>
          </div>

          {/* Category filter */}
          <div className="ml-2 text-sm">
            <label className="mr-2 text-sm text-gray-600">Категория:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value as any)} 
              className="px-2 py-1 border rounded-md text-sm"
            >
              <option value="all">Все категории</option>
              <option value="vip">💎 VIP</option>
              <option value="platinum">⚪ Платиновые</option>
              <option value="gold">🟡 Золотые</option>
              <option value="simple">🔵 Простые</option>
              <option value="other">Другие</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Страна
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Мобильный номер
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Номер 800
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Подключение
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Абонплата
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              {onConnect && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Mobile numbers section */}
            {(filterView === 'all' || filterView === 'mobile') && mobileRows.length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700" colSpan={onConnect ? 7 : 6}>
                    Мобильные номера ({mobileRows.length})
                  </td>
                </tr>
                {mobileRows.map((row) => (
                  <tr key={`mob-${row.id}`} className="hover:bg-gray-50 group">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{row.countryName}</div>
                        <div className="text-xs text-gray-500">{row.countryCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.mobileNumber || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">—</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${(row.connectionFee / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${(row.monthlyFee / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {(() => {
                        if (row.category) {
                          const map: Record<string, { label: string; color: string }> = {
                            vip: { label: '💎 VIP', color: 'bg-indigo-600 text-white' },
                            platinum: { label: '⚪ Платиновые', color: 'bg-gray-200 text-gray-800' },
                            gold: { label: '🟡 Золотые', color: 'bg-amber-400 text-gray-900' },
                            simple: { label: '🔵 Простые', color: 'bg-blue-500 text-white' },
                          };
                          const c = map[row.category] ?? { label: row.category, color: 'bg-gray-100 text-gray-700' };
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        }
                        const c = getCategory(row.monthlyFee);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                            {c.label}
                          </span>
                        );
                      })()}
                    </td>
                    {onConnect && (
                      <td className="px-4 py-3 text-sm font-medium">
                        <button 
                          onClick={() => onConnect(row)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Подключить
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            )}

            {/* 800 numbers section */}
            {(filterView === 'all' || filterView === 'tf') && tfRows.length > 0 && (
              <>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700" colSpan={onConnect ? 7 : 6}>
                    Номера 800 ({tfRows.length})
                  </td>
                </tr>
                {tfRows.map((row) => (
                  <tr key={`tf-${row.id}`} className="hover:bg-gray-50 group">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{row.countryName}</div>
                        <div className="text-xs text-gray-500">{row.countryCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">—</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        800: {row.number800}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">${(row.connectionFee / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${(row.monthlyFee / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {(() => {
                        if (row.category) {
                          const map: Record<string, { label: string; color: string }> = {
                            vip: { label: '💎 VIP', color: 'bg-indigo-600 text-white' },
                            platinum: { label: '⚪ Платиновые', color: 'bg-gray-200 text-gray-800' },
                            gold: { label: '🟡 Золотые', color: 'bg-amber-400 text-gray-900' },
                            simple: { label: '🔵 Простые', color: 'bg-blue-500 text-white' },
                          };
                          const c = map[row.category] ?? { label: row.category, color: 'bg-gray-100 text-gray-700' };
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        }
                        const c = getCategory(row.monthlyFee);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                            {c.label}
                          </span>
                        );
                      })()}
                    </td>
                    {onConnect && (
                      <td className="px-4 py-3 text-sm font-medium">
                        <button 
                          onClick={() => onConnect(row)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Подключить
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            )}

            {/* Empty state */}
            {filteredData.length === 0 && (
              <tr>
                <td 
                  className="px-4 py-12 text-center text-gray-500" 
                  colSpan={onConnect ? 7 : 6}
                >
                  <div className="text-center py-8">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-gray-600">Нет доступных номеров</div>
                    <div className="text-sm text-gray-500 mt-1">Попробуйте изменить фильтры</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with refresh button */}
      <div className="p-4 border-t border-gray-200 text-right">
        <button 
          onClick={reload}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Обновить
        </button>
      </div>
    </div>
  );
}
