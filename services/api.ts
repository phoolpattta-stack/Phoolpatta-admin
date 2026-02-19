
"use client";
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://phoolpatta.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAdminTokenFromCookie = () => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )ADMIN_TOKEN=([^;]+)/);
  return match ? match[2] : null;
};

API.interceptors.request.use((config) => {
  const token = getAdminTokenFromCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const adminLogin = async (email: string, password: string) => {
  const res = await API.post("/auth/login", {
    emailOrPhone: email,
    password,
  });

  return res.data; // MUST contain token
};

export default API;


/* =========================
   PRODUCT MANAGEMENT APIS
========================= */

// Get all products (Admin)
// export const getAllProducts = async () => {
//   const res = await API.get("/products/admin");
//   return res.data;
// };
export const getAllProducts = async (
  page = 1,
  limit = 10,
  category = "all"
) => {
  const res = await API.get(
    `/products/admin?page=${page}&limit=${limit}&category=${category}`
  );
  return res.data;
};
// Get single product by ID
export const getProductById = async (id: string) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// Create product
export const createProduct = async (formData: FormData) => {
  const res = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Update product
export const updateProduct = async (id: string, formData: FormData) => {
  const res = await API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Enable / Disable product
export const toggleProductStatus = async (id: string) => {
  const res = await API.patch(`/products/${id}/status`);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};



/* =========================
   USER MANAGEMENT APIS
========================= */

// Get all users (Admin)
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

// Get single user
export const getUserById = async (id: string) => {
  const res = await API.get(`/admin/users/${id}`);
  return res.data;
};

// Block / Unblock user
export const toggleUserStatus = async (id: string) => {
  const res = await API.patch(`/admin/users/${id}/toggle`);
  return res.data;
};

/* =========================
   COUPON MANAGEMENT APIS
========================= */

export type CouponPayload = {
  code: string;
  type: "FLAT" | "PERCENT";
  value: number;
  minAmount?: number;
  maxDiscount?: number | null;
  expiry: string; // ISO date string
};

// Get all coupons (Admin)
export const getAllCoupons = async () => {
  const res = await API.get("/coupons");
  return res.data;
};

// Create coupon
export const createCoupon = async (data: CouponPayload) => {
  const res = await API.post("/coupons", data);
  return res.data;
};

// Update coupon
export const updateCoupon = async (id: string, data: CouponPayload) => {
  const res = await API.put(`/coupons/${id}`, data);
  return res.data;
};

// Delete coupon
export const deleteCoupon = async (id: string) => {
  const res = await API.delete(`/coupons/${id}`);
  return res.data;
};

// Enable / Disable coupon
export const toggleCouponStatus = async (id: string) => {
  const res = await API.patch(`/coupons/${id}/status`);
  return res.data;
};


export const getAdminOrders = (params?: any) =>
  API.get("/orders/admin/all", { params });

export const getAdminOrderById = (id: string) =>
  API.get(`/orders/admin/${id}`);


export const updateAdminOrderStatus = (id: string, status: string) =>
  API.patch(`/orders/admin/${id}/status`, { status });

/* =========================
   ADMIN DASHBOARD
========================= */
// export const getAdminDashboardStats = async (range?: string) => {
//   const res = await API.get(
//     range
//       ? `/admin/dashboard/stats?range=${range}`
//       : `/admin/dashboard/stats`
//   );
//   return res.data;
// };


export const getAdminDashboardStats = async (range: string) => {
  const res = await API.get(
    `/admin-dashboard/dashboard/stats?range=${range}`
  );
  return res.data;
};

