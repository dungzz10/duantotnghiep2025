import React, { useState } from "react";
import { getAddress, deleteAdress } from "./useAddresApi";
import { Table, Button, Space, Typography, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AddressForm from "./AddressForm"; 
const { Title } = Typography;
const { confirm } = Modal;

const Addadress = () => {
  const { data, isLoading } = getAddress();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { deletee, isLoading: isDeleting } = deleteAdress();

  const handleOpenModal = (address = null) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  // Xử lý xóa địa chỉ với confirm modal của Ant Design
  const showDeleteConfirm = (id) => {
   
    confirm({
      title: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        return handleDelete(id);
      },
      onCancel() {
      
      },
    });
  };

  // Xử lý xóa địa chỉ
  const handleDelete = async (id) => {
    try {
      await deletee(id);
    
    } catch (error) {
      message.error("Không thể xóa địa chỉ");
      console.error("Lỗi xóa địa chỉ:", error);
    }
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Loại Địa Chỉ',
      dataIndex: 'addressType',
      key: 'addressType',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
            loading={isDeleting && record.id === editingAddress?.id}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="section p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>My Address</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm địa chỉ
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={data?.addresses || []} 
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: 'Không có địa chỉ' }}
      />
      
      {/* Modal form chung cho cả thêm mới và cập nhật */}
      <AddressForm
        visible={isModalVisible}
        onClose={handleCloseModal}
        address={editingAddress}
      />
    </div>
  );
};

export default Addadress;