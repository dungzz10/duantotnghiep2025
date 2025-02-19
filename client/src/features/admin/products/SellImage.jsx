import { Upload, Button, List, Card, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dsenpijts",
    apiKey: "389331339586573",
    apiSecret: "U1KLipj3F_1NwW5cKHPvAVzcsbY",
  },
});

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
const SellImages = ({ images, setImages }) => {
  const [fileList, setFileList] = useState(images || []);

  const handleUpload = async ({ file }) => {
    try {
      const imgObj = await cloudinaryUpload({
        files: [file],
        uploadPreset: "uploads",
        width: 500,
        height: 500,
      });

      const newImages = [...fileList, ...imgObj];
      setFileList(newImages);
      setImages(newImages); // Cập nhật ảnh trong state của ProductsAdmin
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const handleDelete = (image) => {
    const newImages = fileList.filter((img) => img !== image);
    setFileList(newImages);
    setImages(newImages); // Cập nhật ảnh trong state của ProductsAdmin
  };

  return (
    <div>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        multiple
        accept="image/*"
      >
        <Button icon={<PlusOutlined />}>Thêm Hình Ảnh</Button>
      </Upload>
      <div className="flex flex-wrap gap-2">
        {fileList.map((image, index) => (
          <div
            className="relative w-28 h-28 800px:w-36 800px:h-36 group"
            key={index}
          >
            <Card
              cover={
                <img
                  src={image}
                  alt={`uploaded-${index}`}
                  className="object-cover w-full h-full rounded-md"
                />
              }
              className="relative border-2 rounded-md border-base-300"
            >
              <DeleteOutlined
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-600 bg-red-500 rounded-full p-1 z-10"
                key="delete"
                onClick={() => handleDelete(image)}
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellImages;
