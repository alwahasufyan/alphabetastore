import { cache } from "react";
import { deleteMyAddress, fetchMyAddresses } from "utils/addresses";

const TIMES = [{
  label: "9AM - 11AM",
  value: "9AM - 11AM"
}, {
  label: "11AM - 1PM",
  value: "11AM - 1PM"
}, {
  label: "3PM - 5PM",
  value: "3PM - 5PM"
}, {
  label: "5PM - 7PM",
  value: "5PM - 7PM"
}];
function mapAddress(address) {
  return {
    id: address.id,
    name: address.label || "Address",
    phone: address.phone,
    street1: address.addressLine,
    street2: address.city,
    city: address.city,
    state: "",
    country: "",
    zip: ""
  };
}

export const getAddresses = cache(async () => {
  try {
    const addresses = await fetchMyAddresses();
    return Array.isArray(addresses) ? addresses.map(mapAddress) : [];
  } catch {
    return [];
  }
});
export const deleteAddress = cache(async id => {
  try {
    await deleteMyAddress(String(id));
  } catch {
    // Keep this legacy wrapper resilient for compatibility.
  }

  return getAddresses();
});
export const getDeliveryTimes = cache(async () => {
  return TIMES;
});
export const getCards = cache(async () => {
  return [];
});