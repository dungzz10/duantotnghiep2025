export const fetchBanners = async() =>{
    const res = await fetch('http://localhost:5000/api/v1/banners')
    if(!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
    return res.json()
}
export const deleteBanner = async (id) => {
    const res = await fetch(`http://localhost:5000/api/v1/banners/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Lỗi khi xóa banner");
    return res.json();
  };
  