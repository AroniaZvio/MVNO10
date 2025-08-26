# 🔧 Настройка .env файла для решения проблем с аутентификацией

## ❌ Проблема
У вас отсутствует файл `.env` в папке `backend/`, поэтому не работает:
- Регистрация пользователей
- Авторизация пользователей
- Отправка email для подтверждения

## ✅ Решение

### 1. Создайте файл `.env` в папке `backend/`

### 2. Добавьте следующие переменные:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/mvno_db"

# JWT (обязательно!)
JWT_ACCESS_SECRET="your-super-secret-jwt-access-key-here-2024"
JWT_REFRESH_SECRET="your-super-secret-jwt-refresh-key-here-2024"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# App
APP_URL="http://localhost:5175"
PORT=4000

# SMTP для отправки email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Важные моменты:

- **JWT_SECRET** - обязательная переменная для работы токенов
- **DATABASE_URL** - должен указывать на вашу базу данных
- **APP_URL** - должен совпадать с URL фронтенда
- **SMTP** - для отправки email подтверждения

### 4. После создания .env файла:

1. Перезапустите бэкенд: `cd backend && npm run dev`
2. Проверьте, что нет ошибок в консоли
3. Попробуйте зарегистрироваться и войти

### 5. Для тестирования без email:

Если не хотите настраивать SMTP, можно временно закомментировать отправку email в `auth.ts` и сразу активировать пользователей.

## 🚀 Быстрый тест

После настройки .env:
1. Откройте `http://localhost:5175/register`
2. Создайте аккаунт
3. Войдите в систему
4. Перейдите в Dashboard

Если все работает - проблема решена! 🎉
