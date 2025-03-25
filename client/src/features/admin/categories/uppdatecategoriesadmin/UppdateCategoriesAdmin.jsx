import React, { useState, useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";
import { Button, Form, Input, Row, Col, Upload, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UppdateCategoriesAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    // Fetch the existing category data
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/categories/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setInitialData(data.data);
          setImageUrl(data.data.image);
          form.setFieldsValue(data.data);
        } else {
          message.error("Failed to fetch category data");
        }
      } catch (error) {
        message.error("Error fetching category data");
      }
    };

    fetchCategory();
  }, [id, form]);

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
      image: imageUrl || initialData.image, // Use the new image URL or the old one if not provided
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/categories/${id}/edit`,
        payload, // Add the payload here
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Danh mục đã được cập nhật thành công!");
        navigate("/admin/categories/listcategoriesadmin");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      message.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật danh mục."
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

        return cld
          .image(data.public_id)
          .resize(Resize.scale().width(width).height(height))
          .quality("auto")
          .format("auto")
          .toURL();
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

      setImageUrl(imgObj[0]);
      onSuccess("ok");
    } catch (error) {
      message.error("Upload failed");
      onError(error);
    }
  };
  const removeImage = () => {
    setImageUrl(""); // Clears the image URL
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
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
          <Form.Item label="Upload Ảnh" name="image">
            <Upload
              name="image"
              listType="picture"
              customRequest={handleUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt="Category"
                  style={{ width: "100px", marginTop: "10px" }}
                />
                <Button
                  onClick={removeImage}
                  type="link"
                  style={{ marginTop: "10px" }}
                >
                  Xóa ảnh
                </Button>
              </>
            )}
          </Form.Item>
        </Col>
        <Row>
          <Button type="primary" className="bg-blue-500" htmlType="submit">
            Cập nhật danh mục
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default UppdateCategoriesAdmin;
