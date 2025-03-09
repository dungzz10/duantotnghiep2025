import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  // timeout: 1000,
  headers: {
    "content-type": "application/json",
  },
});
