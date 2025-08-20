import React, { useState } from 'react';
import { reserveMyNumber } from '../lib/myNumber';
import { Link } from 'react-router-dom';

interface Number {
  id: string;
  number: string;
  price: number;
  category: string;
  available: boolean;
}

const AddNumber: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<Number | null>(null);

  // Примеры номеров
  const availableNumbers: Number[] = [
    { id: '1', number: '+7 (900) 123-45-67', price: 300, category: 'simple', available: true },
    { id: '2', number: '+7 (900) 111-22-33', price: 1500, category: 'gold', available: true },
    { id: '3', number: '+7 (900) 777-88-99', price: 5000, category: 'platinum', available: true },
    { id: '4', number: '+7 (900) 555-55-55', price: 10000, category: 'vip', available: true },
    { id: '5', number: '+7 (900) 234-56-78', price: 300, category: 'simple', available: true },
    { id: '6', number: '+7 (900) 333-44-55', price: 2000, category: 'gold', available: true },
  ];

  const filteredNumbers = availableNumbers.filter(num => {
    const matchesCategory = selectedCategory === 'all' || num.category === selectedCategory;
    const matchesSearch = num.number.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleSelectNumber = (number: Number) => {
    setSelectedNumber(number);
  };

  const handleConnectNumber = () => {
    if (!selectedNumber) return;
    // Бронируем выбранный номер, чтобы он появился в списке подключаемых (ожидающих оплату)
    reserveMyNumber({
      id: Number(selectedNumber.id),
      mobileNumber: selectedNumber.number,
      countryName: 'Россия',
      countryCode: '+7'
    }, 60 * 24);
    alert(`Номер ${selectedNumber.number} забронирован. Перейдите в подключённые номера и нажмите «Подключить».`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад к личному кабинету
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <img 
                src="/logo/logo.png" 
                alt="Mobilive" 
                className="h-8"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Подключить номер</h1>
          <p className="text-slate-600">Выберите подходящий номер телефона из доступных вариантов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Фильтры</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Поиск номера
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Введите цифры номера"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Категория номера
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все категории</option>
                  <option value="simple">Простые ($300)</option>
                  <option value="gold">Золотые ($1500+)</option>
                  <option value="platinum">Платиновые ($5000+)</option>
                  <option value="vip">VIP ($10000+)</option>
                </select>
              </div>

              {/* Price Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">ℹ️ Категории номеров</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>🔵 Простые: от $300</div>
                  <div>🟡 Золотые: от $1500</div>
                  <div>⚪ Платиновые: от $5000</div>
                  <div>💎 VIP: от $10000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Numbers List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Доступные номера ({filteredNumbers.length})
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {filteredNumbers.map((number) => (
                    <div
                      key={number.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedNumber?.id === number.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      onClick={() => handleSelectNumber(number)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="text-xl font-mono font-bold text-slate-900">
                            {number.number}
                          </div>
                          <div className="flex items-center gap-2">
                            {number.category === 'simple' && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Простой</span>}
                            {number.category === 'gold' && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Золотой</span>}
                            {number.category === 'platinum' && <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Платиновый</span>}
                            {number.category === 'vip' && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">VIP</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold" style={{color: '#0A7B75'}}>
                              ${number.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">разовый платеж</div>
                          </div>
                          
                          {selectedNumber?.id === number.id && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#1C9C94'}}>
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredNumbers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">😔 Номера не найдены</div>
                    <p className="text-slate-600">Попробуйте изменить критерии поиска</p>
                  </div>
                )}
              </div>
            </div>

            {/* Connect Button */}
            {selectedNumber && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">
                      Выбранный номер: {selectedNumber.number}
                    </h4>
                    <p className="text-slate-600">Стоимость подключения: ${selectedNumber.price.toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={handleConnectNumber}
                    className="px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}
                  >
                    🔗 Подключить номер
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNumber;
