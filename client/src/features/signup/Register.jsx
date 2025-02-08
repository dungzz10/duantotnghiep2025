import React from "react";
import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { userRegister } from "./RegisterUser";
const Register = () => {
  const [form] = Form.useForm();
  const { mutate: Login, isLoading } = userRegister();
  console.log(isLoading);

  const onFinish = (values) => {
    console.log("Success:", values);
    Login(values);
    form.resetFields(); // Reset form after successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen text-left flex flex-col justify-center py-14 sm:px-4 lg:px-8">
      <h1 className="mt-6 text-center text-2xl font-bold ">
        Đăng kí tài khoản của bạn
      </h1>
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white w-full py-8 px-4 shadow sm:rounded-lg">
          <Form
            form={form}
            name="register"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Username */}
            <Form.Item
              label="name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
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
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Submit button */}
            <Form.Item style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                disabled={isLoading}
              >
                Đăng kí
              </Button>
            </Form.Item>

            {/* Login link */}
            <div className="text-left mt-4">
              <span className="text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
