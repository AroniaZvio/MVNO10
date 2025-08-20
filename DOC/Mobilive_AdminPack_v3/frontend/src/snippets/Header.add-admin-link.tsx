// Добавь в хедер (показывать только ADMIN)
{user?.role === 'ADMIN' && (
  <a href="/admin/phone-numbers" className="btn btn-outline">Админ</a>
)}
