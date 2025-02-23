import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Switch, notification } from "antd";

const { Option } = Select;

const UppdateCategoriesAdmin = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    role: "categories",
    active: true,
  });

  useEffect(() => {
    // Giả sử lấy dữ liệu người dùng từ nơi khác (ví dụ: từ props hoặc state)
    const fetchedCategoriesData = {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      active: true,
    };

    setInitialValues(fetchedCategoriesData);
    form.setFieldsValue(fetchedCategoriesData);
  }, [form]);

  const onFinish = (values) => {
    // Xử lý dữ liệu được cập nhật
    console.log("Updated Categories Data:", values);

    notification.success({
      message: "Categories Updated",
      description: "Categories details have been successfully updated.",
    });

    // Reset lại các trường trong form
    form.resetFields();
  };

  return (
    <div className="min-h-screen text-left flex flex-col  sm:px-4 ">
      
   
    
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select>
              <Option value="Categories">Categories</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Active" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Categories
            </Button>
          </Form.Item>
        </Form>
      
      </div>
   
  );
};

export default UppdateCategoriesAdmin;
