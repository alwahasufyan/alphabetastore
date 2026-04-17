import { cache } from "react";
import axios from "../axiosInstance";

// CUSTOM DATA MODEL

const getLayoutData = cache(async () => {
  const response = await axios.get("/api/layout");
  return response.data;
});
export default {
  getLayoutData
};