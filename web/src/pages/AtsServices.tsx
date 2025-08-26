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
          <h1 className="text-4xl font-bold mb-4" style={{color: '#0A7B75'}}>
            🌐 Облачная АТС под ваши задачи
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Телефонизация офиса за 5 минут — быстрое подключение без оборудования и кабелей
          </p>
        </div>

        {/* 6 блоков услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Блок 1: Для бизнеса любого масштаба */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              Для бизнеса любого масштаба
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Решение подходит как для физических лиц, так и для организаций. 
              Гибкая настройка под ваши потребности.
            </p>
          </div>

          {/* Блок 2: Доступный Call-центр */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">📞</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              Доступный Call-центр
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Настройте горячую линию без лишних затрат. 
              Профессиональное обслуживание клиентов.
            </p>
          </div>

          {/* Блок 3: Единая сеть по всему миру */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              Единая сеть по всему миру
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Объединяйте офисы и филиалы в одну систему связи. 
              Глобальное присутствие без границ.
            </p>
          </div>

          {/* Блок 4: Номера в любом городе */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🏙️</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              Номера в любом городе
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Многоканальная связь для клиентов из разных регионов. 
              Поддержка 800 (toll-free) номеров.
            </p>
          </div>

          {/* Блок 5: CRM-интеграции */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              CRM-интеграции без ограничений
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Полная синхронизация с нашей бесплатной Teamsale CRM и популярными системами 
              (Bitrix24, Zoho, HubSpot и др.).
            </p>
          </div>

          {/* Блок 6: Быстрое подключение */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#0A7B75'}}>
              Быстрое подключение
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Телефонизация офиса за 5 минут без оборудования и кабелей. 
              Простая настройка и мгновенный запуск.
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 rounded-lg text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
            >
              Подключить АТС
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-3 rounded-lg border-2 font-semibold hover:bg-slate-50 transition-all duration-200"
              style={{borderColor: '#0A7B75', color: '#0A7B75'}}
            >
              Вернуться в дашборд
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsServices;
