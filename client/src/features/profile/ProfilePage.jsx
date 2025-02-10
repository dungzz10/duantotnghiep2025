import React from "react";
import Header from "../../components/Header";
import { useUser } from "../../app/hook/LoadUser";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContain from "./ProfileContain";
const ProfilePage = () => {
  const { user ,isLoading} = useUser();
  // console.log("User: profile", isLoading);
  // console.log("User: profile", user);
  if (isLoading) return <div>Loading...</div>
  return (
    <>
   {}
    <div>
      <Header user={user} />
      <div className="section normalFlexResponsive align-middle flex items-center justify-center h-screen">
        <div className="w-full 800px:w-3/12 self-start mb-14 800px:mr-12 800px:mb-0 text-center">
          <ProfileSidebar user={user && user} />
        </div>
        <div className="w-full self-start 800px:w-9/12 text-center">
          <ProfileContain user={user && user} />
        </div>
      </div>
      <br />
    </div>
    </>
  );
};

export default ProfilePage;
