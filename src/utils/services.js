import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export const SERVICE_REQUEST_STATUS_OPTIONS = [{
  value: "PENDING",
  label: "Pending"
}, {
  value: "CONTACTED",
  label: "Contacted"
}, {
  value: "COMPLETED",
  label: "Completed"
}, {
  value: "CANCELLED",
  label: "Cancelled"
}];

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatServiceRequestStatus(status) {
  return SERVICE_REQUEST_STATUS_OPTIONS.find(item => item.value === status)?.label || "Pending";
}

export function mapService(service) {
  return {
    id: service?.id || "",
    name: service?.name || "Service",
    slug: service?.slug || "",
    description: service?.description || "",
    basePrice: service?.basePrice !== null && service?.basePrice !== undefined ? Number(service.basePrice) : null,
    isActive: service?.isActive !== false,
    createdAt: service?.createdAt || null,
    updatedAt: service?.updatedAt || null
  };
}

export function mapServiceRequest(request) {
  const service = request?.service ? mapService(request.service) : null;

  return {
    id: request?.id || "",
    serviceId: request?.serviceId || service?.id || "",
    userId: request?.userId || null,
    customerName: request?.customerName || "",
    customerPhone: request?.customerPhone || "",
    preferredDate: request?.preferredDate || null,
    addressText: request?.addressText || "",
    notes: request?.notes || "",
    status: request?.status || "PENDING",
    statusLabel: formatServiceRequestStatus(request?.status),
    createdAt: request?.createdAt || null,
    updatedAt: request?.updatedAt || null,
    service,
    user: request?.user || null
  };
}

export async function fetchPublicServices() {
  const data = await apiGet("/services");
  return ensureArray(data).map(mapService);
}

export async function fetchAdminServices() {
  const data = await apiGet("/admin/services");
  return ensureArray(data).map(mapService);
}

export async function createAdminService(payload) {
  const data = await apiPost("/services", payload);
  return mapService(data);
}

export async function updateAdminService(id, payload) {
  const data = await apiPatch(`/services/${id}`, payload);
  return mapService(data);
}

export async function deleteAdminService(id) {
  return apiDelete(`/services/${id}`);
}

export async function createServiceRequest(payload) {
  const data = await apiPost("/service-requests", payload);
  return mapServiceRequest(data);
}

export async function fetchMyServiceRequests() {
  const data = await apiGet("/service-requests/my");
  return ensureArray(data).map(mapServiceRequest);
}

export async function fetchAdminServiceRequests() {
  const data = await apiGet("/admin/service-requests");
  return ensureArray(data).map(mapServiceRequest);
}

export async function updateAdminServiceRequestStatus(id, payload) {
  const data = await apiPatch(`/admin/service-requests/${id}/status`, payload);
  return mapServiceRequest(data);
}
