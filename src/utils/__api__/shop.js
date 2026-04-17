import { cache } from "react";
import axios from "utils/axiosInstance";

// CUSTOM DATA MODEL

const shopList = [{
  name: "Tech Friend",
  imgUrl: "/assets/images/faces/propic.png",
  url: "/shops/scarlett-beauty"
}, {
  name: "Smart Shop",
  imgUrl: "/assets/images/faces/propic(1).png",
  url: "/shops/scarlett-beauty"
}, {
  name: "Gadget 360",
  imgUrl: "/assets/images/faces/propic(8).png",
  url: "/shops/scarlett-beauty"
}];
export const getShopList = cache(async () => {
  const response = await axios.get("/api/shops");
  const shops = response.data;
  const meta = {
    totalShops: 10,
    totalPages: 1,
    firstIndex: 1,
    lastIndex: 10
  };
  return {
    shops,
    meta
  };
});
export const getSlugs = cache(async () => {
  const response = await axios.get("/api/shops/slugs");
  return response.data;
});
export const getProductsBySlug = cache(async slug => {
  const response = await axios.get("/api/shops/single", {
    params: {
      slug
    }
  });
  return response.data;
});
export const getAvailableShops = cache(async () => {
  return shopList;
});
export default {
  getShopList,
  getSlugs,
  getProductsBySlug
};