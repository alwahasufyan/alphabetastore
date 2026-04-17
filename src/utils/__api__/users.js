import { cache } from "react";
import axios from "utils/axiosInstance";

// CUSTOM DATA MODEL

const INFO_LIST = [{
  title: "16",
  subtitle: "All Orders"
}, {
  title: "02",
  subtitle: "Awaiting Payments"
}, {
  title: "00",
  subtitle: "Awaiting Shipment"
}, {
  title: "01",
  subtitle: "Awaiting Delivery"
}];
export const getUser = cache(async () => {
  const response = await axios.get("/api/user-list/1");
  return response.data;
});
export const getUserAnalytics = cache(async id => {
  return {
    balance: 5000,
    type: "SILVER USER",
    orderSummary: INFO_LIST
  };
});
export default {
  getUser,
  getUserAnalytics
};