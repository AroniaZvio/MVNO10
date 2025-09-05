import React from 'react';
import { Link } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';

const AtsServices: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardNavigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Заголовок страницы */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#0A7B75' }}>
            🌐 Cloud PBX for your needs
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Office telephony in 5 minutes — quick setup without equipment and cables
          </p>
        </div>

        {/* 6 блоков услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {/* Блок 1: Для бизнеса любого масштаба */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              For businesses of any scale
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Solution suitable for both individuals and organizations.
              Flexible configuration for your needs.
            </p>
          </div>

          {/* Блок 2: Доступный Call-центр */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">📞</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              Affordable Call Center
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Set up a hotline without extra costs.
              Professional customer service.
            </p>
          </div>

          {/* Блок 3: Единая сеть по всему миру */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              Unified network worldwide
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Connect offices and branches into one communication system.
              Global presence without borders.
            </p>
          </div>

          {/* Блок 4: Номера в любом городе */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🏙️</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              Numbers in any city
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Multi-channel communication for clients from different regions.
              Support for 800 (toll-free) numbers.
            </p>
          </div>

          {/* Блок 5: CRM-интеграции */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              Unlimited CRM integrations
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Full synchronization with our free Teamsale CRM and popular systems
              (Bitrix24, Zoho, HubSpot, etc.).
            </p>
          </div>

          {/* Блок 6: Быстрое подключение */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A7B75' }}>
              Quick connection
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Office telephony in 5 minutes without equipment and cables.
              Simple setup and instant launch.
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 rounded-lg text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              style={{ background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)' }}
            >
              Connect PBX
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-3 rounded-lg border-2 font-semibold hover:bg-slate-50 transition-all duration-200"
              style={{ borderColor: '#0A7B75', color: '#0A7B75' }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsServices;
