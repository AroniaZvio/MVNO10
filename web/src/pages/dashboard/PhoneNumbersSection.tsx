import { useEffect, useState } from 'react';
import PhoneNumbersTable, { type PhoneNumberRow } from '../../components/PhoneNumbersTable';
import {
  loadMyNumbers,
  reserveMyNumber,
  removeExpiredNumbers,
  canReserveMoreNumbers,
  type MyNumber,
} from '../../lib/myNumber';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export default function PhoneNumbersSection() {
  const [available, setAvailable] = useState<PhoneNumberRow[]>([]);
  const [myNumbers, setMyNumbers] = useState<MyNumber[]>(loadMyNumbers());
  const [err, setErr] = useState<string | null>(null);

  async function loadAvailable() {
    try {
      const r = await fetch(`${API}/api/phone-numbers/public`);
      if (!r.ok) throw new Error('Не удалось получить список номеров');
      const data: PhoneNumberRow[] = await r.json();
      const myIds = myNumbers.map((n) => n.id);
      setAvailable(data.filter((x) => !myIds.includes(x.id)));
      setErr(null);
    } catch (e: any) {
      setErr(e.message || 'Не удалось получить список номеров');
    }
  }

  useEffect(() => {
    loadAvailable();
  }, [myNumbers]);

  // Авто-снятие брони
  useEffect(() => {
    const tick = () => {
      const expired = removeExpiredNumbers();
      if (expired.length > 0) {
        setMyNumbers(loadMyNumbers());
      }
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  function handleBuy(row: PhoneNumberRow) {
    if (!canReserveMoreNumbers()) {
      setErr('Достигнут лимит: можно забронировать не более 5 номеров');
      return;
    }
    const reserved = reserveMyNumber(
      { id: row.id, mobileNumber: row.mobileNumber, countryName: row.countryName, countryCode: row.countryCode },
      60 * 24
    );
    if (reserved) {
      setMyNumbers(loadMyNumbers());
      setErr(null);
    } else {
      setErr('Не удалось забронировать номер');
    }
  }

  return (
    <section className="p-6 space-y-6">
      {err && <div className="text-red-600">{err}</div>}

      {/* Доступные номера */}
      <div className="rounded-2xl border p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Номера телефонов</h3>
          {!canReserveMoreNumbers() && (
            <span className="text-sm text-orange-600">Достигнут лимит брони (5 номеров)</span>
          )}
        </div>
        <p className="text-sm opacity-70 mb-4">Выберите номер — он сразу попадёт в подключённые</p>
        <PhoneNumbersTable rows={available} onBuy={canReserveMoreNumbers() ? handleBuy : undefined} />
      </div>
    </section>
  );
}
