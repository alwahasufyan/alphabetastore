import { cache } from "react";
import axios from "utils/axiosInstance";

async function safeGet(path, fallback) {
  try {
    const response = await axios.get(path);
    return response.data;
  } catch {
    return fallback;
  }
}

async function getCatalogProducts() {
  const data = await safeGet("/products", []);
  return Array.isArray(data) ? data : [];
}

// dashboard
const getAllCard = cache(async () => {
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    safeGet("/categories", [])
  ]);

  const activeProducts = products.filter(item => item?.status === "ACTIVE").length;
  const outOfStock = products.filter(item => Number(item?.stockQty || 0) <= 0).length;

  return [{
    id: 1,
    title: "Products",
    amount1: String(products.length),
    amount2: products.length,
    color: "info.main",
    percentage: "0%"
  }, {
    id: 2,
    title: "Categories",
    amount1: String(Array.isArray(categories) ? categories.length : 0),
    amount2: Array.isArray(categories) ? categories.length : 0,
    color: "error.main",
    percentage: "0%"
  }, {
    id: 3,
    title: "Active Products",
    amount1: String(activeProducts),
    amount2: activeProducts,
    color: "success.main",
    percentage: "0%"
  }, {
    id: 4,
    title: "Out of Stock",
    amount1: String(outOfStock),
    amount2: outOfStock,
    color: "error.main",
    percentage: "0%",
    status: "down"
  }];
});
const recentPurchase = cache(async () => {
  const products = await getCatalogProducts();

  return products.slice(0, 5).map(item => ({
    id: `#${String(item?.id || "").slice(0, 8)}`,
    amount: Number(item?.price || 0),
    payment: "Success",
    product: item?.name || "Product"
  }));
});
const stockOutProducts = cache(async () => {
  const products = await getCatalogProducts();

  return products.slice(0, 8).map(item => ({
    amount: Number(item?.price || 0),
    stock: String(item?.stockQty ?? 0),
    product: item?.name || "Product"
  }));
});


// orders
const orders = cache(async () => {
  const data = await safeGet("/orders", []);
  return Array.isArray(data) ? data : [];
});
const getOrder = cache(async id => {
  return safeGet(`/orders/${id}`, null);
});


// customers
const customers = cache(async () => {
  const data = await safeGet("/users/me", null);
  return data ? [data] : [];
});


// refund request
const refundRequests = cache(async () => {
  const data = await safeGet("/admin/refund-requests", []);
  return Array.isArray(data) ? data : [];
});


// sellers
const sellers = cache(async () => {
  return [];
});
const packagePayments = cache(async () => {
  return [];
});
const earningHistory = cache(async () => {
  const data = await safeGet("/admin/earning-history", []);
  return Array.isArray(data) ? data : [];
});
const payouts = cache(async () => {
  return [];
});
const payoutRequests = cache(async () => {
  const data = await safeGet("/admin/payout-requests", []);
  return Array.isArray(data) ? data : [];
});
export default {
  orders,
  sellers,
  payouts,
  getOrder,
  customers,
  getAllCard,
  payoutRequests,
  recentPurchase,
  refundRequests,
  earningHistory,
  packagePayments,
  stockOutProducts
};