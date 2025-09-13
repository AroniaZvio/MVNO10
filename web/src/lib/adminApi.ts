import { api } from "./api";

export const adminApi = {
  getUsers() {
    return api.get("/admin/users");
  },
  setUserStatus(id: number, isActive: boolean) {
    return api.put(`/admin/users/${id}/status`, { isActive });
  },
  deleteUser(id: number) {
    return api.delete(`/admin/users/${id}`);
  },
  getTransactions() {
    return api.get("/admin/transactions");
  },
  createPlan(data: { name: string; description?: string; price: string|number; dataMb: number; minutes: number; sms: number; }) {
    return api.post("/admin/plans", data);
  },
  updatePlan(id: number, data: { name?: string; description?: string; price?: string|number; dataMb?: number; minutes?: number; sms?: number; }) {
    return api.put(`/admin/plans/${id}`, data);
  },
  deletePlan(id: number) {
    return api.delete(`/admin/plans/${id}`);
  },
  
  // Phone Numbers API
  getPhoneNumbers() {
    return api.get("/admin/phone-numbers");
  },
  createPhoneNumber(data: { 
    countryCode: string; 
    countryName: string; 
  category?: string | null;
    mobileNumber: string;
    number800?: string | null;
    connectionFee: number;
    monthlyFee: number;
  }) {
    return api.post("/admin/phone-numbers", data);
  },
  updatePhoneNumber(id: number, data: { 
    countryCode?: string; 
    countryName?: string; 
  category?: string | null;
    mobileNumber?: string;
    number800?: string | null;
    connectionFee?: number;
    monthlyFee?: number;
  }) {
    return api.put(`/admin/phone-numbers/${id}`, data);
  },
  deletePhoneNumber(id: number) {
    return api.delete(`/admin/phone-numbers/${id}`);
  },
};