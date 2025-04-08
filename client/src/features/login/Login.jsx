import React, { useRef, useState } from "react";
import { Form, Input, Button, message, Modal } from "antd"; // Thêm message
import ReCAPTCHA from 'react-google-recaptcha';
import { useLogin, useGoogleLogin } from "./loginhandel";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const Login = ({ isModalOpen, onClose, onForgotPassword, setIsSignupModalOpen }) => {
  const navigate = useNavigate();
  const { googleLogin, isGoogleLoading } = useGoogleLogin();
  const { mutate, isLoading } = useLogin();
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef()

  const onFinish = (values) => {
    if (isVerified) {
      mutate(values, {
        onSuccess: (data) => {
          message.success("Đăng nhập thành công!");
          console.log("Login success:", data);
          onClose(); // Đóng modal Đăng nhập
          navigate("/products"); // Điều hướng đến trang sản phẩm (hoặc trang khác)
        },
        onError: (error) => {
          console.log("Login failed:", error);
          message.error(error.response?.data?.message || "Đăng nhập thất bại!");
        },
      });
    } else {
      message.error("Vui lòng xác nhận bạn không phải người máy");
    }
  };
  const handleGoogleLogin = () => {
    googleLogin(undefined, {
      onSuccess: (data) => {
        message.success("Đăng nhập bằng Google thành công!");
        console.log("Google login success:", data);
        navigate("/");
      },
      onError: (error) => {
        console.log("Google login failed:", error);
        message.error("Đăng nhập bằng Google thất bại!");
      },
    });
  };

  // Hàm xử lý khi form submit thất bại (validation lỗi)
  const onFinishFailed = (errorInfo) => {
    console.error("Validation Failed:", errorInfo);
    // Hiển thị thông báo khi validation không hợp lệ
    message.error("Vui lòng điền đầy đủ thông tin đăng nhập!");
  };
  const handleRecaptcha = (value) => {
    if (value) {
      setIsVerified(true);
    }
  };

  return (
    <>
      <Modal footer={null} open={isModalOpen} onCancel={onClose}>
        <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
          <div className="mt-8 mx-auto w-full max-w-md">
            <Button
              onClick={handleGoogleLogin}
              loading={isGoogleLoading}
              icon={<img width={20} src="https://th.bing.com/th/id/OIP.lsGmVmOX789951j9Km8RagHaHa?w=164&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" />}
              className="w-full mb-4"
              size="large"
            >
              Đăng nhập bằng Google
            </Button>
            <Form
              className="mt-[30px] mx-auto sm:w-[400px]"
              name="form_item_path"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <p tabIndex={0} role="heading" aria-label="Đăng nhập" className="text-2xl font-extrabold leading-6 text-gray-800">
                Đăng nhập
              </p>
              <p className="text-sm mt-4 font-medium leading-none text-gray-500">
                Bạn chưa có tài khoản?{" "}
                <span
                  onClick={() => {
                    onClose(); // Đóng modal Đăng nhập
                    setIsSignupModalOpen(true); // Mở modal Đăng ký
                  }}
                  aria-label="Sign up here"
                  className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
                >
                  Đăng ký ngay
                </span>
              </p>
              <div className="w-full flex items-center justify-between py-5">
                <hr className="w-full bg-gray-400" />
                <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
                <hr className="w-full bg-gray-400" />
              </div>
              <Form.Item className='text-black font-bold'
                name="email"
                label="Email"
                rules={[
                  {
                    message: 'vui lòng nhập email!',
                    required: true,
                    type: 'email'
                  },
                ]}
              >
                <Input className='font-mono border border-indigo-600 h-10' placeholder="nhập email" />
              </Form.Item>
              <Form.Item className='text-black font-bold'
                name="password"
                label="mật khẩu"
                rules={[
                  {
                    message: 'vui lòng nhập password!',
                    required: true,
                    min: 6
                  },
                ]}
              >
                <Input.Password
                  type='password' className='font-mono border border-indigo-600 h-10' placeholder="nhập password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              {/* Thêm link quên mật khẩu */}
              <div className="flex justify-end mb-4">
                <span
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  onClick={onForgotPassword}
                >
                  Quên mật khẩu?
                </span>
              </div>

              <Form.Item >
                <ReCAPTCHA className=''
                  ref={recaptchaRef}
                  sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
                  onChange={handleRecaptcha}
                />
                {isVerified ? (
                  <p>Xác thực thành công!</p>
                ) : (
                  <p className='text-[red]'>Vui lòng xác thực bằng Recaptcha trước khi tiếp tục.</p>
                )}
              </Form.Item>
              <Button
                htmlType="submit"
                className="w-full h-[52px] text-center py-3 rounded bg-[black] hover:bg-blue-600 text-white hover:bg-green-dark focus:outline-none my-1"
                loading={isLoading}
              >
                Đăng nhập
              </Button>
            </Form>

          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;