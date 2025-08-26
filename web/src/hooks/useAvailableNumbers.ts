import { useEffect, useState, useCallback } from "react";

export type AvailableNumber = {
  id: number;
  countryName: string;
  countryCode: string;
  category?: string | null;
  mobileNumber: string;
  number800?: string | null;
  connectionFee: number;
  monthlyFee: number;
};

export function useAvailableNumbers(params?: any) {
  const [data, setData] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
      console.log('🔍 Fetching from:', `${API_URL}/api/phone-numbers/public`);
      
      const response = await fetch(`${API_URL}/api/phone-numbers/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📱 API Response:', result);
      setData(result.phoneNumbers || result || []);
    } catch (e: any) {
      console.error("Failed to load available numbers:", e);
      if (e.name === 'TypeError' && e.message.includes('fetch')) {
        setError("Не удается подключиться к серверу. Проверьте, что бэкенд запущен на http://localhost:4000");
      } else if (e.message.includes('Failed to fetch')) {
        setError("Ошибка сети. Проверьте подключение к интернету и доступность сервера.");
      } else {
        setError(e?.message || "Ошибка загрузки данных");
      }
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { 
    load(); 
  }, [load]);

  return { data, loading, error, reload: load };
}
