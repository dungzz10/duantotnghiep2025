import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
      <h1 className="mt-6 text-center text-2xl font-bold ">
        Login to your account
      </h1>
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white w-full py-8 px-4 shadow sm:rounded-lg">
          <Form
            name="basic"
            layout="vertical" // Sử dụng layout "vertical" để nhãn nằm trên input
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Password */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Form.Item style={{ marginTop: "20px" }}>
              <Button type="primary" htmlType="submit" className="w-full">
                Submit
              </Button>
            </Form.Item>

            {/* Sign up link */}
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
