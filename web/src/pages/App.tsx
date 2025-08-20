import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PhoneNumbersTable, { type PhoneNumberRow } from '../components/PhoneNumbersTable';
import { reserveMyNumber, canReserveMoreNumbers } from '../lib/myNumber';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export default function App() {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isTariffsDropdownOpen, setIsTariffsDropdownOpen] = useState(false);
  const [isForWhoDropdownOpen, setIsForWhoDropdownOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="block group">
            {/* Логотип на всю ширину */}
            <div className="h-12 w-auto max-w-[200px] group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo/logo.png" 
                alt="Mobilive Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {/* Dropdown меню для Услуги */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
               <button className="flex items-center gap-1 text-slate-700 hover:transition-colors relative after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all hover:after:bg-[#1C9C94]">
                 Услуги
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающее меню Услуги - 2 колонки */}
              <div className={`absolute top-full left-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                isServicesDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="grid grid-cols-2 gap-0">
                  {/* Колонка 1 - Основные услуги */}
                  <div className="p-4 border-r border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Основные услуги</h4>
                    
                                         <Link 
                       to="/numbers" 
                       className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"

                       onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                       onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                     >
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                         📱
                       </div>
                      <div>
                        <div className="font-medium">Телефонные номера</div>
                        <div className="text-xs text-slate-500">Красивые и простые номера</div>
                      </div>
                    </Link>
                    
                                         <Link 
                       to="/esim" 
                       className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                       onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                       onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                     >
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                         📟
                       </div>
                      <div>
                        <div className="font-medium">eSIM</div>
                        <div className="text-xs text-slate-500">Виртуальные SIM-карты</div>
                      </div>
                    </Link>
                    
                                         <Link 
                       to="/sms" 
                       className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                       onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                       onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                     >
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                         💬
                       </div>
                      <div>
                        <div className="font-medium">SMS</div>
                        <div className="text-xs text-slate-500">Сообщения и рассылки</div>
                      </div>
                    </Link>
                  </div>

                  {/* Колонка 2 - Для бизнеса */}
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Для бизнеса</h4>
                    
                                         <Link 
                       to="/virtual-pbx" 
                       className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                       onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                       onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                     >
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                         🏢
                       </div>
                      <div>
                        <div className="font-medium">Виртуальная АТС</div>
                        <div className="text-xs text-slate-500">Корпоративная телефония</div>
                      </div>
                    </Link>
                    
                                         <Link 
                       to="/crm" 
                       className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                       onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                       onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                     >
                       <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                         📊
                       </div>
                      <div>
                        <div className="font-medium">CRM</div>
                        <div className="text-xs text-slate-500">Управление клиентами</div>
                      </div>
                    </Link>

                    {/* Дополнительное место для будущих B2B услуг */}
                    <div className="px-2 py-3 text-center">
                      <div className="text-xs text-slate-400 italic">
                        Больше B2B решений скоро...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown меню для Тарифы */}
            <div 
              className="relative"
              onMouseEnter={() => setIsTariffsDropdownOpen(true)}
              onMouseLeave={() => setIsTariffsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
                Тарифы
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isTariffsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающее меню Тарифы */}
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                isTariffsDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="py-2">
                                     <Link 
                     to="/plans" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                       📦
                     </div>
                    <div>
                      <div className="font-medium">Тарифные пакеты</div>
                      <div className="text-xs text-slate-500">Выберите подходящий тариф</div>
                    </div>
                  </Link>
                  
                                     <Link 
                     to="/tariff-numbers" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                       📱
                     </div>
                    <div>
                      <div className="font-medium">Телефонные номера</div>
                      <div className="text-xs text-slate-500">Тарификация номеров</div>
                    </div>
                  </Link>
                  
                                     <Link 
                     to="/tariff-calls" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                       📞
                     </div>
                    <div>
                      <div className="font-medium">Звонки</div>
                      <div className="text-xs text-slate-500">Тарификация звонков</div>
                    </div>
                  </Link>
                  
                                     <Link 
                     to="/tariff-sms" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                       💬
                     </div>
                    <div>
                      <div className="font-medium">SMS</div>
                      <div className="text-xs text-slate-500">Тарификация сообщений</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown меню для Для кого */}
            <div 
              className="relative"
              onMouseEnter={() => setIsForWhoDropdownOpen(true)}
              onMouseLeave={() => setIsForWhoDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
                Для кого
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isForWhoDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающее меню Для кого */}
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
                isForWhoDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="py-2">
                                     <Link 
                     to="/call-centers" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                       📞
                     </div>
                    <div>
                      <div className="font-medium">Колл-центры</div>
                      <div className="text-xs text-slate-500">Решения для контакт-центров</div>
                    </div>
                  </Link>
                  
                                     <Link 
                     to="/corporate" 
                     className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                     onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                     onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                   >
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                       🏢
                     </div>
                    <div>
                      <div className="font-medium">Корпоративное подключение</div>
                      <div className="text-xs text-slate-500">Корпоративные телеком решения</div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/small-business" 
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                    onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                      🏪
                    </div>
                    <div>
                      <div className="font-medium">Малый бизнес</div>
                      <div className="text-xs text-slate-500">Доступные решения для МСБ</div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/remote-work" 
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                    onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>
                      💻
                    </div>
                    <div>
                      <div className="font-medium">Удаленная работа</div>
                      <div className="text-xs text-slate-500">Связь для удаленных команд</div>
                    </div>
          </Link>
                </div>
              </div>
            </div>
          </nav>
          
                     <div className="flex items-center gap-3">
            <Link
              to="/login"
               className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
            >
              Вход
            </Link>
            <Link
              to="/register"
               className="px-5 py-2.5 rounded-xl text-white hover:shadow-lg transition-all duration-200 font-medium"
               style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 4px 14px rgba(10, 123, 117, 0.25)'}}
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      {/* Доступные номера directly under header */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-semibold mb-3">Доступные номера</h3>
            <HeroPhoneNumbers />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#0A7B75]/20 to-[#1C9C94]/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#1C9C94]/20 to-[#0A7B75]/20 blur-3xl"></div>
            </div>

  <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24">
          <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Features Card — справа */}
            <div className="relative order-2 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A7B75]/10 to-[#1C9C94]/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">🎯 Готовый функционал</h3>
                  <p className="text-slate-600">Все необходимое для запуска MVNO</p>
          </div>

                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                      ✓
                    </div>
                <div>
                      <div className="font-semibold text-slate-800 mb-1">📧 Подключение виртуального номера и eSIM</div>
                </div>
              </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                      ✓
                    </div>
                <div>
                      <div className="font-semibold text-slate-800 mb-1">🔐 Готовые решения для бизнеса</div>
                </div>
              </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>
                      ✓
                    </div>
                <div>
                      <div className="font-semibold text-slate-800 mb-1">⚡ Колл-центр</div>
                </div>
              </li>
            </ul>
              </div>
            </div>

            {/* Text content — слева */}
            <div className="text-center lg:text-left order-1 lg:order-1">

                             <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                 <span style={{color: '#0A7B75'}}>
                   Мобильная связь
                 </span>
                 <br />
                 <span style={{color: '#1C9C94'}}>
                   нового поколения
                 </span>
               </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Современная MVNO платформа с полным циклом управления: от регистрации 
                до администрирования тарифов. Готовое решение для запуска виртуального оператора.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                                 <Link
                   to="/plans"
                   className="px-8 py-4 rounded-xl text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-center"
                   style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
                 >
                   🚀 Смотреть тарифы
                 </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-white hover:shadow-lg transition-all duration-200 text-center"
                >
                  ✨ Начать сейчас
                </Link>
              </div>

              {/* Public phone numbers table was here in the hero; moved to render under header for easier access */}
              

          </div>
        </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <div className="h-10 w-auto max-w-[150px]">
                  <img 
                    src="/logo/logo.png" 
                    alt="Mobilive Logo" 
                    className="h-full w-auto object-contain brightness-0 invert opacity-90"
                  />
                </div>
              </div>
              <p className="text-white/85 mb-4 max-w-md">
                Современная MVNO платформа для запуска виртуального мобильного оператора
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Платформа</h4>
              <ul className="space-y-2 text-white/85">
                <li><Link to="/plans" className="hover:text-white transition-colors">Тарифы</Link></li>
                <li><Link to="/numbers" className="hover:text-white transition-colors">Номера</Link></li>
                <li><Link to="/esim" className="hover:text-white transition-colors">eSIM</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Аккаунт</h4>
              <ul className="space-y-2 text-white/85">
                <li><Link to="/login" className="hover:text-white transition-colors">Вход</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Регистрация</Link></li>
                <li><Link to="/forgot-password" className="hover:text-white transition-colors">Восстановление пароля</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/85">
            © {new Date().getFullYear()} Mobilive (MVNO10). Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroPhoneNumbers() {
  const [rows, setRows] = useState<PhoneNumberRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/phone-numbers/public`);
        if (!r.ok) throw new Error('Не удалось получить список номеров');
        setRows(await r.json());
        setErr(null);
      } catch (e: unknown) {
        const ex = e as { message?: string } | undefined;
        setErr(ex?.message ?? String(e ?? 'Ошибка'));
      }
    })();
  }, []);

  function handleBuy(row: PhoneNumberRow) {
    const token = localStorage.getItem('token');
    if (!token) {
      // redirect unauthenticated users to the registration page (full URL)
      window.location.href = 'http://localhost:5173/register';
      return;
    }
    if (!canReserveMoreNumbers()) {
      setErr('Достигнут лимит брони (макс. 5)');
      return;
    }
    const res = reserveMyNumber({ id: row.id, mobileNumber: row.mobileNumber, countryName: row.countryName, countryCode: row.countryCode });
    if (res) {
      setErr(null);
      // notify other parts
      try { window.dispatchEvent(new Event('my-numbers-updated')); } catch { /* ignore */ }
    } else {
      setErr('Не удалось забронировать номер');
    }
  }

  return (
    <div>
      {err && <div className="text-red-600 mb-2">{err}</div>}
  {/* authRequired modal removed; unauthenticated users are redirected to /register on Buy */}
  <PhoneNumbersTable rows={rows} onBuy={handleBuy} readOnly={true} buyRedirectUrl={'http://localhost:5173/register'} />
    </div>
  );
}
