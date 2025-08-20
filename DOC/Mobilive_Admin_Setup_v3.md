
# Mobilive — Admin кабинет + управление телефонными номерами (v3, улучшенная)

Дата: 2025-08-11

## Что нового
- Готовые файлы backend/frontend.
- Отдельный файл `package.additions.json` с зависимостями и скриптом `seed:admin` (чтобы НЕ перезаписывать твой package.json — просто слей).
- Подробные команды для Windows PowerShell.

## Структура архива
```
Mobilive_AdminPack_v3/
  backend/
    prisma_additions.prisma
    package.additions.json
    src/
      middlewares/requireAdmin.ts
      modules/phoneNumbers/{{controllers.ts, routes.ts, service.ts}}
      scripts/seedAdmin.ts
  frontend/
    src/
      pages/AdminPhoneNumbers.tsx
      guards/RequireAdmin.tsx
      snippets/
        Header.add-admin-link.tsx
        App.add-admin-route.tsx
```
**Назначение:** Эти файлы нужно поместить в твой проект:
- Backend → `D:/APP/MVNO10/backend/`
- Frontend → `D:/APP/MVNO10/frontend/`

---

## 1) Prisma модели
Открой `D:/APP/MVNO10/backend/prisma/schema.prisma` и добавь из файла `backend/prisma_additions.prisma`:
- enum `Role`
- model `User` (если нет поля `role` — добавь)
- model `PhoneNumber`

**Миграция:**
```powershell
cd D:/APP/MVNO10/backend
npx prisma migrate dev -n add_admin_and_phone_numbers
```

## 2) Зависимости и скрипты
Открой `backend/package.additions.json` и слей зависимости/скрипты с твоим `package.json` (НЕ перезаписывая):
- deps: `@prisma/client`, `bcryptjs`, `express`
- devDeps: `@types/bcryptjs`, `@types/express`, `tsx`, `typescript`
- scripts: `"seed:admin": "tsx src/scripts/seedAdmin.ts"`

**Установка:**
```powershell
cd D:/APP/MVNO10/backend
npm install
```

## 3) Создание администратора
В `D:/APP/MVNO10/backend/.env` добавь (или используй значения по умолчанию):
```
ADMIN_EMAIL=admin@mobilive.ge
ADMIN_PASSWORD=Admin123!
```

**Запуск:**
```powershell
npm run seed:admin
```

## 4) Подключение роутов на сервере
В твоём `src/index.ts` (или `server.ts`) добавь:
```ts
import phoneNumbersRoutes from './modules/phoneNumbers/routes';
app.use('/api/phone-numbers', phoneNumbersRoutes);
```
Важно: перед админ-роутами у тебя должен выполняться `verifyJWT` и класть `{ id, email, role }` в `req.user`.

## 5) Фронтенд
- Добавь маршрут на страницу `/admin/phone-numbers` (смотри `snippets/App.add-admin-route.tsx`).
- Показывай кнопку «Админ» только для ADMIN (смотри `snippets/Header.add-admin-link.tsx`).

**Проверка:**
1. Логин админа → видна кнопка «Админ».
2. Страница `/admin/phone-numbers` → форма + таблица.
3. Добавь запись → на пользовательском Dashboard таблица «Номера телефонов / Управление всеми подключенными номерами» подтянет `GET /api/phone-numbers`.

Удачи! 🚀
