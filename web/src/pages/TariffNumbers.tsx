
import SiteHeader from '../components/SiteHeader';
import AvailableNumbersTable from '../components/numbers/AvailableNumbersTable';

export default function TariffNumbers() {
  return (
    <div>
      <SiteHeader />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Телефонные номера</h2>
          <p className="text-slate-600">Просмотр доступных номеров для подключения</p>
        </div>

        <AvailableNumbersTable 
          className="shadow-sm"
        />
      </div>
    </div>
  );
}

