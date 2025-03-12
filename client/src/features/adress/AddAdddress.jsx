import React, { useState } from "react";
import agent from "../../app/agent";

const addressType = ["home", "Office", "default"];

const AddAdddress = ({ setType }) => {
  const [address, setAddress] = useState("");
  const [selectedType, setSelectedType] = useState("home");

  const handleUpdateAddress = async () => {
    if (!address) {
      alert("Vui lòng nhập địa chỉ!");
      return;
    }

    try {
      const res = await agent.Account.uppdateMe({
        address: [{ address, addressType: selectedType }]
      });
      alert(res.message);
      document.getElementById("adress_model").close();
    } catch (error) {
      console.error("Lỗi cập nhật địa chỉ:", error);
    }
  };

  return (
    <div>
      <dialog id="adress_model" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-center text-lg"> Thêm địa chỉ </h3>

          <div className="modal-action flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="address" className="font-medium">Nhập địa chỉ mới</label>
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
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleUpdateAddress}
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddAdddress;
