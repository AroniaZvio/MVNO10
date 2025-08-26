# MVNO10 Mobile (Expo + TypeScript)

Mobile app for the MVNO virtual operator that reuses the same backend and user base as the website. 
After launch, the app opens a Registration/Authorization form. Once authorized, the Personal Account shows balance and connected numbers fetched from `/api/users/me/dashboard`.

## 1) Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm i -g expo` is optional; you can use `npx expo start`)
- Your backend running and reachable from your device (phone or emulator)

## 2) Configure API base URL
The app requests the same endpoints as the website:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET  `/api/users/me`
- GET  `/api/users/me/dashboard`

Set the backend URL via env var before starting Expo:
```bash
# example for local network
set EXPO_PUBLIC_API_URL=http://192.168.0.83:4000
# macOS/Linux: export EXPO_PUBLIC_API_URL=http://192.168.0.83:4000
```

## 3) Install & run
```bash
cd MVNO10_mobile
npm i
npx expo start
```

## 4) How it works
- The login/registration form is identical (fields & validation) to the website:
  - Register: email, username, password
  - Login: email, password
- On login/register the backend returns `token` (access JWT). We store it in AsyncStorage and send as `Authorization: Bearer <token>` in all further requests.
- The personal account screen calls `/api/users/me/dashboard` and shows:
  - `user.balance` (₾) — same value as on the website
  - `connectedNumbers` — list of numbers attached to the user
- You can add more tabs later (Contacts, Dialpad, Messages) without changing the auth flow.

## 5) Matching the website
The app uses the exact same endpoints and token scheme as your web front‑end (`web/src/lib/api.ts`). 
If the website works with the backend, the mobile app will authenticate against the **same** users table and display the **same** personal data (balance, numbers).

## 6) Troubleshooting
- **`Network Error` on phone:** Ensure your phone and computer are on the same Wi‑Fi. Use the host machine's IP (e.g., `http://192.168.0.83:4000`) not `localhost` in `EXPO_PUBLIC_API_URL`.
- **404 `/api/auth/me`**: mobile app uses `/api/users/me` and `/api/users/me/dashboard` (correct routes for this backend).
- **CORS**: native mobile requests are not limited by browser CORS. For the Expo **web** preview you may need to add `http://<your-ip>:19006` to CORS `origin` in `backend/src/app.ts`.

---
Structure highlights:
- `src/services/api.ts` — Axios client & auth helpers (shared idea with website)
- `src/contexts/AuthContext.tsx` — saves/loads JWT, exposes login/register/logout
- `src/screens/AuthScreen.tsx` — combined register/login form
- `src/screens/DashboardScreen.tsx` — balance & connected numbers
