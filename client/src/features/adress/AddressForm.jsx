import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Space, message } from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { addAdress, uppdateAdress, deleteAdress } from "./useAddresApi";

const { Option } = Select;

const addressTypes = ["home", "Office", "default"];

const AddressForm = ({ visible, onClose, address }) => {
  const [form] = Form.useForm();
  const { mutate: add, isLoading: isAdding } = addAdress();
  const { uppdate, isLoading: isUpdating } = uppdateAdress();
  const { deletee, isLoading: isDeleting } = deleteAdress();

  const isEditing = !!address;

 
  useEffect(() => {
    if (visible) {
      if (address) {
        form.setFieldsValue({
          address: address.address,
          addressType: address.addressType,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          addressType: 'home',
        });
      }
    }
  }, [visible, address, form]);

  // Xử lý lưu địa chỉ
  const handleSave = async (values) => {
    try {
      if (isEditing) {
        await uppdate({ 
          data: { 
            id: address.id, 
            address: values.address, 
            addressType: values.addressType 
          } 
        });
      
      } else {
        await add({ 
          data: { 
            address: values.address, 
            addressType: values.addressType 
          } 
        });
        message.success('Thêm địa chỉ thành công');
      }
      onClose();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error("Lỗi xử lý địa chỉ:", error);
    }
  };

  // Xử lý xóa địa chỉ
  const handleDelete = async () => {
    if (!address) return;
    
    try {
      await deletee(address.id);
      message.success('Đã xóa địa chỉ thành công');
      onClose();
    } catch (error) {
      message.error('Không thể xóa địa chỉ');
      console.error("Lỗi xóa địa chỉ:", error);
    }
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        return handleDelete();
      },
    });
  };

  return (
    <Modal
      title={isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ của bạn" />
        </Form.Item>
        
        <Form.Item
          name="addressType"
          label="Loại địa chỉ"
          rules={[{ required: true, message: 'Vui lòng chọn loại địa chỉ!' }]}
        >
          <Select placeholder="Chọn loại địa chỉ">
            {addressTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item className="mb-0">
          <div className="flex justify-between">
            <Button onClick={onClose}>
              Hủy
            </Button>
            
            <Space>
              {isEditing && (
                <Button 
                  danger 
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={showDeleteConfirm}
                  loading={isDeleting}
                >
                  Xóa
                </Button>
              )}
              
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isAdding || isUpdating}
              >
                {isEditing ? "Cập nhật" : "Xác nhận"}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressForm;