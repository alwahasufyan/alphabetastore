import { cache } from "react";
import { apiGet } from "utils/api";

export const getUser = cache(async () => {
  return apiGet("/users/me");
});

export const getUserAnalytics = cache(async id => {
  const [orders, user] = await Promise.all([apiGet("/orders/my"), apiGet("/users/me")]);

  const orderList = Array.isArray(orders) ? orders : [];
  const awaitingPayments = orderList.filter(item => item?.paymentStatus === "PENDING").length;
  const awaitingShipment = orderList.filter(item => item?.status === "CONFIRMED").length;
  const awaitingDelivery = orderList.filter(item => item?.status === "PROCESSING").length;

  return {
    balance: 0,
    type: user?.role || "CUSTOMER",
    orderSummary: [{
      title: String(orderList.length),
      subtitle: "All Orders"
    }, {
      title: String(awaitingPayments),
      subtitle: "Awaiting Payments"
    }, {
      title: String(awaitingShipment),
      subtitle: "Awaiting Shipment"
    }, {
      title: String(awaitingDelivery),
      subtitle: "Awaiting Delivery"
    }]
  };
});
export default {
  getUser,
  getUserAnalytics
};