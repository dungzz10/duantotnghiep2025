import React from "react";
import AddAdddress from "./AddAdddress";
import { getAddress } from "./useAddresApi";

const Addadress = () => {
  const { data, isLoading } = getAddress();
  console.log(data);
  const openModal = () => {
    const modal = document.getElementById("adress_model");
    if (modal) {
      modal.showModal();
    }
  };
  if (isLoading) return <p> loading ....</p>;

  return (
    <div className="section">
      <div className="flex px-2 justify-between items-center">
        <h1 className="text-2xl font-semibold">My Address</h1>
        <button className="btn btn-neutral" onClick={openModal}>
          Thêm Address
        </button>
      </div>
      {/* Address Table */}
      <div className="overflow-x-auto mt-4 max-w-7xl mx-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Loại Địa Chỉ</th>
              <th>Địa Chỉ</th>
              <th>Chỉnh Sửa</th>
            </tr>
          </thead>
          <tbody>
            {data.addresses && data.addresses.length > 0 ? (
              data.addresses.map((address, index) => (
                <tr key={index}>
                  <td>{address.addressType}</td>
                  <td>{address.address}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Sửa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Không có địa chỉ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddAdddress />
    </div>
  );
};

export default Addadress;
