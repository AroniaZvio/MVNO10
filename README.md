# MVNO Project - Веб, Бэкенд и Мобильные Приложения

Полноценное решение для MVNO оператора, включающее веб-приложение, бэкенд API и мобильные приложения для iOS и Android.

## 🏗 Архитектура проекта

```
MVNO10/
├── web/                    # Веб-приложение (React + TypeScript)
├── backend/               # Бэкенд API (Node.js + Express + Prisma)
├── mobile/                # Мобильные приложения (React Native)
├── shared/                # Общие типы и API клиент
├── DOC/                   # Документация
└── docker-compose.yml     # Docker конфигурация
```

## 🚀 Возможности

### Веб-приложение
- Административная панель для управления тарифами
- Управление пользователями и номерами
- Аналитика и отчеты
- Современный UI на React + Tailwind CSS
- Система регистрации с email подтверждением
- Защищенные маршруты для авторизованных пользователей

### Бэкенд API
- RESTful API на Node.js + Express
- База данных PostgreSQL с Prisma ORM
- JWT аутентификация с email подтверждением
- Валидация данных с Zod
- Отправка email уведомлений и подтверждений
- Безопасная система регистрации с обязательной верификацией

### Мобильные приложения
- Единая кодовая база для iOS и Android
- Аутентификация пользователей
- Просмотр и активация тарифов
- Управление профилем
- Поддержка темной/светлой темы

## 🛠 Технологический стек

### Frontend (Web)
- **React 19** + **TypeScript**
- **Vite** - сборщик
- **Tailwind CSS 4** - стилизация
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

### Backend
- **Node.js** + **Express 5**
- **TypeScript**
- **Prisma** - ORM для базы данных
- **PostgreSQL** - основная база данных
- **JWT** - аутентификация
- **Zod** - валидация схем

### Mobile
- **React Native 0.73**
- **TypeScript**
- **React Navigation** - навигация
- **Context API** - управление состоянием
- **AsyncStorage** - локальное хранение

### Общие компоненты
- **TypeScript** типы и интерфейсы
- **API клиент** для веб и мобильных приложений
- **Docker** для развертывания

## 🚀 Быстрый старт

### Предварительные требования

1. **Node.js** версии 18 или выше
2. **Docker** и **Docker Compose**
3. **PostgreSQL** (или использование Docker)
4. **Git**

### Клонирование проекта

```bash
git clone <repository-url>
cd MVNO10
```

### Запуск с Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

### Локальная разработка

#### 1. Бэкенд

```bash
cd backend
npm install
npm run dev
```

#### 2. Веб-приложение

```bash
cd web
npm install
npm run dev
```

#### 3. Мобильное приложение

```bash
cd mobile
npm install
npm start
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файлы `.env` в соответствующих папках:

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mvno_db"
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

#### Web (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

#### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### База данных

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

## 📱 Мобильные приложения

### iOS разработка

```bash
cd mobile
npm run ios
```

### Android разработка

```bash
cd mobile
npm run android
```

### Сборка для продакшена

```bash
# Android APK
cd mobile
npm run build:android

# iOS IPA
cd mobile
npm run build:ios
```

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm test

# Web тесты
cd web
npm test

# Mobile тесты
cd mobile
npm test
```

## 📚 API Документация

API документация доступна по адресу `/api/docs` после запуска бэкенда.

### Основные эндпоинты

- `POST /api/auth/login` - Вход пользователя
- `POST /api/auth/register` - Регистрация пользователя
- `GET /api/tariffs` - Получение списка тарифов
- `GET /api/users/me` - Получение профиля пользователя

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Валидация входных данных
- CORS настройки
- Rate limiting (планируется)

## 📊 Мониторинг и логирование

- Логирование запросов
- Обработка ошибок
- Метрики производительности (планируется)

## 🚀 Развертывание

### Docker Compose (рекомендуется)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Ручное развертывание

1. Настройте сервер
2. Установите зависимости
3. Настройте переменные окружения
4. Запустите миграции базы данных
5. Запустите сервисы

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте документацию
2. Создайте Issue в репозитории
3. Обратитесь к команде разработки

## 🔮 Планы развития

### Краткосрочные цели
- [ ] Push уведомления для мобильных приложений
- [ ] Интеграция с платежными системами
- [ ] Многоязычность
- [ ] Расширенная аналитика

### Долгосрочные цели
- [ ] Микросервисная архитектура
- [ ] Kubernetes развертывание
- [ ] Машинное обучение для анализа данных
- [ ] Мобильное приложение для администраторов

## 📞 Контакты

- **Email**: support@mvno.com
- **Telegram**: @mvno_support
- **GitHub**: [Issues](https://github.com/your-org/mvno-project/issues)
