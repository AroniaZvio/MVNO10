import React from 'react';
import { Link } from 'react-router-dom';

const VirtualPbx: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Виртуальная АТС</h1>
          <p className="text-slate-600">Корпоративная телефония и быстрые действия</p>
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

        {/* Основной контент Virtual PBX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Информация о Virtual PBX */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0A7B75' }}>О Виртуальной АТС</h2>
            <div className="space-y-4">
              <p className="text-slate-600">
                Виртуальная АТС (IP-АТС) — это современная телефонная система, которая работает через интернет. 
                Она позволяет организовать корпоративную телефонию без покупки дорогостоящего оборудования.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">Преимущества:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li>Экономия на оборудовании и обслуживании</li>
                  <li>Масштабируемость и гибкость настроек</li>
                  <li>Интеграция с CRM и другими системами</li>
                  <li>Удаленная работа сотрудников</li>
                  <li>Запись разговоров и аналитика</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Функции Virtual PBX */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0A7B75' }}>Основные функции</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Внутренние номера</h3>
                  <p className="text-sm text-slate-600">Настройка внутренней связи между сотрудниками</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Маршрутизация звонков</h3>
                  <p className="text-sm text-slate-600">Автоматическое распределение входящих звонков</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Аналитика и отчеты</h3>
                  <p className="text-sm text-slate-600">Детальная статистика звонков и производительности</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Безопасность</h3>
                  <p className="text-sm text-slate-600">Шифрование звонков и защита данных</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка возврата */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад в Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VirtualPbx;
