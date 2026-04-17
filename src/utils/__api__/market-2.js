import { cache } from "react";
import axios from "utils/axiosInstance";
const getProducts = cache(async () => {
  const response = await axios.get("/api/market-2/products");
  return response.data;
});
const getFlashProducts = cache(async () => {
  const response = await axios.get("/api/market-2/flash-deals");
  return response.data;
});
const getTopRatedProducts = cache(async () => {
  const response = await axios.get("/api/market-2/top-rated");
  return response.data;
});
const getServices = cache(async () => {
  const response = await axios.get("/api/market-2/service");
  return response.data;
});
const getCategories = cache(async () => {
  const response = await axios.get("/api/market-2/categories");
  return response.data;
});
const getBrands = cache(async () => {
  const response = await axios.get("/api/market-2/brand");
  return response.data;
});
const getShops = cache(async () => {
  const response = await axios.get("/api/market-2/shops");
  return response.data;
});
const getMainCarouselData = cache(async () => {
  const response = await axios.get("/api/market-2/main-carousel");
  return response.data;
});
const getBlogs = cache(async () => {
  const response = await axios.get("/api/market-2/articles");
  return response.data;
});
const getClients = cache(async () => {
  const response = await axios.get("/api/market-2/clients");
  return response.data;
});
export default {
  getBrands,
  getServices,
  getCategories,
  getFlashProducts,
  getTopRatedProducts,
  getMainCarouselData,
  getBlogs,
  getProducts,
  getShops,
  getClients
};