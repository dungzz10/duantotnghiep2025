import React from "react";
import { FiCamera } from "react-icons/fi"
const ProfileContain = ({ user }) => {
  return (
    <div>
      <div className="h-52 800px:h-64 relative w-full">
        <label htmlFor="" className="cursor-pointer h-full w-full ">
          <img
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJhbm5lcnxlbnwwfHx8fDE2OTcxMDcyMDU&ixlib=rb-1.2.1&q=80&w=1080"
            alt=""
            className="h-full w-full object-cover rounded-none"
          />
        </label>
        {/* <input type="" /> */}
        <div className="absolute -bottom-14 800px:-bottom-16 left-1/2 right-1/2 -translate-x-1/2   w-32 h-32 rounded-full">
          <img
            src={user?.photo}
            alt=""
            className="h-full w-full object-cover rounded-full"
          />
          <label
            htmlFor="profile-image"
            className="absolute flex justify-center cursor-pointer h-10 right-0 bottom-0 border-primary bg-base-100 rounded-full"
          >
            <FiCamera size={25 } />
          </label>
          <input
            type="file"
            className="hidden "
            name="profile-image"
            id="profile-image"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContain;
