import React, { useState } from "react";
import { getWallet, useNaptien } from "./useProfileApi";
import { message } from "antd";
import { FiCreditCard, FiCalendar } from "react-icons/fi";

const ProfileSidebar = ({ user }) => {
  const [amount, setAmount] = useState("");
  const [showDepositForm, setShowDepositForm] = useState(false);
  const { data: walletData, isLoadingVi } = getWallet();
  const { naptien, isLoadingNap } = useNaptien();
  const dateString = user.createdAt.toString().split("T")[0];
  
  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      message.error("Please enter a valid amount");
      return;
    }
    
    naptien({ amount: Number(amount) }, {
      onSuccess: () => {
        setAmount("");
        setShowDepositForm(false);
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-xl">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100">
          <img src={user.photo} alt={user.name} />
        </div>
      </div>
      <br />
      <h1 className="font-bold text-xl mb-3">{user.name}</h1>
      <h1 className="font-bold text-xl mb-3">{user.email}</h1>
      <p className="text-slate-500">{dateString}</p>
      
      {/* Wallet Section */}
      <div className="w-full mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <FiCreditCard className="text-blue-500 mr-2" />
          <h2 className="font-semibold text-lg">Ví của tôi </h2>
        </div>
        
        {isLoadingVi ? (
          <p className="text-center">Loading wallet...</p>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {walletData?.balance?.toLocaleString() || 0} VND
            </p>
            <button 
              onClick={() => setShowDepositForm(!showDepositForm)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={isLoadingNap}
            >
              {showDepositForm ? "Hủy " : "Nạp Tiền"}
            </button>
          </div>
        )}
        
        {/* Deposit Form */}
        {showDepositForm && (
          <form onSubmit={handleDeposit} className="mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng  (VND)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập Số Lượng "
                min="1000"
                step="1000"
                disabled={isLoadingNap}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              disabled={isLoadingNap}
            >
              {isLoadingNap ? "Processing..." : "Confirm Deposit"}
            </button>
          </form>
        )}
      </div>
      
     
      <button
        className="w-full mt-4 px-4 py-2 flex items-center justify-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <FiCalendar className="mr-2" />
        Transaction History
      </button>
    </div>
  );
};

export default ProfileSidebar;