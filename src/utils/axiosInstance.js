import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3001/api/v1";

const REAL_ENDPOINT_PREFIX = /^\/(auth|users|categories|products|cart|orders|payment-methods|payments|tickets|wishlist|settings|services|service-requests|admin\/payments|admin\/tickets|admin\/settings|admin\/services|admin\/service-requests)(\/|$)/;

function normalizeLegacyUrl(url) {
	if (typeof url !== "string") {
		return url;
	}

	let normalized = url;

	if (normalized.startsWith("/api/")) {
		normalized = normalized.replace(/^\/api/, "");
	}

	if (REAL_ENDPOINT_PREFIX.test(normalized)) {
		return normalized;
	}

	const lower = normalized.toLowerCase();

	if (lower.includes("categor")) {
		return "/categories";
	}

	if (lower.includes("order")) {
		return "/orders";
	}

	return "/products";
}

function unwrapEnvelope(data) {
	if (data && typeof data === "object" && data.success === true && "data" in data) {
		return data.data;
	}

	return data;
}

function normalizeAxiosError(error) {
	if (!error?.response) {
		const networkError = new Error("Server unavailable");
		networkError.code = error?.code;
		return networkError;
	}

	const payload = error.response.data;
	let message = "Failed to load data";

	if (typeof payload === "string") {
		message = payload;
	} else if (Array.isArray(payload?.message)) {
		message = payload.message.join(", ");
	} else if (typeof payload?.message === "string") {
		message = payload.message;
	}

	const requestError = new Error(message);
	requestError.status = error.response.status;
	requestError.code = payload?.errorCode || error.code;
	return requestError;
}

// Axios instance
const axiosInstance = axios.create({
	baseURL: API_BASE_URL
});

axiosInstance.interceptors.request.use(config => {
	config.url = normalizeLegacyUrl(config.url);

	return config;
});

axiosInstance.interceptors.response.use(response => ({
	...response,
	data: unwrapEnvelope(response.data)
}), error => Promise.reject(normalizeAxiosError(error)));

export default axiosInstance;