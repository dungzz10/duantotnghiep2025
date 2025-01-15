import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import loginApi from "./loginApi"; // Đảm bảo loginApi là hàm đúng

const Login = () => {
  // Sử dụng React Query's useMutation
  const loginMutation = useMutation({
    mutationFn: async(data)=>{
      return await loginApi(data);
    }
  })
  // Hàm xử lý khi form được submit thành công
  const onFinish = (values) => {
    console.log("Form Values:", values);
    loginMutation.mutate(values); // Gửi dữ liệu form tới API
  };

  // Hàm xử lý khi form submit thất bại (validation lỗi)
  const onFinishFailed = (errorInfo) => {
    console.error("Validation Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
      <h1 className="mt-6 text-center text-2xl font-bold ">
        Login to your account
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
            {/* Input Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
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
              <Checkbox>Remember me</Checkbox>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loginMutation.isLoading} // Hiển thị loading khi đang gửi request
              >
                Submit
              </Button>
            </Form.Item>

            {/* Link to Sign Up */}
            <div className="text-left mt-4">
              <span className="text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign up
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
