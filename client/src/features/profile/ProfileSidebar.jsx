import React from "react";

const ProfileSidebar = ({ user }) => {
  const dateString = user.createdAt.toString().split("T")[0];
  return (
    <div className="flex flex-col items-center p-4">
      <div className="avatar">
        <div className="w-24 rounded-full  ring ring-primary ring-offset-base-100  ">
          <img src={user.photo} alt={user.name} />
        </div>
      </div>
      <br />
      <h1 className="font-bold text-xl mb-3">{user.name}</h1>
      <h1 className="font-bold text-xl mb-3">{user.email}</h1>
      <p className="text-slate-500"> {dateString} </p>
    </div>
  );
};

export default ProfileSidebar;
