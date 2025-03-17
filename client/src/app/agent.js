import axios from "axios";
import toast from "react-hot-toast";
import { data } from "react-router-dom";

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
          if (data?.message && data.message !== "Thành công") {
            console.warn("Unauthorized:", data.message);
          }

          console.log("data", data);
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
      // console.log("res", res);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.yesUser));
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
      localStorage.removeItem("user");
      return res;
      // localStorage.removeItem("token"); //
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
  deactiveUser: (id) => {
    try {
      const res = request.put(`/user/deactive/${id}`);
      return res;
    } catch (error) {}
  },
  uppdateMe: (data) => {
    try {
      const res = request.put(`/user/me`, data);
      return res;
    } catch (error) {}
  },
  uppdatePassword: async (data) => {
    try {
      const res = await request.put(`user/uppdatepassword`, data);
      return res;
    } catch (error) {}
  },
  myAddress: async () => {
    try {
      const res = await request.get("user/my-addresses");
      return res;
    } catch (error) {
      throw error;
    }
  },
  addAdress: async (data) => {
    try {
      const res = await request.post("user/add-address", data);
      return res;
    } catch (error) {
      throw error;
    }
  },
  uppdateAdress: async (data) => {
    try {
      const res = await request.put("user/update-address", data);
      return res;
    } catch (error) {
      throw error;
    }
  },
  deleteAdress: async (id) => {
    try {
      const res = await request.delete(`user/delete-address/${id}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
  naptien: async (amount) => {
    try {
      const res = await request.post("user/payment/wallet/deposit", amount);
      return res;
    } catch (error) {
      throw error;
    }
  },
  getWallet: async () => {
    try {
      const res = await request.get("user/wallet/balance");
      return res;
    } catch (error) {
      throw error;
    }
  },
 
};
const Product = {
  getAllProducts: async (params) => {
    // console.log("body",body)
    try {
      const res = await request.get("/product", params);
      console.log("abc", res);
      return res;
    } catch (error) {
      throw error;
    }
  },
  
  getOneProduct: async (id) => {
    try {
      const res = await request.get(`/product/${id}`);

      return res;
    } catch (error) {
      throw error;
    }
  },
  uppdateProduct: async (id, body) => {
    try {
      const res = await request.put(`/product/${id}`, body);
      return res;
    } catch (error) {
      throw error;
    }
  },
};
const Categories = {
  getAllCategories: async () => {
    try {
      const res = await request.get("/categories/");
      return res;
    } catch (error) {
      throw error;
    }
  },
  getCate : async ()=>{
    try {
      const res = await request.get("categories/getall");
      return res;
    } catch (error) {
      throw error;
    }
  },
  RemoveCategory: async (_id) => {
    return request.delete(`/categories/${_id}`);
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
  getAllUser: async () => {
    try {
      const res = await request.get("/user/");
      return res;
    } catch (error) {
      throw error;
    }
  },
  getOneUser: async (userId) => {
    try {
      const res = await request.get(`/user/${userId}`);
      console.log(res);
      return res;
    } catch (error) {
      throw error;
    }
  },

  uppdateUser: async (userId, body) => {
    try {
      const res = await request.post(`/user/uppdate/${userId}`, body);
      return res;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (body) => {
    try {
      const res = await request.post("/product/", body);
      return res;
    } catch (error) {
      throw error;
    }
  },
};
const Category = {
  getAllCategory: async () => {
    try {
      const res = await request.get("/categories/getall");
      return res;
    } catch (error) {
      throw error;
    }
  },
};

// 📌 Tạo `agent` để dễ dàng import vào các file khác
const agent = {
  Account,
  Product,
  Categories,
  Admin,
  Category,
};

export default agent;
