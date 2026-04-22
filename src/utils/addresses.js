import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function mapAddress(address) {
  return {
    id: address?.id || "",
    label: address?.label || "Address",
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    city: address?.city || "",
    addressLine: address?.addressLine || "",
    notes: address?.notes || "",
    isDefault: Boolean(address?.isDefault),
    createdAt: address?.createdAt || null,
    updatedAt: address?.updatedAt || null,
    title: address?.label || "Address",
    street: address?.addressLine || "",
    displayAddress: [address?.addressLine, address?.city].filter(Boolean).join(", ")
  };
}

export async function fetchMyAddresses() {
  const data = await apiGet("/users/me/addresses");
  return ensureArray(data).map(mapAddress);
}

export async function fetchMyAddressById(id) {
  const data = await apiGet(`/users/me/addresses/${id}`);
  return mapAddress(data);
}

export async function createMyAddress(payload) {
  const data = await apiPost("/users/me/addresses", payload);
  return mapAddress(data);
}

export async function updateMyAddress(id, payload) {
  const data = await apiPatch(`/users/me/addresses/${id}`, payload);
  return mapAddress(data);
}

export async function deleteMyAddress(id) {
  return apiDelete(`/users/me/addresses/${id}`);
}