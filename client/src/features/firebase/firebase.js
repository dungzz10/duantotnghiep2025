// Import các hàm cần thiết từ Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyATTlwgjfCVVgYdsHGpGCMz948uwAWV-m8",
  authDomain: "learnfirebases.firebaseapp.com",
  projectId: "learnfirebases",
  storageBucket: "learnfirebases.firebasestorage.app",
  messagingSenderId: "305651417023",
  appId: "1:305651417023:web:5afb966f790e8e59346b0a",
  measurementId: "G-PN7MB3V59F",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Hàm đăng nhập bằng Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Lấy thông tin người dùng Google
    const user = result.user;
    return {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      // Đây là token Firebase, có thể sử dụng để xác thực với backend
      token: await user.getIdToken(),
    };
  } catch (error) {
    throw error;
  }
};

export { auth, googleProvider };
