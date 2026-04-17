import { cache } from "react";
import axios from "utils/axiosInstance";
const getFeaturedCategories = cache(async () => {
  const response = await axios.get("/api/gadget-1/featured-categories");
  return response.data;
});
const getMostViewedList = cache(async () => {
  const response = await axios.get("/api/gadget-1/products?tag=most-viewed");
  return response.data;
});
const getSaleBanner = cache(async () => {
  const response = await axios.get("/api/gadget-1/sale-banners");
  return response.data;
});
const getBlogLists = cache(async () => {
  const response = await axios.get("/api/gadget-1/blog-lists");
  return response.data;
});
const getTopPicksList = cache(async () => {
  const response = await axios.get("/api/gadget-1/products?tag=top-picks");
  return response.data;
});
const getTestimonials = cache(async () => {
  const response = await axios.get("/api/gadget-1/testimonials");
  return response.data;
});
export default {
  getBlogLists,
  getSaleBanner,
  getTestimonials,
  getTopPicksList,
  getMostViewedList,
  getFeaturedCategories
};