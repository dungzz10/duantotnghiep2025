import React, { useState, useEffect } from "react";
import { addAdress, uppdateAdress, deleteAdress } from "./useAddresApi";
import { message } from "antd";

const addressType = ["home", "Office", "default"];

const AddAdddress = ({ setEditingAddress, editingAddress }) => {
  const [address, setAddress] = useState("");
  const [selectedType, setSelectedType] = useState("home");
  const { mutate: add, isLoading: isAdding } = addAdress();
  const { uppdate, isLoading: isUpdating } = uppdateAdress();
  const { deletee, isLoading: isDeleting } = deleteAdress();

  useEffect(() => {
    if (editingAddress) {
      setAddress(editingAddress.address);
      setSelectedType(editingAddress.addressType);
    } else {
    
      setAddress("");
      setSelectedType("home");
    }
  }, [editingAddress]);

  const handleSaveAddress = async () => {
    if (!address) {
      message.warning("Vui lòng nhập địa chỉ");
      return;
    }
    try {
      if (editingAddress) {
        uppdate({ data: { id: editingAddress.id, address, addressType: selectedType } });
      } else {
        add({ data: { address, addressType: selectedType } });
      }
      document.getElementById("adress_model").close();
      setEditingAddress(null);
    } catch (error) {
      console.error("Lỗi xử lý địa chỉ:", error);
    }
  };

  const handleDelete = async () => {
    if (!editingAddress) return;
    
    try {
      await deletee(editingAddress.id);
      document.getElementById("adress_model").close();
      setEditingAddress(null);
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error);
    }
  };

  const closeModal = () => {
    document.getElementById("adress_model").close();
    setEditingAddress(null);
  };

  return (
    <div>
      <dialog id="adress_model" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-center text-lg">
            {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          </h3>
          <div className="modal-action flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="address" className="font-medium">Nhập địa chỉ</label>
              <input
                className="input input-bordered w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="addressType" className="font-medium">Chọn loại địa chỉ</label>
              <select
                id="addressType"
                className="select select-bordered w-full"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {addressType.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between gap-2 w-full mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              {editingAddress && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              )}
              <button
                onClick={handleSaveAddress}
                className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                disabled={isAdding || isUpdating}
              >
                {isAdding || isUpdating ? "Đang xử lý..." : editingAddress ? "Cập nhật" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddAdddress;