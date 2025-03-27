import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd"; // Thêm message
import { Link } from "react-router-dom";
import { useLogin } from "./loginhandel"; // Giữ nguyên phần này
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useLogin();

  const onFinish = (values) => {
    console.log("Form Values:", values);

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
  };

  // Hàm xử lý khi form submit thất bại (validation lỗi)
  const onFinishFailed = (errorInfo) => {
    console.error("Validation Failed:", errorInfo);
    // Hiển thị thông báo khi validation không hợp lệ
    message.error("Vui lòng điền đầy đủ thông tin đăng nhập!");
  };

  return (
    <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
      <h1 className="mt-6 text-center text-2xl font-bold ">
        Đăng Nhập Tài Khoản
      </h1>
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white w-full py-8 px-4 shadow sm:rounded-lg">
          <Form
            name="basic"
            layout="vertical" // Layout với label bên trên
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish} // Hàm xử lý khi submit form
            onFinishFailed={onFinishFailed} // Hàm xử lý khi validation lỗi
            autoComplete="off"
          >
            {/* Input email */}
            <Form.Item
              label="email"
              name="email"
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                { required: true, message: "Please input your email" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Input Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Remember me and Forgot password */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox>Ghi Nhớ </Checkbox>
              <Link
                to="/forgotpassword"
                className="text-sm text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: "20px" }}>
              <Button
                disabled={isLoading}
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isLoading} // Hiển thị loading khi đang gửi request
              >
               Đăng Nhập
              </Button>
            </Form.Item>

            {/* Link to Sign Up */}
            <div className="text-left mt-4">
              <span className="text-sm">
               Bạn Không Có Tài Khoản {" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                 Đăng Kí
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
