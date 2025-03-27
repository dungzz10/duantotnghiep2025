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
              label="Tên tài khoản"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn !" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn !" },
                { type: "email", message: "Vui LÒng Nhập đúng định dạng Email !" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập passWord!" },
                { min: 6, message: "PassWord phải có ít nhất 6 kí tự !" },
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
                { required: true, message: "Vui lòng Xác Nhận Passưord!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password không khớp !"));
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
               Bạn Đã Có Tài Khoản ?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline">
                  Đăng Nhập
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
