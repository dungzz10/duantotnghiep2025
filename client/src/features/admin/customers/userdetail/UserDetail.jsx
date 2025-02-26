import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Table, Tag, Tabs } from "antd";
import { useUserDetail } from "./useUserDetail";

const { TabPane } = Tabs;

const UserDetail = () => {
  const { userId } = useParams();
  const { data, isLoading } = useUserDetail(userId);

  if (isLoading) return <div>Loading...</div>;

  const {
    thongTinKhachHang,
    thongTinVi,
    lichSuGiaoDich,
    diaChiGiaoHang,
  } = data?.data || {};

  const transactionColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "maGiaoDich",
      key: "maGiaoDich",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "loaiGiaoDich",
      key: "loaiGiaoDich",
    },
    {
      title: "Số tiền",
      dataIndex: "soTien",
      key: "soTien",
      render: (soTien) => `${soTien.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) => (
        <Tag
          color={
            trangThai === "Thành công"
              ? "green"
              : trangThai === "Đang xử lý"
              ? "processing"
              : "error"
          }
        >
          {trangThai}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "thoiGian",
      key: "thoiGian",
      render: (thoiGian) => new Date(thoiGian).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Thông tin khách hàng">
        <Descriptions column={2}>
          <Descriptions.Item label="Họ tên">
            {thongTinKhachHang?.hoTen}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {thongTinKhachHang?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={thongTinKhachHang?.vaiTro === "admin" ? "geekblue" : "green"}>
              {thongTinKhachHang?.vaiTro}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(thongTinKhachHang?.ngayTao).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: "24px" }}>
        <TabPane tab="Thông tin ví" key="1">
          <Card>
            <Descriptions column={2}>
              <Descriptions.Item label="Số dư">
                {thongTinVi?.soDu?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền nạp">
                {thongTinVi?.tongTienNap?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giao dịch">
                {thongTinVi?.tongGiaoDich}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Lịch sử giao dịch" key="2">
          <Table
            columns={transactionColumns}
            dataSource={lichSuGiaoDich}
            rowKey="maGiaoDich"
          />
        </TabPane>

        <TabPane tab="Địa chỉ giao hàng" key="3">
          <Card>
            {diaChiGiaoHang?.map((address, index) => (
              <p key={index}>{address.diaChi}</p>
            ))}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserDetail;