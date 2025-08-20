import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../lib/adminApi';
import PhoneNumbersTable from '../components/PhoneNumbersTable';
import type { PhoneNumberRow } from '../components/PhoneNumbersTable';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export default function AdminPhoneNumbers() {
  const [rows, setRows] = useState<PhoneNumberRow[]>([]);
  const [form, setForm] = useState({
    countryCode: '+995',
    countryName: 'Georgia',
  category: '',
    mobileNumber: '',
    number800: '',
    connectionFee: '0',
    monthlyFee: '0',
  });
  const [activeTab, setActiveTab] = useState<'mobile'|'tf'>('mobile');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRows() {
    try {
      setLoadingData(true);
      const r = await fetch(`${API}/api/phone-numbers/public`);
      if (!r.ok) throw new Error('Не удалось получить список номеров');
      setRows(await r.json());
      setError(null);
    } catch (err: unknown) {
      type ErrLike = { message?: string; response?: { data?: { message?: string } } };
      const e = err as ErrLike;
      const msg = e?.message ?? String(err ?? '');
      setError('Ошибка загрузки данных: ' + (msg || 'Неизвестная ошибка'));
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  // Portal target: try to find this container and render the table there.
  const portalSelector = '#root > div > div > div.grid.grid-cols-1.lg\\:grid-cols-3.gap-8';
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.querySelector(portalSelector) as HTMLElement | null;
    setPortalTarget(el);
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!form.countryCode || !form.countryName || (activeTab==='mobile' && !form.mobileNumber) || (activeTab==='tf' && !form.number800)) {
      setError('Заполните обязательные поля для выбранного типа номера');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      await adminApi.createPhoneNumber({
        countryCode: form.countryCode,
        countryName: form.countryName,
      category: form.category || null,
        mobileNumber: activeTab==='mobile' ? form.mobileNumber : '',
        number800: activeTab==='tf' ? (form.number800 || null) : null,
        connectionFee: Number(form.connectionFee || 0),
        monthlyFee: Number(form.monthlyFee || 0),
      });

      // Очищаем только изменяемые поля
    setForm(prev => ({ ...prev, mobileNumber: '', number800: '', category: '' }));
      
      await fetchRows();
    } catch (err: unknown) {
      // try to read axios-like response or generic message
      type ErrLike = { message?: string; response?: { data?: { message?: string } } };
      const e = err as ErrLike;
      const msg = e?.response?.data?.message ?? e?.message ?? String(err ?? '');
      setError('Ошибка добавления: ' + msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Вы уверены, что хотите удалить этот номер?')) {
      return;
    }

    try {
      await adminApi.deletePhoneNumber(id);
      await fetchRows();
    } catch (err: unknown) {
      type ErrLike = { message?: string; response?: { data?: { message?: string } } };
      const e = err as ErrLike;
      const msg = e?.response?.data?.message ?? e?.message ?? String(err ?? '');
      setError('Ошибка удаления: ' + msg);
    }
  }

  if (loadingData) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Админ — Телефонные номера</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Админ — Телефонные номера</h1>

      {/* Форма добавления */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Добавить новый номер</h2>

        {/* Табы для выбора типа */}
        <div className="mb-4 inline-flex rounded-xl overflow-hidden border" style={{borderColor:'#1C9C94'}}>
          <button onClick={()=>setActiveTab('mobile')} className={`px-4 py-2 text-sm font-medium ${activeTab==='mobile'?'text-white':'text-slate-700'}`} style={activeTab==='mobile'?{background: 'linear-gradient(to right, #0A7B75, #1C9C94)'}:{}}>
            Мобильный
          </button>
          <button onClick={()=>setActiveTab('tf')} className={`px-4 py-2 text-sm font-medium ${activeTab==='tf'?'text-white':'text-slate-700'}`} style={activeTab==='tf'?{background: 'linear-gradient(to right, #0A7B75, #1C9C94)'}:{}}>
            Номер 800
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Код страны <span className="text-red-500">*</span>
              </label>
              <input
                name="countryCode"
                value={form.countryCode}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+995"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название страны <span className="text-red-500">*</span>
              </label>
              <input
                name="countryName"
                value={form.countryName}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Georgia"
                required
              />
            </div>
            
            {activeTab==='mobile' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Мобильный номер <span className="text-red-500">*</span>
                </label>
                <input
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+995 555 12 34 56"
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab==='tf' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер 800 <span className="text-red-500">*</span>
                </label>
                <input
                  name="number800"
                  value={form.number800}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="800-123-456"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подключение, $
              </label>
              <input
                name="connectionFee"
                type="number"
                min="0"
                value={form.connectionFee}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: (e.target as HTMLSelectElement).value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">(не указана)</option>
                  <option value="simple">Простые</option>
                  <option value="gold">Золотые</option>
                  <option value="platinum">Платиновые</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Абонплата, $
              </label>
              <input
                name="monthlyFee"
                type="number"
                min="0"
                value={form.monthlyFee}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
            >
              {loading ? 'Добавляю...' : 'Добавить'}
            </button>
            
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Таблица номеров (рендерится через портал в указанный контейнер, если он найден) */}
      {(() => {
        const tableBox = (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Список номеров ({rows.length})</h2>
            </div>

            {rows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Номера не найдены. Добавьте первый номер используя форму выше.
            </div>
          ) : (
            <PhoneNumbersTable
              rows={rows}
              readOnly={false}
              onDeleteClick={handleDelete}
              render800ToSelector={"#root > div > main > div > div.bg-white.rounded-lg.border.p-6"}
            />
          )}
          </div>
        );

        // Если цель найдена, рендерим туда через портал, иначе оставляем в текущем месте
        return portalTarget ? createPortal(tableBox, portalTarget) : tableBox;
      })()}
    </div>
  );
}
