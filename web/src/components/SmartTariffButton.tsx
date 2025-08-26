import { Link } from 'react-router-dom';

interface SmartTariffButtonProps {
  className?: string;
}

export default function SmartTariffButton({ className }: SmartTariffButtonProps) {
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    // Для авторизованных пользователей - кнопка "Подключить тариф"
    return (
      <Link
        to="/tariff-plans"
        className={`px-6 py-3 rounded-xl text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-center text-base ${className}`}
        style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
      >
        🚀 Тарифные планы
      </Link>
    );
  }

  // Для гостей - кнопка "Зарегистрироваться"
  return (
    <Link
      to="/register"
      className={`px-6 py-3 rounded-xl text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-center text-base ${className}`}
      style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
    >
      ✨ Зарегистрироваться
    </Link>
  );
}
