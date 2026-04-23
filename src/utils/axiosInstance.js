import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3001/api/v1";

const REAL_ENDPOINT_PREFIX = /^\/(auth|users|categories|products|cart|orders|payment-methods|payments|tickets|wishlist|settings|admin\/payments|admin\/tickets|admin\/settings)(\/|$)/;

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

// Axios instance
const axiosInstance = axios.create({
	baseURL: API_BASE_URL
});

axiosInstance.interceptors.request.use(config => {
	config.url = normalizeLegacyUrl(config.url);

	return config;
});

export default axiosInstance;