import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Страницы
import App from './pages/App';
import TariffPlans from './pages/TariffPlans';
import ConnectPlans from './pages/ConnectPlans';
import TariffNumbers from './pages/TariffNumbers';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConnectNumber from './pages/ConnectNumber';
import ResetRequest from './pages/ResetRequest';
import ResetForm from './pages/ResetForm';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import TopUp from './pages/TopUp';
import AddNumber from './pages/AddNumber';
import AtsServices from './pages/AtsServices';

// Dashboard страницы
import DashboardProfile from './pages/dashboard/Profile';
import DashboardConnectedNumbers from './pages/dashboard/ConnectedNumbers';
import DashboardAvailableNumbers from './pages/dashboard/AvailableNumbers';

// Админские страницы
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminPhoneNumbers from "./pages/AdminPhoneNumbers";

// Компоненты-защиты маршрутов
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/tariff-plans', element: <TariffPlans /> },
  { path: '/connect-plans', element: <RequireAuth><ConnectPlans /></RequireAuth> },
  { path: '/tariff-numbers', element: <TariffNumbers /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ResetRequest /> },
  { path: '/reset-password', element: <ResetForm /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/profile', element: <RequireAuth><Profile /></RequireAuth> },

  // Защищённые маршруты
  { path: "/dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
  { path: "/topup", element: <RequireAuth><TopUp /></RequireAuth> },
  { path: "/add-number", element: <RequireAuth><AddNumber /></RequireAuth> },
  { path: "/connect-number", element: <RequireAuth><ConnectNumber /></RequireAuth> },
  { path: "/ats-services", element: <RequireAuth><AtsServices /></RequireAuth> },

  // Dashboard страницы
  { path: "/dashboard/profile", element: <RequireAuth><DashboardProfile /></RequireAuth> },
  { path: "/dashboard/connected-numbers", element: <RequireAuth><DashboardConnectedNumbers /></RequireAuth> },
  { path: "/dashboard/available-numbers", element: <RequireAuth><DashboardAvailableNumbers /></RequireAuth> },

  // Админские маршруты
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "plans", element: <AdminPlans /> },
      { path: "transactions", element: <AdminTransactions /> },
      { path: "phone-numbers", element: <AdminPhoneNumbers /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
