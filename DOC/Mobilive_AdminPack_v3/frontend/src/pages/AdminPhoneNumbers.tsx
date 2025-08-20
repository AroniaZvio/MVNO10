import { useEffect, useState } from 'react';
import axios from 'axios';

type Row = {
  id: number;
  countryCode: string;
  countryName: string;
  mobileNumber: string;
  number800?: string | null;
  connectionFee: number;
  monthlyFee: number;
};

export default function AdminPhoneNumbers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({
    countryCode: '', countryName: '', mobileNumber: '',
    number800: '', connectionFee: '', monthlyFee: ''
  });

  const load = async () => {
    const { data } = await axios.get('/api/phone-numbers');
    setRows(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/phone-numbers', form);
    setForm({ countryCode:'', countryName:'', mobileNumber:'', number800:'', connectionFee:'', monthlyFee:'' });
    load();
  };

  const del = async (id: number) => {
    await axios.delete(`/api/phone-numbers/${id}`);
    load();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Админ — Телефонные номера</h1>
      <form onSubmit={submit} className="grid grid-cols-6 gap-2 mb-6">
        <input placeholder="Код" value={form.countryCode} onChange={e=>setForm({...form, countryCode:e.target.value})}/>
        <input placeholder="Страна" value={form.countryName} onChange={e=>setForm({...form, countryName:e.target.value})}/>
        <input placeholder="Мобильный номер" value={form.mobileNumber} onChange={e=>setForm({...form, mobileNumber:e.target.value})}/>
        <input placeholder="Номер 800" value={form.number800} onChange={e=>setForm({...form, number800:e.target.value})}/>
        <input placeholder="Подключение ₽" value={form.connectionFee} onChange={e=>setForm({...form, connectionFee:e.target.value})}/>
        <input placeholder="Абонплата ₽" value={form.monthlyFee} onChange={e=>setForm({...form, monthlyFee:e.target.value})}/>
        <button className="col-span-6">Добавить</button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th>Страна</th><th>Мобильные</th><th>800</th><th>Подключение</th><th>Абонплата</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.countryCode} {r.countryName}</td>
              <td>{r.mobileNumber}</td>
              <td>{r.number800 || '-'}</td>
              <td>{r.connectionFee}₽</td>
              <td>{r.monthlyFee}₽</td>
              <td><button onClick={()=>del(r.id)}>Удалить</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
