import axios from "axios";
import toast from "react-hot-toast";
// import router from "../router/router";
axios.defaults.baseURL = "http://localhost:5000/api/v1";
//  Bật tùy chọn gửi cookie cùng với các yêu cầu (ví dụ: để xử lý xác thực).
axios.defaults.withCredentials = true;
const resBody = (response) => response.data;

// nterceptor: Là một phương pháp trong axios để xử lý các phản hồi trước khi chúng đến ứng dụng hoặc xử lý lỗi từ server.
// response: Nếu yêu cầu thành công, nó trả về phản hồi như ban đầu.
// err: Nếu yêu cầu gặp lỗi
axios.interceptors.response.use(
    async (response) => response,
    (err) => {
        // console.log("Error 3", err);
      const { response } = err; // Trích xuất `response` từ `err`
      console.log("Error ", response);
      if (response) {
        const { data, status } = response; // Chỉ truy cập khi `response` tồn tại
        if (status === 400) {
          console.log("Unauthorized");
          console.log(data.message);
          toast.error(data.message);
        } else if (status === 403) {
          console.log("Forbidden");
            console.log(data.message);
          toast.error(data.message);
        }
      } else {
        console.error("Network or server error", err); // Log lỗi chi tiết
        toast.error("An unexpected error occurred. Please try again later.");
      }
      return Promise.reject(err);
    }
  );
const requset ={
    get: (ur,params) => axios.get(url,{params}).then(resBody),
    post: (url, body) => axios.post(url, body).then(resBody),
    put: (url, body) => axios.put(url, body).then(resBody),
    delete: (url) => axios.delete(url).then(resBody),
}
const Account = {
    login: (body) => requset.post("/user/signin", body),
    register: (body) => requset.post("/user/signup", body),
    logout: () => requset.post("/user/logout"),
    me: () => requset.get("/user/me"),
}
const agent ={
    Account,
}
export default agent;
