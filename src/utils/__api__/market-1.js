import { cache } from "react";
import axios from "utils/axiosInstance";
const getMainCarousel = cache(async () => {
  const response = await axios.get("/api/market-1/main-carousel");
  return response.data;
});
const getFlashDeals = cache(async () => {
  const response = await axios.get("/api/market-1/flash-deals");
  return response.data;
});
const getCategories = cache(async () => {
  const response = await axios.get("/api/market-1/categories");
  return response.data;
});
const getJustForYou = cache(async () => {
  const response = await axios.get("/api/market-1/just-for-you");
  return response.data;
});
const getNewArrivalList = cache(async () => {
  const response = await axios.get("/api/market-1/new-arrivals");
  return response.data;
});
const getShops = cache(async () => {
  const response = await axios.get("/api/market-1/shops");
  return response.data;
});
const getProducts = cache(async () => {
  const response = await axios.get("/api/market-1/products");
  return response.data;
});
const getBlogs = cache(async () => {
  const response = await axios.get("/api/market-1/blogs");
  return response.data;
});
const getServiceList = cache(async () => {
  const response = await axios.get("/api/market-1/services");
  return response.data;
});
export default {
  getMainCarousel,
  getFlashDeals,
  getNewArrivalList,
  getProducts,
  getShops,
  getBlogs,
  getCategories,
  getServiceList,
  getJustForYou
};