import { useEffect, useState, useCallback } from "react";

export type Plan = {
  id: number;
  name: string;
  description?: string;
  price: string;
  dataMb: number;
  minutes: number;
  sms: number;
};

export type ConnectedPlan = {
  id: number;
  planId: number;
  planName: string;
  planDescription: string;
  planPrice: string;
  planDataMb: number;
  planMinutes: number;
  planSms: number;
  connectedAt: string;
  status: 'active' | 'pending' | 'expired';
};

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mobilive.ge';
      const response = await fetch(`${API_URL}/api/plans`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setPlans(result);
    } catch (e: any) {
      console.error("Failed to load plans:", e);
      setError(e?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadPlans(); 
  }, [loadPlans]);

  return { plans, loading, error, reload: loadPlans };
}

export function useConnectedPlan() {
  const [connectedPlan, setConnectedPlan] = useState<ConnectedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConnectedPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mobilive.ge';
      console.log('🔍 Fetching connected plan from:', `${API_URL}/api/users/me/plan`);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/me/plan`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      if (response.status === 404) {
        // У пользователя нет подключенного тарифа
        setConnectedPlan(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setConnectedPlan(result);
    } catch (e: any) {
      console.error("Failed to load connected plan:", e);
      setError(e?.message || "Failed to load connected plan");
    } finally {
      setLoading(false);
    }
  }, []);

  const connectPlan = useCallback(async (planId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mobilive.ge';
      console.log('🔗 Connecting plan:', planId, 'to:', `${API_URL}/api/users/me/plan`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Не авторизован. Необходимо войти в систему.');
      }
      
      const response = await fetch(`${API_URL}/api/users/me/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setConnectedPlan(result);
      
      // Уведомляем другие компоненты об обновлении тарифа
      window.dispatchEvent(new CustomEvent('plan-updated', {
        detail: { connectedPlan: result }
      }));
      
      return result;
    } catch (e: any) {
      console.error("Failed to connect plan:", e);
      setError(e?.message || "Failed to connect plan");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadConnectedPlan(); 
  }, [loadConnectedPlan]);

  return { 
    connectedPlan, 
    loading, 
    error, 
    connectPlan,
    reload: loadConnectedPlan 
  };
}
