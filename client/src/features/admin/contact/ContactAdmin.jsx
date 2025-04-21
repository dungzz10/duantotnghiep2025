import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Card, 
  Space 
} from 'antd';
import axios from 'axios';

const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [form] = Form.useForm();

  // Hàm lấy token từ localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };
  console.log(getToken());

  // Cấu hình axios với token
  const axiosInstance = axios.create({
    baseURL: `${getBaseUrl()}/api/v1`,
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get('/contact');
      setContacts(response.data.data);
    } catch (error) {
      message.error('Tải danh sách liên hệ thất bại');
    }
  };

  // Open modal for creating/editing contact
  const showModal = (contact = null) => {
    setCurrentContact(contact);
    setIsModalVisible(true);
    
    // Reset or set form values
    form.resetFields();
    if (contact) {
      form.setFieldsValue(contact);
    }
  };

  
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      if (currentContact) {
        // Update existing contact
        await axiosInstance.put(`/contact/${currentContact._id}/edit`, values);
        message.success('Cập nhật liên hệ thành công');
      } else {
        // Create new contact
        await axiosInstance.post('/contact/create', values);
        message.success('Tạo liên hệ thành công');
      }
      
      fetchContacts();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  // Delete contact
  const handleDelete = async (contactId) => {
    try {
      await axiosInstance.delete(`/contact/${contactId}/delete`);
      message.success('Xóa liên hệ thành công');
      fetchContacts();
    } catch (error) {
      message.error('Xóa liên hệ thất bại');
    }
  };

  // Table columns (giữ nguyên như cũ)
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vấn đề Cần Hỗ Trợ ',
      dataIndex: 'support',
      key: 'support',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Button 
            danger 
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  // Phần render giữ nguyên như code cũ
  return (
    <Card 
      title="Quản Lý Liên Hệ" 
      // extra={
      //   <Button type="primary" onClick={() => showModal()}>
      //     Tạo Liên Hệ Mới
      //   </Button>
      // }
    >
      <Table 
        columns={columns} 
        dataSource={contacts} 
        rowKey="_id"
        pagination={{
          total: contacts.length,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* Modal form giữ nguyên như cũ */}
      <Modal
        title={currentContact ? 'Chỉnh Sửa Liên Hệ' : 'Tạo Liên Hệ Mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="support"
            label="Vấn đề cần hỗ trợ"
            rules={[{ required: true, message: 'Vui lòng nhập tin nhắn' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="message"
            label="Tin nhắn"
            rules={[{ required: true, message: 'Vui lòng nhập tin nhắn' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {currentContact ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ContactAdmin;