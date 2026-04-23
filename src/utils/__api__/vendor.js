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

const getAllProductReviews = cache(async () => {
  const products = await safeGet("/products", []);

  return (Array.isArray(products) ? products : []).slice(0, 10).map(item => ({
    id: item?.id,
    image: "/assets/images/products/apple-watch.png",
    name: item?.name || "Product",
    customer: "Customer",
    comment: item?.shortDescription || "No review yet.",
    rating: 0
  }));
});
const getAllRefundRequests = cache(async () => {
  const data = await safeGet("/admin/refund-requests", []);
  return Array.isArray(data) ? data : [];
});
const getAllPayoutRequests = cache(async () => {
  const data = await safeGet("/admin/payout-requests", []);
  return Array.isArray(data) ? data : [];
});
export default {
  getAllProductReviews,
  getAllRefundRequests,
  getAllPayoutRequests
};