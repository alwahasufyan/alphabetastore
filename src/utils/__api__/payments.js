import { cache } from "react";
const PAYMENT_METHODS = [];
const getPayments = cache(async (page = 0) => {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const totalPages = Math.ceil(PAYMENT_METHODS.length / PAGE_SIZE);
  const currentPayments = PAYMENT_METHODS.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);
  const response = {
    payments: currentPayments,
    totalPages
  };
  return response;
});
const getPayment = cache(async id => {
  return PAYMENT_METHODS.find(payment => payment.id === id);
});
export default {
  getPayment,
  getPayments
};
