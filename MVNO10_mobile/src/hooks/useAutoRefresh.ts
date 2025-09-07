import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

interface UseAutoRefreshOptions {
  enabled: boolean;
  interval?: number; // в миллисекундах
  onRefresh: () => void;
}

export const useAutoRefresh = ({ 
  enabled, 
  interval = 30000, // 30 секунд по умолчанию
  onRefresh 
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Функция для запуска автоматического обновления
  const startAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      onRefresh();
    }, interval);
  };

  // Функция для остановки автоматического обновления
  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Слушаем изменения состояния приложения
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // Приложение стало активным - обновляем данные
        onRefresh();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [onRefresh]);

  // Управляем автоматическим обновлением
  useEffect(() => {
    if (enabled) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [enabled, interval, onRefresh]);

  return {
    startAutoRefresh,
    stopAutoRefresh
  };
};
