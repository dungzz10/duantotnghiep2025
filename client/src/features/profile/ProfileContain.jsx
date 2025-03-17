import React, { useState } from "react";
import { FiCamera, FiEdit2, FiLock, FiMail, FiPhone } from "react-icons/fi";
import { useProfileApi, useUppdatePasswordApi } from "./useProfileApi";

const ProfileContain = ({ user }) => {
  const [openPassword, setOpenPassword] = useState(false);
  const [introduction, setIntroduction] = useState(user?.introduction || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setphone] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { uppdateMe, isLoading } = useProfileApi();
  const { uppdatePass, isLoadingPass } = useUppdatePasswordApi();

  const handleChangeIntro = (e) => {
    e.preventDefault();
    uppdateMe({ introduction });

    console.log("Changing introduction:", introduction);
  };

  const handleChangeEmail = (e) => {
    e.preventDefault();
    uppdateMe({ email });

    console.log("Changing email:", email);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    uppdatePass({ newPassword, currentPassword });
    console.log("Changing password");
  };
  const handleChangePhone = (e) => {
    e.preventDefault();
    uppdateMe({ phone });
  };
  if (isLoading) return <p> loading ....</p>;
  if (isLoadingPass) return <p> loading ....</p>;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto">
      {/* Banner and Profile Image Section */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-48 md:h-64 w-full">
          <img
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJhbm5lcnxlbnwwfHx8fDE2OTcxMDcyMDU&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 border-4 border-white rounded-full">
          <img
            src={user?.photo || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <FiCamera size={16} />
          </label>
          <input
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 pt-16 space-y-6">
        {/* Introduction Section */}
        <div className="flex items-center space-x-4">
          <FiEdit2 className="text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction
            </label>
            <div className="flex items-center space-x-4">
              <textarea
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                rows={3}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Tell us about yourself"
              />
              <button onClick={handleChangeIntro} className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="flex items-center space-x-4">
          <FiMail className="text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="email"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
              />
              <button onClick={handleChangeEmail} className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>
        <div className=" flex items-center space-x-4">
          <FiPhone className="text-blue-500"> </FiPhone>
          <div className="flex-1">
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số Diện Thoại 
            </label>
            <div className="flex items-center space-x-4">
              <input
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                placeholder="Só điện thoại ở đây "
              ></input>
              <button onClick={handleChangePhone} className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="flex items-center space-x-4">
          <FiLock className="text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center space-x-4">
              <p className="flex-1">********</p>
              <button
                onClick={() => setOpenPassword(!openPassword)}
                className="btn btn-outline"
              >
                {openPassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {openPassword && (
              <div className="mt-4 space-y-4">
                <input
                  type="password"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={handlePasswordChange}
                  className="btn btn-primary w-full"
                >
                  Submit New Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContain;
