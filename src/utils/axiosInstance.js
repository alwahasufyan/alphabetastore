import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3001/api/v1";
const ENABLE_BAZAAR_MOCKS = process.env.NEXT_PUBLIC_ENABLE_BAZAAR_MOCKS === "true" || typeof window === "undefined";

// Axios instance
const axiosInstance = axios.create({
	baseURL: ENABLE_BAZAAR_MOCKS ? undefined : API_BASE_URL
});


export const Mock = ENABLE_BAZAAR_MOCKS ? new MockAdapter(axiosInstance) : null;

if (Mock) {
	MockEndPoints(Mock);
}

export default axiosInstance;