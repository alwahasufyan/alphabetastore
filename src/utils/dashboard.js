import { apiGet } from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

const EMPTY_SUMMARY = {
  totals: {
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    cancelledOrders: 0,
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    totalRevenueUsd: 0
  },
  recentOrders: [],
  monthly: []
};

export async function fetchAdminDashboardSummary() {
  const data = await apiGet("/admin/dashboard/summary");

  return {
    totals: {
      ...EMPTY_SUMMARY.totals,
      ...(data?.totals || {})
    },
    recentOrders: ensureArray(data?.recentOrders),
    monthly: ensureArray(data?.monthly)
  };
}

export { EMPTY_SUMMARY };
