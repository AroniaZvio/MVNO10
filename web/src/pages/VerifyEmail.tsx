import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [msg, setMsg] = useState("Подтверждаем...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMsg("Отсутствует токен подтверждения");
      setIsLoading(false);
      return;
    }
    
    (async () => {
      try {
        const r = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        setMsg(r.data?.message || "Email подтверждён. Теперь вы можете войти.");
        setIsSuccess(true);
        setIsAlreadyVerified(r.data?.alreadyVerified || false);
      } catch (e: any) {
        const errorMessage = e?.response?.data?.message || "Ошибка подтверждения";
        
        // Сначала проверяем, не является ли это ошибкой "Token already used"
        // Если да, то сразу показываем успех без мигания ошибки
        if (errorMessage.includes("Token already used")) {
          setIsSuccess(true);
          setIsAlreadyVerified(true);
          setMsg("Email уже подтверждён. Теперь вы можете войти.");
        } else {
          // Для других ошибок показываем стандартное сообщение об ошибке
          setMsg(errorMessage);
          setIsSuccess(false);
          setIsAlreadyVerified(false);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params]);

  // Показываем загрузку пока обрабатываем токен
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Подтверждение email</h1>
            <p className="text-slate-600">Подтверждаем ваш email адрес</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C9C94] mx-auto mb-4"></div>
              <p className="text-slate-600">Обрабатываем подтверждение...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Подтверждение email</h1>
          <p className="text-slate-600">Подтверждаем ваш email адрес</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className={`text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? (
              <div className="mb-4">
                <div className="text-4xl mb-2">
                  {isAlreadyVerified ? '✅' : '🎉'}
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {isAlreadyVerified ? 'Email уже подтверждён!' : 'Email подтверждён!'}
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  {isAlreadyVerified 
                    ? 'Ваш email был подтверждён ранее. Теперь вы можете войти в свой аккаунт.'
                    : 'Теперь вы можете войти в свой аккаунт'
                  }
                </p>
                
                {isAlreadyVerified && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                      💡 Если вы не можете войти, попробуйте восстановить пароль или обратитесь в поддержку
                    </p>
                  </div>
                )}
                
                <Link 
                  to="/login" 
                  className="inline-block px-6 py-3 rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-200"
                  style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
                >
                  🔐 Войти в аккаунт
                </Link>
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-4xl mb-2">❌</div>
                <h2 className="text-xl font-semibold mb-2">Ошибка подтверждения</h2>
                <p className="text-sm text-slate-600 mb-6">{msg}</p>
                
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="inline-block px-6 py-3 rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-200"
                    style={{background: `linear-gradient(to right, #0A7B75, #1C9C94)`, boxShadow: '0 10px 25px rgba(10, 123, 117, 0.25)'}}
                  >
                    🔐 Перейти ко входу
                  </Link>
                  
                  <div className="text-xs text-slate-500">
                    <p>Если проблема повторяется:</p>
                    <p>• Проверьте правильность ссылки</p>
                    <p>• Запросите новое письмо для подтверждения</p>
                    <p>• Обратитесь в поддержку</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

