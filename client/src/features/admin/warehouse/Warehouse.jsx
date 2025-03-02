import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    Tag,
    Button,
    Popconfirm,
    message,
    Modal,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5000/api/v1/product/getall/");
    return data;
};

const Warehouse = () => {
    const handleDeleteProduct = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/product/delete/${id}`);
            message.success("Sản phẩm đã được xóa");

            fetchProducts(filters);
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa sản phẩm");
        }
    };
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
        setSelectedProduct(null);
    };

    const columns = [
        { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
        { title: "Danh mục", dataIndex: "category", key: "category" },
        {
            title: "Còn hàng",
            dataIndex: "isDeleted",
            key: "isDeleted",
            render: (isDeleted) => (
                <Tag color={isDeleted ? "volcano" : "green"}>
                    {isDeleted ? "Đã xóa" : "Còn hàng"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-4">
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => handleDeleteProduct(record._id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => handleViewDetails(record)}>
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data?.products}
                loading={isLoading}
                rowKey="_id"
                pagination={{ pageSize: 4 }}
            />

            {selectedProduct && (
                <Modal
                    title="Chi tiết sản phẩm"
                    visible={visible}
                    onCancel={handleCloseModal}
                    footer={null}
                >
                    <h3>Size và Màu sắc:</h3>
                    <ul>
                        {selectedProduct.variants.map((variant) => (
                            <li key={variant._id}>
                                {`Màu: ${variant.color}, Kích thước: ${variant.size}, Số lượng: ${variant.quantity}`}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    );
};

export default Warehouse;