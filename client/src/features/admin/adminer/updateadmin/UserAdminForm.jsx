import React from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBaseUrl } from "../../../../utils/baseURL";

const { Option } = Select;

const UserAdminForm = ({ visible, onCancel, user, onSubmit }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${getBaseUrl()}/api/v1/user/admin/signup`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Tạo tài khoản thành công");
      queryClient.invalidateQueries(["adminUsers"]);
      onCancel();
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Thêm mutation để cập nhật user
  const updateUser = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
       `${getBaseUrl()}/api/v1/user/admin/uppdate/${user._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật tài khoản thành công");
      queryClient.invalidateQueries(["adminUsers"]);
      onCancel();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const onFinish = (values) => {
    if (user) {
      // Gọi mutation cập nhật
      updateUser.mutate(values);
    } else {
      // Gọi mutation tạo mới
      createUser.mutate(values);
    }
  };

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  return (
    <Modal
      title={user ? "Cập nhật Admin" : "Thêm Admin mới"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={createUser.isLoading || updateUser.isLoading}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        {!user && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="superadmin">Super Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAdminForm;
