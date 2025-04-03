import axios from "axios";
import { getBaseUrl } from "../utils/baseURL";

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api/v1`,
  // timeout: 1000,
  headers: {
    "content-type": "application/json",
  },
});
