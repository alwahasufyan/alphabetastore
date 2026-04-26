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

function shouldUseServerFallback(error) {
	if (typeof window !== "undefined") {
		return false;
	}

	if (!error || error.response) {
		return false;
	}

	return ["ECONNREFUSED", "ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(error.code);
}

function buildServerFallbackData(url) {
	const lower = String(url || "").toLowerCase();

	if (lower.includes("layout")) {
		return {
			topbar: {
				label: "Need help?",
				title: "support@alphabeta.com",
				languageOptions: [{
					title: "EN",
					value: "en"
				}],
				socials: []
			},
			header: {
				logo: "/assets/images/logo.svg",
				navigation: []
			},
			mobileNavigation: {
				logo: "/assets/images/logo.svg",
				version1: []
			},
			footer: {
				logo: "/assets/images/logo.svg",
				description: "Alphabeta store powered by real backend APIs.",
				playStoreUrl: "#",
				appStoreUrl: "#",
				about: [],
				customers: [],
				contact: {
					phone: "+1 000 000 0000",
					email: "support@alphabeta.com",
					address: "Alphabeta HQ"
				},
				socials: []
			}
		};
	}

	return [];
}

function unwrapEnvelope(data) {
	if (data && typeof data === "object" && data.success === true && "data" in data) {
		return data.data;
	}

	return data;
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
}), error => {
	if (shouldUseServerFallback(error)) {
		return Promise.resolve({
			data: buildServerFallbackData(error?.config?.url),
			status: 200,
			statusText: "OK",
			headers: {},
			config: error?.config
		});
	}

	return Promise.reject(error);
});

export default axiosInstance;