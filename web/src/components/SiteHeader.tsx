import { Link } from "react-router-dom";
import { useState } from "react";

export default function SiteHeader() {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isTariffsDropdownOpen, setIsTariffsDropdownOpen] = useState(false);
  const [_isForWhoDropdownOpen, _setIsForWhoDropdownOpen] = useState(false);

  return (
    <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="block group">
          <div className="h-12 w-auto max-w-[200px] group-hover:scale-105 transition-transform duration-200">
            <img src="/logo/logo.png" alt="Mobilive Logo" className="h-full w-auto object-contain" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* Услуги */}
          <div
            className="relative"
            onMouseEnter={() => setIsServicesDropdownOpen(true)}
            onMouseLeave={() => setIsServicesDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-slate-700 hover:transition-colors relative after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all hover:after:bg-[#1C9C94]">
              Услуги
              <svg className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`absolute top-full left-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
              isServicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}>
              <div className="grid grid-cols-2 gap-0">
                <div className="p-4 border-r border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Основные услуги</h4>
                  <Link to="/numbers" className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                    onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                    onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>📱</div>
                    <div>
                      <div className="font-medium">Телефонные номера</div>
                      <div className="text-xs text-slate-500">Красивые и простые номера</div>
                    </div>
                  </Link>
                  <Link to="/esim" className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                    onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                    onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>📟</div>
                    <div>
                      <div className="font-medium">eSIM</div>
                      <div className="text-xs text-slate-500">Виртуальные SIM-карты</div>
                    </div>
                  </Link>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Для бизнеса</h4>
                  <Link to="/virtual-pbx" className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                    onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75'}}
                    onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)`}}>🏢</div>
                    <div>
                      <div className="font-medium">Виртуальная АТС</div>
                      <div className="text-xs text-slate-500">Корпоративная телефония</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Тарифы */}
          <div
            className="relative"
            onMouseEnter={() => setIsTariffsDropdownOpen(true)}
            onMouseLeave={() => setIsTariffsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
              Тарифы
              <svg className={`w-4 h-4 transition-transform duration-200 ${isTariffsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${
              isTariffsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}>
              <div className="py-2">
                <Link to="/plans" className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                  onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                  onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>📦</div>
                  <div>
                    <div className="font-medium">Тарифные пакеты</div>
                    <div className="text-xs text-slate-500">Выберите подходящий тариф</div>
                  </div>
                </Link>
                <Link to="/tariff-numbers" className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                  onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94'}}
                  onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''}}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)`}}>📱</div>
                  <div>
                    <div className="font-medium">Телефонные номера</div>
                    <div className="text-xs text-slate-500">Тарификация номеров</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white hover:shadow-md transition-all duration-200 font-medium">Вход</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl text-white hover:shadow-lg transition-all duration-200 font-medium" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 4px 14px rgba(10, 123, 117, 0.25)'}}>Регистрация</Link>
        </div>
      </div>
    </header>
  );
}

