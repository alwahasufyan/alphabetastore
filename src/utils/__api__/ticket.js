import { cache } from "react";
import axios from "utils/axiosInstance";

// CUSTOM DATA MODEL

export const getTicketList = cache(async (page = 1) => {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;
  const {
    data: tickets
  } = await axios.get("/api/tickets");
  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);

  
// const currentTickets = tickets.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);
  const response = {
    tickets: tickets,
    totalTickets: tickets.length,
    totalPages
  };
  return response;
});
export const getTicket = cache(async slug => {
  const response = await axios.get("/api/tickets/single", {
    params: {
      slug
    }
  });
  return response.data;
});
export const getSlugs = cache(async () => {
  const response = await axios.get("/api/tickets/slugs");
  return response.data;
});
export default {
  getTicketList,
  getTicket,
  getSlugs
};