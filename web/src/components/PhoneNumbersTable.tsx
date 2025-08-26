import { useMemo, useState, useEffect } from 'react';

export type PhoneNumberRow = {
  id: number;
  countryName: string;
  countryCode: string;
  category?: string | null;
  mobileNumber: string;
  number800?: string | null;
  connectionFee: number;
  monthlyFee: number;
};

type Props = {
  rows: PhoneNumberRow[];
  readOnly?: boolean;                // в кабинете true
  onDeleteClick?: (id: number) => void; // в админке
  onBuy?: (row: PhoneNumberRow) => void; // действие «Купить»
  actionLabel?: string; // custom label for the primary action button (e.g. 'Подключить номер')
  className?: string;
  render800ToSelector?: string; // optional selector to render 800-number shortcuts via portal
  visibleRows?: number; // number of visible rows before scrolling
  buyRedirectUrl?: string; // if set, clicking 'Купить' redirects to this URL instead of calling onBuy
};

import { createPortal } from 'react-dom';

export default function PhoneNumbersTable({ rows, readOnly = true, onDeleteClick, onBuy, actionLabel, className, render800ToSelector, visibleRows = 4, buyRedirectUrl }: Props) {
  const [categorySort, setCategorySort] = useState<'none' | 'asc' | 'desc'>('none');
  const [filterView, setFilterView] = useState<'all'|'mobile'|'tf'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all'|'vip'|'platinum'|'gold'|'simple'|'other'>('all');

  const [portal800Target, setPortal800Target] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!render800ToSelector) return;
    const el = document.querySelector(render800ToSelector) as HTMLElement | null;
    setPortal800Target(el);
  }, [render800ToSelector]);

  const getCategory = (monthlyFee: number) => {
    // categories based on monthly fee (USD)
    if (monthlyFee >= 10000) return { key: 'vip', label: '💎 VIP', order: 4, color: 'bg-indigo-600 text-white' };
    if (monthlyFee >= 5000) return { key: 'platinum', label: '⚪ Платиновые', order: 3, color: 'bg-gray-200 text-gray-800' };
    if (monthlyFee >= 1500) return { key: 'gold', label: '🟡 Золотые', order: 2, color: 'bg-amber-400 text-gray-900' };
    if (monthlyFee >= 300) return { key: 'simple', label: '🔵 Простые', order: 1, color: 'bg-blue-500 text-white' };
    return { key: 'other', label: '—', order: 0, color: 'bg-gray-100 text-gray-700' };
  };

  const sortedRows = useMemo(() => {
    if (categorySort === 'none') return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      // if explicit category provided by admin, prefer its order mapping
      const mapOrder = (r: PhoneNumberRow) => {
        if (r.category === 'vip') return 4;
        if (r.category === 'platinum') return 3;
        if (r.category === 'gold') return 2;
        if (r.category === 'simple') return 1;
        return getCategory(r.monthlyFee).order;
      };

      const ca = mapOrder(a);
      const cb = mapOrder(b);
      return categorySort === 'asc' ? ca - cb : cb - ca;
    });
    return copy;
  }, [rows, categorySort]);

  const toggleCategorySort = () => {
    setCategorySort(s => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'));
  };
  // approximate row height in px — used to compute scroll area height
  const rowHeightPx = 64;
  // Increase visible area by ~50% to make table appear taller
  const maxBodyHeight = Math.round(visibleRows * rowHeightPx * 1.5);

  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      {/* Header table */}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Страна
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Мобильный номер
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Номер 800
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Подключение
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Абонплата
            </th>
            <th
              onClick={toggleCategorySort}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
              title="Сортировать по категории"
            >
              Категория
              <span className="ml-2 text-xs text-gray-400">{categorySort === 'asc' ? '▲' : categorySort === 'desc' ? '▼' : ''}</span>
            </th>
            {(!readOnly || onBuy || buyRedirectUrl) && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            )}
          </tr>
        </thead>
      </table>

      {/* Scrollable body */}
      <div className="w-full overflow-y-auto bg-white" style={{ maxHeight: `${maxBodyHeight}px` }}>
        <table className="w-full">
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Filter controls */}
            <tr>
              <td colSpan={(!readOnly || onBuy || buyRedirectUrl) ? 7 : 6} className="px-6 py-3">
                <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label="Фильтр номеров">
                  <div className="inline-flex rounded-md shadow-sm" role="tablist" aria-label="Тип номеров">
                    <button onClick={() => setFilterView('all')} className={`px-3 py-1 border border-gray-300 text-sm ${filterView==='all' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'}`}>Все</button>
                    <button onClick={() => setFilterView('mobile')} className={`px-3 py-1 border-t border-b border-gray-300 text-sm ${filterView==='mobile' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'}`}>Мобильные</button>
                    <button onClick={() => setFilterView('tf')} className={`px-3 py-1 border border-gray-300 text-sm ${filterView==='tf' ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'}`}>Номера 800</button>
                  </div>

                  {/* Category filter */}
                  <div className="ml-2 text-sm">
                    <label className="mr-2 text-sm text-gray-600">Категория:</label>
                    <select value={selectedCategory} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value as 'all'|'vip'|'platinum'|'gold'|'simple'|'other')} className="px-2 py-1 border rounded-md text-sm">
                      <option value="all">Все категории</option>
                      <option value="vip">💎 VIP</option>
                      <option value="platinum">⚪ Платиновые</option>
                      <option value="gold">🟡 Золотые</option>
                      <option value="simple">🔵 Простые</option>
                      <option value="other">Другие</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>

            {/* Optionally render a small shortcuts box for 800-numbers into external container */}
            {portal800Target && rows.some(r => r.number800) && createPortal(
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-sm font-semibold mb-2">Номера 800</div>
                <div className="flex flex-wrap gap-2">
                  {rows.filter(r => r.number800).map(r => (
                    <a key={r.id} className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs" href="#">
                      800: {r.number800}
                    </a>
                  ))}
                </div>
              </div>
            , portal800Target)}

            {/* Grouped sections: Mobile numbers first, then 800 numbers */}
            {(() => {
              // Apply category filter first
              const baseFiltered = sortedRows.filter(r => {
                const catKey = (r.category ?? getCategory(r.monthlyFee).key) as string;
                return selectedCategory === 'all' ? true : catKey === selectedCategory;
              });
              const mobileRows = baseFiltered.filter(r => r.mobileNumber);
              const tfRows = baseFiltered.filter(r => r.number800);
              const colSpan = (!readOnly || onBuy || buyRedirectUrl) ? 7 : 6;
              const totalCount = mobileRows.length + tfRows.length;
              const padCount = Math.max(0, visibleRows - totalCount);

              return (
                <>
                  {/* Mobile section header */}
                  { (filterView === 'all' || filterView === 'mobile') && (
                    <>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700" colSpan={colSpan}>
                          Мобильные номера
                        </td>
                      </tr>

                      {mobileRows.map(r => (
                    <tr key={`mob-${r.id}`} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{r.countryName}</div>
                            <div className="text-sm text-gray-500">{r.countryCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.mobileNumber || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">—</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(r.connectionFee / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(r.monthlyFee / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          if (r.category) {
                            const map: Record<string, { label: string; color: string }> = {
                              vip: { label: '💎 VIP', color: 'bg-indigo-600 text-white' },
                              platinum: { label: '⚪ Платиновые', color: 'bg-gray-200 text-gray-800' },
                              gold: { label: '🟡 Золотые', color: 'bg-amber-400 text-gray-900' },
                              simple: { label: '🔵 Простые', color: 'bg-blue-500 text-white' },
                            };
                            const c = map[r.category] ?? { label: r.category, color: 'bg-gray-100 text-gray-700' };
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                                {c.label}
                              </span>
                            );
                          }
                          const c = getCategory(r.monthlyFee);
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        })()}
                      </td>
                      {(!readOnly || onBuy) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {(onBuy || buyRedirectUrl) && (
                              <button onClick={() => {
                                  if (buyRedirectUrl) { window.location.href = buyRedirectUrl; return; }
                                  onBuy?.(r);
                                }} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" title={actionLabel ?? 'Купить'}>{actionLabel ?? 'Купить'}</button>
                            )}
                            {!readOnly && (
                              <button onClick={() => onDeleteClick?.(r.id)} className="text-red-600 hover:text-red-900 focus:outline-none">Удалить</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                      ))}
                    </>
                  )}

                  { (filterView === 'all' || filterView === 'tf') && (
                    <>
                      {/* 800 section header */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700" colSpan={colSpan}>
                          Номера 800
                        </td>
                      </tr>

                      {tfRows.map(r => (
                    <tr key={`tf-${r.id}`} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{r.countryName}</div>
                            <div className="text-sm text-gray-500">{r.countryCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">—</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span title={`Номер 800: ${r.number800}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">800: {r.number800}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(r.connectionFee / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(r.monthlyFee / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          if (r.category) {
                            const map: Record<string, { label: string; color: string }> = {
                              vip: { label: '💎 VIP', color: 'bg-indigo-600 text-white' },
                              platinum: { label: '⚪ Платиновые', color: 'bg-gray-200 text-gray-800' },
                              gold: { label: '🟡 Золотые', color: 'bg-amber-400 text-gray-900' },
                              simple: { label: '🔵 Простые', color: 'bg-blue-500 text-white' },
                            };
                            const c = map[r.category] ?? { label: r.category, color: 'bg-gray-100 text-gray-700' };
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                                {c.label}
                              </span>
                            );
                          }
                          const c = getCategory(r.monthlyFee);
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
                              {c.label}
                            </span>
                          );
                        })()}
                      </td>
                      {(!readOnly || onBuy) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {(onBuy || buyRedirectUrl) && (
                            <button onClick={() => {
                              if (buyRedirectUrl) { window.location.href = buyRedirectUrl; return; }
                              onBuy?.(r);
                            }} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" title={actionLabel ?? 'Купить'}>{actionLabel ?? 'Купить'}</button>
                          )}
                            {!readOnly && (
                              <button onClick={() => onDeleteClick?.(r.id)} className="text-red-600 hover:text-red-900 focus:outline-none">Удалить</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                      ))}

                      {/* Padding empty rows so the table displays at least visibleRows rows */}
                      {padCount > 0 && Array.from({ length: padCount }).map((_, i) => (
                        <tr key={`pad-${i}`} className="opacity-60">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">—</td>
                          {(!readOnly || onBuy) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">&nbsp;</td>
                          )}
                        </tr>
                      ))}
                    </>
                  )}
                </>
              );
            })()}
            {rows.length === 0 && (
              <tr>
                <td 
                  className="px-6 py-12 text-center text-gray-500" 
                  colSpan={(!readOnly || onBuy) ? 7 : 6}
                >
                  Список пуст
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
