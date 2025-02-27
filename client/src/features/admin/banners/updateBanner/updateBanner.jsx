import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBanner = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isActive, setIsActive] = useState("true");
    const [isLoading, setIsLoading] = useState(false);

    // Lấy dữ liệu banner hiện tại
    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/banners/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setTitle(data.title ?? "");
                    setPreview(data.image ?? null);
                    setIsActive(data.isActive ? "true" : "false");
                }
            } catch (error) {
                console.error("Lỗi khi lấy banner:", error);
            }
        };
        fetchBanner();
    }, [id]);

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Gửi yêu cầu cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            alert("Tiêu đề không được để trống!");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        if (image) formData.append("image", image);
        formData.append("isActive", isActive === "true");

        try {
            const res = await fetch(`http://localhost:5000/api/v1/banners/${id}`, {
                method: "PATCH",
                body: formData,
            });
            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                navigate("/admin/banners");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Cập Nhật Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tiêu đề</label>
                    <input
                        type="text"
                        value={title ?? ""}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Ảnh Banner</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        accept="image/*"
                    />
                </div>

                {preview && (
                    <div className="mt-3">
                        <p className="text-gray-600">Xem trước:</p>
                        <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 font-medium">Trạng thái</label>
                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="true">Hiển thị</option>
                        <option value="false">Ẩn</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang cập nhật..." : "Cập nhật Banner"}
                </button>
            </form>
        </div>
    );
};

export default EditBanner;
