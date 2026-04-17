import { cache } from "react";
import axios from "utils/axiosInstance";

// CUSTOM DATA MODEL

const getAddressList = cache(async (page = 1) => {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const {
    data: addressList
  } = await axios.get("/api/address/user");
  const totalPages = Math.ceil(addressList.length / PAGE_SIZE);
  const currentAddressList = addressList.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);
  const response = {
    addressList: currentAddressList,
    totalOrders: addressList.length,
    totalPages
  };
  return response;
});
const getIds = cache(async () => {
  const response = await axios.get("/api/address/address-ids");
  return response.data;
});
const getAddress = cache(async id => {
  const response = await axios.get("/api/address/user/1", {
    params: {
      id
    }
  });
  return response.data;
});
export default {
  getAddressList,
  getIds,
  getAddress
};