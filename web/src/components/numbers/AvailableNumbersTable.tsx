import { useState, useMemo } from 'react';
import { useAvailableNumbers, type AvailableNumber } from '../../hooks/useAvailableNumbers';

type Props = {
  onConnect?: (row: AvailableNumber) => void;
  onRowClick?: (row: AvailableNumber) => void;
  className?: string;
};

export default function AvailableNumbersTable({
  onConnect,
  onRowClick,
  className = ''
}: Props) {
  const { data, loading, error, reload } = useAvailableNumbers();
  const [filterView, setFilterView] = useState<'all' | 'mobile' | 'tf'>('mobile'); // Default to mobile
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vip' | 'platinum' | 'gold' | 'simple' | 'other'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    let typeFiltered = baseFiltered;
    if (filterView === 'mobile') {
      typeFiltered = baseFiltered.filter(r => r.mobileNumber);
    } else if (filterView === 'tf') {
      typeFiltered = baseFiltered.filter(r => r.number800);
    }

    // Apply search filter
    const searchFiltered = typeFiltered.filter(r => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();

      // Normalize phone numbers by removing spaces for comparison
      const normalizePhoneNumber = (phone: string | null | undefined) => {
        if (!phone) return '';
        return phone.replace(/\s/g, '').toLowerCase();
      };

      const normalizedSearch = searchLower.replace(/\s/g, '');

      return (
        r.countryName?.toLowerCase().includes(searchLower) ||
        normalizePhoneNumber(r.mobileNumber)?.includes(normalizedSearch) ||
        normalizePhoneNumber(r.number800)?.includes(normalizedSearch) ||
        r.countryCode?.toLowerCase().includes(searchLower)
      );
    });

    return searchFiltered;
  }, [data, filterView, selectedCategory, searchTerm]);

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
    <div className={`rounded-2xl border-2 border-[#0A7B75]/20 bg-gradient-to-br from-white to-[#0A7B75]/5 shadow-xl ${className}`}>
      {/* Filter controls */}
      <div className="p-6 border-b border-[#0A7B75]/20 bg-gradient-to-r from-[#0A7B75]/5 to-transparent">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Type filter tabs */}
          <div className="inline-flex rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => setFilterView('all')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${filterView === 'all'
                ? 'bg-[#0A7B75] text-white shadow-md'
                : 'bg-white text-[#0A7B75] hover:bg-[#0A7B75]/10'
                }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilterView('mobile')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${filterView === 'mobile'
                ? 'bg-[#0A7B75] text-white shadow-md'
                : 'bg-white text-[#0A7B75] hover:bg-[#0A7B75]/10'
                }`}
            >
              📱 Мобильные
            </button>
            <button
              onClick={() => setFilterView('tf')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${filterView === 'tf'
                ? 'bg-[#0A7B75] text-white shadow-md'
                : 'bg-white text-[#0A7B75] hover:bg-[#0A7B75]/10'
                }`}
            >
              ☎️ Номера 800
            </button>
          </div>

          {/* Category filter */}
          <div className="ml-2 text-sm">
            <label className="mr-2 text-sm font-medium text-[#0A7B75]">Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 border-2 border-[#0A7B75]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7B75]/50 focus:border-[#0A7B75] transition-all duration-200"
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

        {/* Search input */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#0A7B75]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Поиск номеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#0A7B75]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7B75]/50 focus:border-[#0A7B75] transition-all duration-200 bg-white/80"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                🌍 Страна
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                📱 Мобильный номер
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                ☎️ Номер 800
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                💰 Подключение
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                📅 Абонплата
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                🏷️ Категория
              </th>
              {onConnect && (
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  ⚡ Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#0A7B75]/10">
            {/* Mobile numbers section */}
            {(filterView === 'all' || filterView === 'mobile') && mobileRows.length > 0 && (
              <>
                <tr className="bg-gradient-to-r from-[#0A7B75]/10 to-[#0A7B75]/5">
                  <td className="px-6 py-4 text-sm font-bold text-[#0A7B75] border-l-4 border-[#0A7B75]" colSpan={onConnect ? 7 : 6}>
                    📱 Мобильные номера ({mobileRows.length})
                  </td>
                </tr>
                {mobileRows.map((row, index) => (
                  <tr
                    key={`mob-${row.id}`}
                    className={`hover:bg-gradient-to-r hover:from-[#0A7B75]/5 hover:to-transparent group transition-all duration-200 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-[#0A7B75]/2'}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0A7B75] to-[#0A7B75]/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {row.countryCode?.slice(0, 2) || '🌍'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{row.countryName}</div>
                          <div className="text-xs text-[#0A7B75] font-medium">{row.countryCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border">
                        {row.mobileNumber || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">—</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#0A7B75] bg-[#0A7B75]/10 px-3 py-1 rounded-lg">
                        ${(row.connectionFee / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        ${(row.monthlyFee / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        if (row.category) {
                          const map: Record<string, { label: string; color: string }> = {
                            vip: { label: '💎 VIP', color: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' },
                            platinum: { label: '⚪ Платиновые', color: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md' },
                            gold: { label: '🟡 Золотые', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md' },
                            simple: { label: '🔵 Простые', color: 'bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white shadow-md' },
                          };
                          const c = map[row.category] ?? { label: row.category, color: 'bg-gray-100 text-gray-700' };
                          return (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        }
                        const c = getCategory(row.monthlyFee);
                        const colorMap: Record<string, string> = {
                          vip: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg',
                          platinum: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md',
                          gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md',
                          simple: 'bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white shadow-md',
                        };
                        return (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${colorMap[c.key] || 'bg-gray-100 text-gray-700'}`}>
                            {c.label}
                          </span>
                        );
                      })()}
                    </td>
                    {onConnect && (
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Предотвращаем клик по строке
                            onConnect(row);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white rounded-xl hover:from-[#0A7B75]/90 hover:to-[#0A7B75] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium"
                        >
                          ⚡ Подключить
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
                <tr className="bg-gradient-to-r from-[#0A7B75]/10 to-[#0A7B75]/5">
                  <td className="px-6 py-4 text-sm font-bold text-[#0A7B75] border-l-4 border-[#0A7B75]" colSpan={onConnect ? 7 : 6}>
                    ☎️ Номера 800 ({tfRows.length})
                  </td>
                </tr>
                {tfRows.map((row, index) => (
                  <tr
                    key={`tf-${row.id}`}
                    className={`hover:bg-gradient-to-r hover:from-[#0A7B75]/5 hover:to-transparent group transition-all duration-200 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-[#0A7B75]/2'}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0A7B75] to-[#0A7B75]/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {row.countryCode?.slice(0, 2) || '🌍'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{row.countryName}</div>
                          <div className="text-xs text-[#0A7B75] font-medium">{row.countryCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">—</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                        ☎️ 800: {row.number800}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#0A7B75] bg-[#0A7B75]/10 px-3 py-1 rounded-lg">
                        ${(row.connectionFee / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        ${(row.monthlyFee / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        if (row.category) {
                          const map: Record<string, { label: string; color: string }> = {
                            vip: { label: '💎 VIP', color: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' },
                            platinum: { label: '⚪ Платиновые', color: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md' },
                            gold: { label: '🟡 Золотые', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md' },
                            simple: { label: '🔵 Простые', color: 'bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white shadow-md' },
                          };
                          const c = map[row.category] ?? { label: row.category, color: 'bg-gray-100 text-gray-700' };
                          return (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        }
                        const c = getCategory(row.monthlyFee);
                        const colorMap: Record<string, string> = {
                          vip: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg',
                          platinum: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md',
                          gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md',
                          simple: 'bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white shadow-md',
                        };
                        return (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${colorMap[c.key] || 'bg-gray-100 text-gray-700'}`}>
                            {c.label}
                          </span>
                        );
                      })()}
                    </td>
                    {onConnect && (
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Предотвращаем клик по строке
                            onConnect(row);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white rounded-xl hover:from-[#0A7B75]/90 hover:to-[#0A7B75] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium"
                        >
                          ⚡ Подключить
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
                  className="px-6 py-16 text-center text-gray-500"
                  colSpan={onConnect ? 7 : 6}
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0A7B75]/20 to-[#0A7B75]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-3xl">📱</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-700 mb-2">Нет доступных номеров</div>
                    <div className="text-sm text-[#0A7B75]">Попробуйте изменить фильтры или поисковый запрос</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with refresh button */}
      <div className="p-6 border-t border-[#0A7B75]/20 bg-gradient-to-r from-[#0A7B75]/5 to-transparent flex justify-between items-center">
        <div className="text-sm text-[#0A7B75] font-medium">
          Показано: {filteredData.length} номеров
        </div>
        <button
          onClick={reload}
          className="px-6 py-2 bg-gradient-to-r from-[#0A7B75] to-[#0A7B75]/90 text-white rounded-xl hover:from-[#0A7B75]/90 hover:to-[#0A7B75] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium"
        >
          🔄 Обновить
        </button>
      </div>
    </div>
  );
}
