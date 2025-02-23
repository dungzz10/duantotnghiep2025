import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Switch, notification } from "antd";
import userupdateuser from "./useuppdateuseradmin";
import useGetOneUser from "./usegetonruser";
import { useParams } from "react-router-dom";

const { Option } = Select;

const UppdateUserAdmin = () => {
  const { userId } = useParams();
  const { mutate, isLoading: isUpdateLoading } = userupdateuser();
  const { data, isLoading: isUserDataLoading } = useGetOneUser(userId);

  const [form] = Form.useForm();

  useEffect(() => {
    // Khi dữ liệu người dùng đã được tải xong, set dữ liệu vào form
    if (data) {
      form.setFieldsValue({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        active: data.user.active,
      });
    }
  }, [data, form]);

  const onFinish = (values) => {
    // Gửi dữ liệu cập nhật qua mutate (cập nhật người dùng)
    mutate({ userId, data: values });
  };

  return (
    <div className="min-h-screen text-left flex flex-col sm:px-4">
      {isUserDataLoading ? (
        <p>Loading user data...</p>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select the role" }]}>
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Active" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdateLoading}>
              Update User
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UppdateUserAdmin;
