import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Админ панель Mobilive</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Пользователи */}
        <Link 
          to="/admin/users"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl">
              👥
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Пользователи</h3>
          </div>
          <p className="text-slate-600 text-sm mb-3">
            Управление пользователями системы, их ролями и статусами
          </p>
          <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Перейти →
          </div>
        </Link>

        {/* Тарифы */}
        <Link 
          to="/admin/plans"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl">
              📦
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Тарифы</h3>
          </div>
          <p className="text-slate-600 text-sm mb-3">
            Создание и редактирование тарифных планов
          </p>
          <div className="text-green-600 text-sm font-medium group-hover:text-green-700">
            Перейти →
          </div>
        </Link>

        {/* Транзакции */}
        <Link 
          to="/admin/transactions"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl">
              💳
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Транзакции</h3>
          </div>
          <p className="text-slate-600 text-sm mb-3">
            Просмотр и управление финансовыми операциями
          </p>
          <div className="text-purple-600 text-sm font-medium group-hover:text-purple-700">
            Перейти →
          </div>
        </Link>

        {/* Телефонные номера */}
        <Link 
          to="/admin/phone-numbers"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xl">
              📱
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Номера</h3>
          </div>
          <p className="text-slate-600 text-sm mb-3">
            Управление телефонными номерами и тарификацией
          </p>
          <div className="text-teal-600 text-sm font-medium group-hover:text-teal-700">
            Перейти →
          </div>
        </Link>
      </div>

      {/* Статистика */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Быстрая статистика</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">-</div>
            <div className="text-sm text-slate-600">Всего пользователей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">-</div>
            <div className="text-sm text-slate-600">Активных тарифов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">-</div>
            <div className="text-sm text-slate-600">Транзакций сегодня</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">-</div>
            <div className="text-sm text-slate-600">Доступных номеров</div>
          </div>
        </div>
      </div>
    </div>
  );
}
