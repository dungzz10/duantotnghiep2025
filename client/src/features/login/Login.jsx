import React, { useRef, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd"; // Thêm message
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from "react-router-dom";
import { useLogin } from "./loginhandel"; // Giữ nguyên phần này
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useLogin();
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef()

  const onFinish = (values) => {
    if (isVerified == true) {
      mutate(values, {
        onSuccess: (data) => {
          message.success("Đăng nhập thành công!");
          console.log("Login success:", data);
          navigate("/");
        },
        onError: (error) => {
          console.log("Login failed:", error);
          message.error(error.response?.data?.message);
          console.error("Login failed:", error);
        },
      });
    } else {
      message.error('vui lòng xác nhận bạn không phải người máy')
    }
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

  const resetRecaptcha = () => {
    setIsVerified(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };
  return (
    <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white w-full py-8 px-4 shadow sm:rounded-lg">
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
              bạn chưa có tài khoản ?{" "}
              <Link to='/signup' aria-label="Sign up here" className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
                Đăng ký ngay
              </Link>
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
              <Link 
                to="/forgotpassword" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Quên mật khẩu?
              </Link>
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
              className="w-full h-[52px] text-center py-3 rounded bg-[#02c4c4] hover:bg-blue-600 text-white hover:bg-green-dark focus:outline-none my-1"
              loading={isLoading}
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;