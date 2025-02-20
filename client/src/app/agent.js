import axios from "axios";
import toast from "react-hot-toast";
import { getAllProduct } from "../../../server/controllers/productControll";

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true; // Cho phép gửi cookie cùng request

const resBody = (response) => response.data;

// 📌 Interceptor để tự động thêm token vào request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Token được thêm vào mọi request một cách tự động.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📌 Interceptor để xử lý lỗi response
axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    try {
      const { response } = err;

      if (response) {
        const { data, status } = response;

        if (status === 400) {
          console.warn("Unauthorized:", data.message);
          console.log("data", data.message);
          toast.error(data.message);
        } else if (status === 403) {
          console.warn("Forbidden:", data.message);
          toast.error(data.message);
        }
      } else {
        throw new Error("Network or server error");
      }
    } catch (error) {
      console.error("Error:", error.message || err);
      toast.error(error.message || "An unexpected error occurred.");
    }

    return Promise.reject(err);
  }
);

// 📌 Tạo một object để quản lý các request HTTP
const request = {
  get: (url, params) => axios.get(url, { params }).then(resBody),
  post: (url, body) => axios.post(url, body).then(resBody),
  put: (url, body) => axios.put(url, body).then(resBody),
  delete: (url) => axios.delete(url).then(resBody),
};

// 📌 Tạo API cho các thao tác tài khoản (login, register, logout, v.v.)
const Account = {
  loadUser: () => request.get("/user/loaduser"),

  login: async (body) => {
    try {
      const res = await request.post("/user/signin", body);
      if (res.token) {
        localStorage.setItem("token", res.token); // ✅ Lưu token vào localStorage
      }
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  register: async (body) => {
    try {
      const res = await request.post("/user/signup", body);
      if (res.token) {
        localStorage.setItem("token", res.token); // ✅ Lưu token sau khi đăng ký
      }
      return res;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const res = await request.post("/user/logout");
      console.log("Logout Success:", res);
      return res;
      // localStorage.removeItem("token"); // ✅ Xóa token khi logout
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },
  forgotPassword: async (email) => {
    console.log("body", email);
    try {
      const res = await request.post("/user/forgotpassword", { email }); // Bọc email vào object
      // console.log("Forgot Password Success:", res);
      return res;
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (body) => {
    try {
      const res = await request.post(
        `/user/resetpassword/${body.resetToken}`,
        body
      );
      return res;
    } catch (error) {
      throw error;
    }
  },

  me: () => request.get("/user/me"),
};
const Product = {
  getAllProducts: async (body) => {
    try {
      const res = await request.get("/product", body);
      return res;
    } catch (error) {
      throw error;
    }
  },
};
const Admin = {
  loginadmin: async (body) => {
    try {
      const res = await request.post("/user/admin/signin", body);
      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logoutAdmin: async () => {
    try {
      const res = await request.post("/user/admin/logout");
      console.log("Logout Admin Success:", res);
      return res;
    } catch (error) {
      console.error("Logout Admin failed:", error);
      throw error;
    }
  },

  loadAdmin: async () => {
    try {
      const res = await request.get("/user/admin/loadadmin");
      console.log("Load Admin Success:", res);
      return res;
    } catch (error) {
      console.error("Load Admin failed:", error);
      throw error;
    }
  },
};

// 📌 Tạo `agent` để dễ dàng import vào các file khác
const agent = {
  Account,
  Product,
  Admin,
};

export default agent;
