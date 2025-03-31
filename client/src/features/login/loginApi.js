import agent from "../../app/agent";
import { signInWithGoogle } from "../firebase/firebase";

const loginApi = async (data) => {
  try {
    const res = await agent.Account.login(data);
    return res;
  } catch (error) {
    console.log("eerr", error);

    throw error;
  }
};
const loginWithGoogle = async () => {
  try {
    // Lấy thông tin người dùng từ Google
    const googleUser = await signInWithGoogle();
    
    // Gửi token hoặc thông tin người dùng Google đến backend để xác thực
    // Hoặc xử lý trực tiếp trên frontend nếu không cần backend
    const res = await agent.Account.loginWithGoogle({
      token: googleUser.token,
      email: googleUser.email,
      // Các thông tin khác nếu cần
    });
    
    return res;
  } catch (error) {
    console.log("Google login error", error);
    throw error;
  }
};

export default loginApi;
export { loginWithGoogle };
