import { apiGet, apiPatch, apiPost } from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export const TICKET_STATUS_OPTIONS = [{
  value: "OPEN",
  label: "Open"
}, {
  value: "IN_PROGRESS",
  label: "In Progress"
}, {
  value: "CLOSED",
  label: "Closed"
}];

export const TICKET_PRIORITY_OPTIONS = [{
  value: "NORMAL",
  label: "Normal"
}, {
  value: "URGENT",
  label: "Urgent"
}];

export function formatTicketStatus(status) {
  return TICKET_STATUS_OPTIONS.find(item => item.value === status)?.label || "Open";
}

export function formatTicketPriority(priority) {
  return TICKET_PRIORITY_OPTIONS.find(item => item.value === priority)?.label || "Normal";
}

function mapTicketMessage(message) {
  return {
    id: message?.id || "",
    text: message?.message || "",
    date: message?.createdAt || null,
    sender: message?.sender ? {
      id: message.sender.id || "",
      name: message.sender.name || "User",
      email: message.sender.email || "",
      role: message.sender.role || "CUSTOMER"
    } : null
  };
}

export function mapTicket(ticket) {
  const messages = ensureArray(ticket?.messages).map(mapTicketMessage);

  return {
    id: ticket?.id || "",
    ticketNumber: ticket?.ticketNumber || "",
    subject: ticket?.subject || "Support ticket",
    status: ticket?.status || "OPEN",
    statusLabel: formatTicketStatus(ticket?.status),
    priority: ticket?.priority || "NORMAL",
    priorityLabel: formatTicketPriority(ticket?.priority),
    createdAt: ticket?.createdAt || null,
    customer: ticket?.user ? {
      id: ticket.user.id || "",
      name: ticket.user.name || "Customer",
      email: ticket.user.email || "",
      role: ticket.user.role || "CUSTOMER"
    } : null,
    lastMessage: ticket?.lastMessage ? mapTicketMessage(ticket.lastMessage) : messages.at(-1) || null,
    conversation: messages
  };
}

export async function fetchCustomerTickets() {
  const data = await apiGet("/tickets");
  return ensureArray(data).map(mapTicket);
}

export async function fetchTicketById(id) {
  const data = await apiGet(`/tickets/${id}`);
  return mapTicket(data);
}

export async function createTicket(payload) {
  const data = await apiPost("/tickets", payload);
  return mapTicket(data);
}

export async function postTicketMessage(id, payload) {
  const data = await apiPost(`/tickets/${id}/messages`, payload);
  return mapTicket(data);
}

export async function fetchAdminTickets() {
  const data = await apiGet("/admin/tickets");
  return ensureArray(data).map(mapTicket);
}

export async function updateAdminTicketStatus(id, payload) {
  const data = await apiPatch(`/admin/tickets/${id}/status`, payload);
  return mapTicket(data);
}