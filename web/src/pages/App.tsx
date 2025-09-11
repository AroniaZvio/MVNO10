import { Link } from "react-router-dom";
import { useState } from "react";
import MainPageNumbersDisplay from '../components/numbers/MainPageNumbersDisplay';

import SmartTariffButton from '../components/SmartTariffButton';


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
                Services
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
              <div className={`absolute top-full left-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${isServicesDropdownOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="grid grid-cols-2 gap-0">
                  {/* Колонка 1 - Основные услуги */}
                  <div className="p-4 border-r border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">Main Services</h4>

                    <Link
                      to="/numbers"
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"

                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                        📱
                      </div>
                      <div>
                        <div className="font-medium">Phone Numbers</div>
                        <div className="text-xs text-slate-500">Beautiful and simple numbers</div>
                      </div>
                    </Link>

                    <Link
                      to="/esim"
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                        📟
                      </div>
                      <div>
                        <div className="font-medium">eSIM</div>
                        <div className="text-xs text-slate-500">Virtual SIM cards</div>
                      </div>
                    </Link>

                    <Link
                      to="/sms"
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                        💬
                      </div>
                      <div>
                        <div className="font-medium">SMS</div>
                        <div className="text-xs text-slate-500">Messages and broadcasts</div>
                      </div>
                    </Link>
                  </div>

                  {/* Колонка 2 - Для бизнеса */}
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 px-2">For Business</h4>

                    <Link
                      to="/virtual-pbx"
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)` }}>
                        🏢
                      </div>
                      <div>
                        <div className="font-medium">Virtual PBX</div>
                        <div className="text-xs text-slate-500">Corporate telephony</div>
                      </div>
                    </Link>

                    <Link
                      to="/crm"
                      className="flex items-center gap-3 px-2 py-3 text-slate-700 transition-colors rounded-lg"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)` }}>
                        📊
                      </div>
                      <div>
                        <div className="font-medium">CRM</div>
                        <div className="text-xs text-slate-500">Customer management</div>
                      </div>
                    </Link>

                    {/* Дополнительное место для будущих B2B услуг */}
                    <div className="px-2 py-3 text-center">
                      <div className="text-xs text-slate-400 italic">
                        More B2B solutions coming soon...
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
                Tariffs
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
              <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${isTariffsDropdownOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="py-2">
                  <Link
                    to="/plans"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      📦
                    </div>
                    <div>
                      <div className="font-medium">Tariff Packages</div>
                      <div className="text-xs text-slate-500">Choose the right tariff</div>
                    </div>
                  </Link>

                  <Link
                    to="/tariff-numbers"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      📱
                    </div>
                    <div>
                      <div className="font-medium">Phone Numbers</div>
                      <div className="text-xs text-slate-500">Number pricing</div>
                    </div>
                  </Link>

                  <Link
                    to="/tariff-calls"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      📞
                    </div>
                    <div>
                      <div className="font-medium">Calls</div>
                      <div className="text-xs text-slate-500">Call pricing</div>
                    </div>
                  </Link>

                  <Link
                    to="/tariff-sms"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      💬
                    </div>
                    <div>
                      <div className="font-medium">SMS</div>
                      <div className="text-xs text-slate-500">SMS pricing</div>
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
                For Whom
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
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${isForWhoDropdownOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="py-2">
                  <Link
                    to="/call-centers"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      📞
                    </div>
                    <div>
                      <div className="font-medium">Call Centers</div>
                      <div className="text-xs text-slate-500">Contact center solutions</div>
                    </div>
                  </Link>

                  <Link
                    to="/corporate"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)` }}>
                      🏢
                    </div>
                    <div>
                      <div className="font-medium">Corporate Connection</div>
                      <div className="text-xs text-slate-500">Corporate telecom solutions</div>
                    </div>
                  </Link>

                  <Link
                    to="/small-business"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(28, 156, 148, 0.1)'; e.currentTarget.style.color = '#1C9C94' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                      🏪
                    </div>
                    <div>
                      <div className="font-medium">Small Business</div>
                      <div className="text-xs text-slate-500">Affordable solutions for SMB</div>
                    </div>
                  </Link>

                  <Link
                    to="/remote-work"
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(10, 123, 117, 0.1)'; e.currentTarget.style.color = '#0A7B75' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: `linear-gradient(to bottom right, #1C9C94, #0A7B75)` }}>
                      💻
                    </div>
                    <div>
                      <div className="font-medium">Remote Work</div>
                      <div className="text-xs text-slate-500">Communication for remote teams</div>
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
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-white hover:shadow-lg transition-all duration-200 font-medium"
              style={{ background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 4px 14px rgba(10, 123, 117, 0.25)' }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Block - объединенный с кнопками */}
      <section className="py-0 bg-[#e8ebea]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white bg-[#0A7B75] px-6 py-4 rounded-lg inline-block">
              A new generation of VoIP for your business
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SmartTariffButton />
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-white hover:shadow-lg hover:border-slate-400 transition-all duration-200 text-center text-base"
              >
                ✨ Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Numbers Section - сразу под шапкой */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <h3 className="text-lg font-semibold mb-2">Available Numbers</h3>
            <MainPageNumbersDisplay />
          </div>
        </div>
      </div>

      {/* AI Functionality Section - ниже таблицы */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-slate-800">
              🚀 AI Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Business automation and AI
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Виртуальный оператор 24/7 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                🤖
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">24/7 Virtual Operator</h3>
              <p className="text-slate-600 text-sm">Voice AI for call automation and customer request processing</p>
            </div>

            {/* Виртуальный менеджер по продажам */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                💼
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Virtual Sales Manager</h3>
              <p className="text-slate-600 text-sm">Sales and consultation automation using AI</p>
            </div>

            {/* ИИ-агент для соцсетей */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto" style={{ background: `linear-gradient(to bottom right, #0A7B75, #1C9C94)` }}>
                📱
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">AI Agent for Social Media</h3>
              <p className="text-slate-600 text-sm">Messenger and social media automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white" style={{ background: `linear-gradient(to right, #0A7B75, #1C9C94)` }}>
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
                Modern MVNO platform for launching a virtual mobile operator
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/85">
                <li><Link to="/plans" className="hover:text-white transition-colors">Tariffs</Link></li>
                <li><Link to="/numbers" className="hover:text-white transition-colors">Numbers</Link></li>
                <li><Link to="/esim" className="hover:text-white transition-colors">eSIM</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-white/85">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/forgot-password" className="hover:text-white transition-colors">Password Recovery</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/85">
            © {new Date().getFullYear()} Mobilive (MVNO10). All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


