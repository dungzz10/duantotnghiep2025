import React, { useState } from "react";
import { getWallet, useNaptien, useRuttien } from "./useProfileApi";
import { message } from "antd";
import { FiCreditCard, FiCalendar } from "react-icons/fi";

const ProfileSidebar = ({ user }) => {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const { data: walletData, isLoadingVi, refetch } = getWallet();
  const { naptien, isLoadingNap } = useNaptien();
  const { ruttien, isLoadingRut } = useRuttien();

  const dateString = user.createdAt.toString().split("T")[0];

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      message.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    naptien({ amount: Number(amount) }, {
      onSuccess: () => {
        setAmount("");
        setShowDepositForm(false);
        refetch();
      }
    });
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || withdrawAmount <= 0) {
      message.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    ruttien({ amount: Number(withdrawAmount) }, {
      onSuccess: () => {
        setWithdrawAmount("");
        setShowWithdrawForm(false);
        refetch();
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
      <p className="text-slate-500">Ngày tham gia: {dateString}</p>

      <div className="w-full mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <FiCreditCard className="text-blue-500 mr-2" />
          <h2 className="font-semibold text-lg">Ví của tôi</h2>
        </div>

        {isLoadingVi ? (
          <p className="text-center">Đang tải ví...</p>
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
              {showDepositForm ? "Hủy" : "Nạp Tiền"}
            </button>

            <button
              onClick={() => setShowWithdrawForm(!showWithdrawForm)}
              className="mt-3 ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              disabled={isLoadingRut}
            >
              {showWithdrawForm ? "Hủy" : "Rút Tiền"}
            </button>
          </div>
        )}

        {showDepositForm && (
          <form onSubmit={handleDeposit} className="mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tiền nạp (VND)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
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
              {isLoadingNap ? "Đang xử lý..." : "Xác nhận nạp tiền"}
            </button>
          </form>
        )}

        {showWithdrawForm && (
          <form onSubmit={handleWithdraw} className="mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tiền rút (VND)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 transition-all"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Nhập số tiền"
                min="1000"
                step="1000"
                disabled={isLoadingRut}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              disabled={isLoadingRut}
            >
              {isLoadingRut ? "Đang xử lý..." : "Xác nhận rút tiền"}
            </button>
          </form>
        )}
      </div>

      <button
        onClick={() => setShowTransactions(!showTransactions)}
        className="w-full mt-4 px-4 py-2 flex items-center justify-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <FiCalendar className="mr-2" />
        {showTransactions ? "Ẩn lịch sử giao dịch" : "Lịch sử giao dịch"}
      </button>

      {showTransactions && walletData?.transactions && (
        <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Lịch sử giao dịch:</h3>
          <ul className="max-h-48 overflow-auto">
            {walletData.transactions.map((tx, index) => (
              <li key={index} className="border-b py-2">
                <span>{tx.description}</span><br />
                <span className="text-sm text-gray-500">Số tiền: {tx.amount.toLocaleString()} VND - Ngày: {new Date(tx.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
