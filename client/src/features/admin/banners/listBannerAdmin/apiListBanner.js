import { getBaseUrl } from "../../../../utils/baseURL";

export const fetchBanners = async() =>{
    const res = await fetch(`${getBaseUrl()}/api/v1/banners`)
    if(!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
    return res.json()
}
export const deleteBanner = async (id) => {
    const res = await fetch(`${getBaseUrl()}/api/v1/banners/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Lỗi khi xóa banner");
    return res.json();
  };

export const updateBanner = async(id) => {
    const res = await fetch(`${getBaseUrl()}/api/v1/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật banner");
      return res.json();
}