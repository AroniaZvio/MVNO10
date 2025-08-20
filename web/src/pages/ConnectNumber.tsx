import { useLocation, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';

export default function ConnectNumber() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { id?: number; mobileNumber?: string } };

  const id = state?.id;
  const mobileNumber = state?.mobileNumber;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Block 1: Balance */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Баланс</h3>
            <div className="text-3xl font-bold" style={{color: '#0A7B75'}}>$200</div>
            <div className="mt-4">
              <button onClick={() => navigate('/topup')} className="px-4 py-2 rounded-xl text-white font-medium" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>Пополнить баланс</button>
            </div>
          </div>

          {/* Block 2: Personal data */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Личные данные</h3>
            <div className="text-sm text-slate-600">Имя: Иван Иванов</div>
            <div className="text-sm text-slate-600">Email: user@example.com</div>
            <div className="text-sm text-slate-600">Паспорт / ID: 1234 567890</div>
          </div>

          {/* Block 3: Connected numbers */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Подключенные номера</h3>
            {id ? (
              <div className="space-y-2">
                <div className="font-medium">Вы подключаете номер:</div>
                <div className="text-2xl font-mono" style={{color: '#0A7B75'}}>{mobileNumber ?? `#${id}`}</div>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 rounded-xl text-white font-medium" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>Подтвердить подключение</button>
                  <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl border">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="text-slate-600">Нет выбранного номера</div>
            )}
          </div>

          {/* Block 4: PBX service */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Услуга АТС</h3>
            <div className="text-sm text-slate-600">Подключите виртуальную АТС для обработки вызовов и маршрутизации.</div>
            <div className="mt-4">
              <button onClick={() => navigate('/virtual-pbx')} className="px-4 py-2 rounded-xl text-white font-medium" style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`}}>Перейти к АТС</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
