import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";
import { Button, Form, Input, Row, Col, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { getBaseUrl } from "../../../../utils/baseURL";

const AddCategoriesAdmin = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dsenpijts",
      apiKey: "389331339586573",
      apiSecret: "U1KLipj3F_1NwW5cKHPvAVzcsbY",
    },
  });

  const onFinish = async (values) => {
    const payload = {
      name: values.name,
      image: imageUrl,
    };

    try {
      const response = await axios.post(
        `${getBaseUrl()}/api/v1/categories/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Danh mục đã được thêm thành công!");
        navigate("/admin/danh-muc");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm danh mục."
      );
    }
  };

  const cloudinaryUpload = async (uploadOptions) => {
    const { files, uploadPreset, width, height } = uploadOptions;

    const newImages = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      return { formData };
    });

    const imgObj = await Promise.all(
      newImages?.map(async (img) => {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dsenpijts/image/upload",
          {
            method: "POST",
            body: img.formData,
          }
        );

        const data = await response.json();
        const imageUrl = cld
          .image(data.public_id)
          .resize(Resize.scale().width(width).height(height))
          .quality("auto")
          .format("auto")
          .toURL();

        return imageUrl;
      })
    );

    return imgObj;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const imgObj = await cloudinaryUpload({
        files: [file],
        uploadPreset: "upploads",
        width: 500,
        height: 500,
      });

      setImageUrl(imgObj[0]); // Cập nhật state với URL của ảnh
      onSuccess("ok");
    } catch (error) {
      message.error("Upload failed");
      onError(error);
    }
  };

  return (
    <>
      <Form layout="vertical" autoComplete="off" onFinish={onFinish}>
        <Col span={12}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { message: "Không được bỏ trống!", required: true, min: 3 },
            ]}
          >
            <Input className="w-[450px]" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Upload Ảnh"
            name="image"
            rules={[
              { required: true, message: "Vui lòng tải lên một bức ảnh!" },
            ]}
          >
            <Upload
              name="image"
              listType="picture"
              customRequest={handleUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
          </Form.Item>
          {/* Hiển thị ảnh nếu đã tải lên thành công */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            />
          )}
        </Col>
        <Row>
          <Button type="primary" className="bg-blue-500" htmlType="submit">
            Thêm danh mục
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default AddCategoriesAdmin;
