import { API_BASE_URL, apiGet, apiPatch, apiPost } from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function getBackendOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
}

export function normalizePaymentFileUrl(fileUrl) {
  const nextFileUrl = String(fileUrl || "").trim();

  if (!nextFileUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(nextFileUrl)) {
    return nextFileUrl;
  }

  if (nextFileUrl.startsWith("/uploads/")) {
    const backendOrigin = getBackendOrigin();
    return backendOrigin ? `${backendOrigin}${nextFileUrl}` : nextFileUrl;
  }

  return nextFileUrl;
}

export function formatPaymentStatus(status) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
      return "Pending";
    default:
      return "Not selected";
  }
}

function mapReceipt(receipt) {
  if (!receipt) {
    return null;
  }

  return {
    ...receipt,
    fileUrl: normalizePaymentFileUrl(receipt.fileUrl)
  };
}

export function mapPayment(payment) {
  return {
    id: payment?.id || "",
    orderId: payment?.orderId || payment?.order?.id || "",
    amount: Number(payment?.amount || payment?.order?.totalAmount || 0),
    status: payment?.status || "PENDING",
    statusLabel: formatPaymentStatus(payment?.status),
    referenceNumber: payment?.referenceNumber || "",
    notes: payment?.notes || "",
    createdAt: payment?.createdAt || null,
    paymentMethodId: payment?.paymentMethodId || payment?.paymentMethod?.id || "",
    paymentMethodCode: payment?.paymentMethodCode || payment?.paymentMethod?.code || "",
    paymentMethodName: payment?.paymentMethodName || payment?.paymentMethod?.name || "Payment",
    order: payment?.order ? {
      ...payment.order,
      totalAmount: Number(payment.order.totalAmount || 0)
    } : null,
    receipt: mapReceipt(payment?.receipt)
  };
}

export async function fetchPaymentMethods() {
  const data = await apiGet("/payment-methods");
  return ensureArray(data).map(method => ({
    id: method?.id || "",
    code: method?.code || "",
    name: method?.name || "Payment",
    isActive: method?.isActive !== false
  }));
}

export async function createOrderPayment(orderId, paymentMethod) {
  const data = await apiPost(`/payments/orders/${orderId}`, {
    paymentMethod
  });
  return mapPayment(data);
}

export async function uploadBankTransferReceipt(paymentId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const data = await apiPost(`/payments/${paymentId}/receipt`, formData);
  return mapPayment(data);
}

export async function fetchAdminPayments() {
  const data = await apiGet("/admin/payments");
  return ensureArray(data).map(mapPayment);
}

export async function reviewAdminPayment(id, payload) {
  const data = await apiPatch(`/admin/payments/${id}/review`, payload);
  return mapPayment(data);
}