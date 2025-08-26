import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Обзор',
    icon: '📊',
    description: 'Главная страница дашборда'
  },
  {
    path: '/dashboard/profile',
    label: 'Профиль',
    icon: '👤',
    description: 'Личные данные и баланс'
  },
  {
    path: '/dashboard/connected-numbers',
    label: 'Мои номера',
    icon: '📱',
    description: 'Подключенные номера'
  },
  {
    path: '/dashboard/available-numbers',
    label: 'Доступные номера',
    icon: '🔍',
    description: 'Поиск и подключение номеров'
  }
];

const DashboardNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-xl font-bold mb-6 text-slate-900">Навигация</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className={`font-semibold mb-1 ${
                  isActive ? 'text-blue-700' : 'text-slate-700'
                }`}>
                  {item.label}
                </div>
                <div className={`text-xs ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardNavigation;
