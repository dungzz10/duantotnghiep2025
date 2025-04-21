import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Switch,
  Space,
} from "antd";
import moment from "moment";
import axios from "axios";
import AdminBreadcrumb from "../../../components/admin/AdminBreadcrumb";

const { RangePicker } = DatePicker;
const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/vouchers/admin/voucher"
      );
      setVouchers(response.data.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };

      if (editingVoucher) {
        await axios.put(
          `http://localhost:5000/api/v1/vouchers/admin/voucher/${editingVoucher._id}`,
          data
        );
        message.success("Cập nhật voucher thành công");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/vouchers/admin/voucher",
          data
        );
        message.success("Tạo voucher thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchVouchers();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === "percentage" ? "Phần trăm" : "Số tiền cố định",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) => {
        return record.type === "percentage"
          ? `${value}%`
          : `${value.toLocaleString("vi-VN")}đ`;
      },
    },
    {
      title: "Còn lại",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => <Switch checked={isActive} disabled />,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Handle edit
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    form.setFieldsValue({
      ...voucher,
      dateRange: [moment(voucher.startDate), moment(voucher.endDate)],
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/vouchers/admin/voucher/${id}`
      );
      message.success("Xóa voucher thành công");
      fetchVouchers();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa voucher");
    }
  };

  return (
    <div>
      <AdminBreadcrumb />
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Quản lý Voucher</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingVoucher(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm Voucher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại voucher"
            rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
          >
            <Select>
              <Option value="percentage">Phần trăm</Option>
              <Option value="fixed">Số tiền cố định</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Giá trị"
            rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian hiệu lực"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn hàng tối thiểu"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị tối thiểu" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
