import axios from "axios";

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api/v1`,
  // timeout: 1000,
  headers: {
    "content-type": "application/json",
  },
});
