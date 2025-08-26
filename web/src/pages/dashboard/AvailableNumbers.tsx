import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableNumbersTable from '../../components/numbers/AvailableNumbersTable';
import DashboardNavigation from '../../components/DashboardNavigation';
import { type AvailableNumber } from '../../hooks/useAvailableNumbers';

const AvailableNumbers: React.FC = () => {
  const navigate = useNavigate();

  const handleConnect = (row: AvailableNumber) => {
    navigate('/connect-number', { 
      state: { 
        id: row.id, 
        mobileNumber: row.mobileNumber,
        connectionFee: row.connectionFee,
        monthlyFee: row.monthlyFee,
        countryName: row.countryName,
        countryCode: row.countryCode
      } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Доступные номера</h1>
          <p className="text-slate-600">Поиск и подключение новых номеров для вашего бизнеса</p>
        </div>

        <AvailableNumbersTable 
          onConnect={handleConnect}
          className="shadow-sm"
        />
      </div>
    </div>
  );
};

export default AvailableNumbers;
