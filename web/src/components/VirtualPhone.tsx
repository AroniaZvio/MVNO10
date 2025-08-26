import React, { useState, useEffect } from 'react';

interface VirtualPhoneProps {
  activeNumber: string;
  userBalance: number;
  onClose: () => void;
}

const VirtualPhone: React.FC<VirtualPhoneProps> = ({ activeNumber, userBalance, onClose }) => {
  const [dialedNumber, setDialedNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);

  // Обработка нажатия клавиш
  const handleKeyPress = (key: string) => {
    if (dialedNumber.length < 15) { // Ограничиваем длину номера
      setDialedNumber(prev => prev + key);
    }
  };

  // Удаление последней цифры
  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  // Начало звонка
  const handleCall = () => {
    if (dialedNumber.length > 0) {
      setIsCallActive(true);
      // Здесь будет логика звонка
      setTimeout(() => {
        alert(`Звонок на номер ${dialedNumber} с ${activeNumber}\n\nФункция звонков в разработке!`);
        setIsCallActive(false);
        setDialedNumber('');
      }, 1000);
    }
  };

  // Обработка нажатия Escape для закрытия
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Предотвращаем закрытие при клике на модальное окно
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const dialpadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const keyLabels = {
    '1': 'ABC',
    '2': 'АБВГ',
    '3': 'DEF',
    '4': 'GHI',
    '5': 'JKL',
    '6': 'MNO',
    '7': 'PQRS',
    '8': 'TUV',
    '9': 'WXYZ',
    '*': '',
    '0': '+',
    '#': ''
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-3xl w-96 max-w-[90vw] h-[600px] max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="text-xs opacity-90">Активный номер</div>
              <div className="text-sm font-medium">{activeNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-90">Баланс</div>
              <div className="text-sm font-medium">${(userBalance / 100).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Number Input */}
          <div className="text-center mb-8">
            <div className="text-3xl font-light text-gray-800 font-mono tracking-wider">
              {dialedNumber || 'Введите номер'}
            </div>
          </div>

          {/* Dialpad */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              {dialpadKeys.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-4">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex flex-col items-center justify-center"
                    >
                      <div className="text-2xl font-semibold text-gray-800">{key}</div>
                      {keyLabels[key as keyof typeof keyLabels] && (
                        <div className="text-xs text-gray-500 mt-1">
                          {keyLabels[key as keyof typeof keyLabels]}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            {/* Video Call Button */}
            <button className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Call Button */}
            <button
              onClick={handleCall}
              disabled={dialedNumber.length === 0 || isCallActive}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isCallActive 
                  ? 'bg-red-500 animate-pulse' 
                  : dialedNumber.length > 0 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isCallActive ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
            </button>

            {/* Backspace Button */}
            <button
              onClick={handleBackspace}
              disabled={dialedNumber.length === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                dialedNumber.length > 0 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.89-6.89a2 2 0 012.83 0L21 12a2 2 0 01-2.83 2.83L12 9.17l-6.17 6.17A2 2 0 013 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualPhone;
