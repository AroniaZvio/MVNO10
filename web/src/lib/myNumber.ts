export type MyNumberStatus = 'reserved' | 'paid';

export type MyNumber = {
  id: number;
  mobileNumber: string;
  countryName: string;
  countryCode: string;
  status: MyNumberStatus;
  reservedAt: number;       // ms
  expiresAt: number | null; // ms, null после оплаты
};

const KEY = 'mvno_my_numbers';
const MAX_RESERVED_NUMBERS = 5;

export function loadMyNumbers(): MyNumber[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as MyNumber[]) : [];
  } catch {
    return [];
  }
}

export function saveMyNumbers(numbers: MyNumber[]) {
  localStorage.setItem(KEY, JSON.stringify(numbers));
  try {
    window.dispatchEvent(new Event('my-numbers-updated'));
  } catch {}
}

export function clearMyNumbers() {
  localStorage.removeItem(KEY);
  try {
    window.dispatchEvent(new Event('my-numbers-updated'));
  } catch {}
}

// Обратная совместимость
export function loadMyNumber(): MyNumber | null {
  const numbers = loadMyNumbers();
  return numbers.length > 0 ? numbers[0] : null;
}

export function saveMyNumber(n: MyNumber) {
  const numbers = loadMyNumbers();
  const existing = numbers.findIndex((num) => num.id === n.id);
  if (existing >= 0) {
    numbers[existing] = n;
  } else {
    numbers.push(n);
  }
  saveMyNumbers(numbers);
}

export function clearMyNumber() {
  clearMyNumbers();
}

export function reserveMyNumber(
  n: { id: number; mobileNumber: string; countryName: string; countryCode: string },
  holdMinutes = 60 * 24 // 24ч по умолчанию
): MyNumber | null {
  const numbers = loadMyNumbers();
  const reservedCount = numbers.filter((num) => num.status === 'reserved').length;

  if (reservedCount >= MAX_RESERVED_NUMBERS) {
    return null; // Лимит достигнут
  }

  const now = Date.now(); // <-- объявляем тут

  const my: MyNumber = {
    ...n,
    status: 'reserved',
    reservedAt: now,
    expiresAt: now + holdMinutes * 60 * 1000,
  };

  numbers.push(my);
  saveMyNumbers(numbers);
  return my;
}

export function addPaidMyNumber(
  n: { id: number; mobileNumber: string; countryName: string; countryCode: string }
): MyNumber {
  const numbers = loadMyNumbers();
  const now = Date.now(); // <-- и здесь

  const my: MyNumber = {
    ...n,
    status: 'paid',
    reservedAt: now,
    expiresAt: null,
  };

  const existingIndex = numbers.findIndex((x) => x.id === my.id);
  if (existingIndex >= 0) {
    numbers[existingIndex] = my;
  } else {
    numbers.push(my);
  }
  saveMyNumbers(numbers);
  return my;
}

export function canReserveMoreNumbers(): boolean {
  const numbers = loadMyNumbers();
  const reservedCount = numbers.filter((num) => num.status === 'reserved').length;
  return reservedCount < MAX_RESERVED_NUMBERS;
}

export function getReservedNumbersCount(): number {
  const numbers = loadMyNumbers();
  return numbers.filter((num) => num.status === 'reserved').length;
}

export function markPaidMyNumber(id: number): MyNumber | null {
  const numbers = loadMyNumbers();
  const index = numbers.findIndex((num) => num.id === id);
  if (index === -1) return null;

  const upd: MyNumber = { ...numbers[index], status: 'paid', expiresAt: null };
  numbers[index] = upd;
  saveMyNumbers(numbers);
  return upd;
}

export function removeMyNumber(id: number): void {
  const numbers = loadMyNumbers();
  const filtered = numbers.filter((num) => num.id !== id);
  saveMyNumbers(filtered);
}

export function removeExpiredNumbers(): MyNumber[] {
  const numbers = loadMyNumbers();
  const valid = numbers.filter((num) => !isExpiredMyNumber(num));
  const expired = numbers.filter((num) => isExpiredMyNumber(num));
  saveMyNumbers(valid);
  return expired;
}

export function isExpiredMyNumber(n: MyNumber) {
  return !!n.expiresAt && Date.now() > n.expiresAt;
}

export function remainingMs(n: MyNumber) {
  return n.expiresAt ? Math.max(0, n.expiresAt - Date.now()) : 0;
}
