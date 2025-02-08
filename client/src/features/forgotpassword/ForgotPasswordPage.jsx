import React, { useState } from "react";
import { useforgotpassword } from "./forgotpassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotpassword, isLoading } = useforgotpassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // console.log(email);
      forgotpassword(email); // Gọi hàm forgotpassword với email
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="w-[400px] p-10 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="w-full float-left">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here"
            className="input input-bordered w-full max-w-xs"
          />
          <br />
          <br />
          <input
            disabled={isLoading}
            type="submit"
            value={isLoading ? "Loading..." : "Submit"}
            className="btn-accent btn float-left"
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
