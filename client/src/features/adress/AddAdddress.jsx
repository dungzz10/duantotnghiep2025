import React from "react";
const addressType = ["home", "Office", "default"];

const AddAdddress = ({ setType }) => {
  return (
    <div>
      <dialog id="adress_model" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-center text-lg"> Thêm địa chỉ </h3>

          <div className="modal-action flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="address" className="font-medium">Tìm địa chỉ</label>
              <input className="input input-bordered w-full" />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label htmlFor="addressType" className="font-medium">Chọn loại địa chỉ</label>
              <select
                id="addressType"
                className="select select-bordered w-full"
                onChange={(e) => setType(e.target.value)}
              >
                <option defaultValue="">Chọn loại địa chỉ</option>
                {addressType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút Xác nhận được cải tiến */}
            <button 
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
