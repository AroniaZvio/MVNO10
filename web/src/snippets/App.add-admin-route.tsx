// Добавь в роутер
import AdminPhoneNumbers from './pages/AdminPhoneNumbers';
import RequireAdmin from './guards/RequireAdmin';
<Route path="/admin/phone-numbers" element={
  <RequireAdmin>
    <AdminPhoneNumbers />
  </RequireAdmin>
} />
