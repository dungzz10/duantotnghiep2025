import React from "react";
// chua su dung 
const ActivationPage = () => {
  const isError = true;
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      {isError ? (
        <p className="text-xl text-red-500">token khong hop le</p>
      ) : (
        <>
          <p className="text-xl"> tai khoan cua ban da duoc tao thanh cong </p>
          <p className="texr-xl mt-2">
            tro lai man hinh dang nhap de dang nhap vao tai khoan
          </p>
        </>
      )}
    </div>
  );
};

export default ActivationPage;
