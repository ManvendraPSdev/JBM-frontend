import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import useHandleErr from "../utils/userHandleErr";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id, token } = useParams();
  const handleError = useHandleErr();

  const handleEmailPhoneSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      toast.error("Please enter new password and confirm password");
      return;
    }
    let password = newPassword;
    let response;
    try {
      response = await axios.post(
        `/user/reset-password/${id}/${token}`,
        { password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        toast.success("Password reset successfully");
        navigate("/login");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex justify-center items-center min-h-[92vh]">
        <div className="bg-green-100 p-10 rounded-lg shadow-[0_54px_55px_rgba(0,0,0,0.25),0_-12px_30px_rgba(0,0,0,0.12),0_4px_6px_rgba(0,0,0,0.12),0_12px_13px_rgba(0,0,0,0.17),0_-3px_5px_rgba(0,0,0,0.09)] 
          text-center max-w-md w-[90%] m-5 md:p-10 sm:p-5">
          <form 
            onSubmit={handleEmailPhoneSubmit}
            className="flex flex-col"
          >
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 mb-5 border border-gray-300 rounded-lg bg-white 
                text-gray-800 text-base placeholder-gray-400 focus:outline-none 
                focus:ring-2 focus:ring-green-500 focus:border-transparent
                md:py-2.5 md:text-sm"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 mb-5 border border-gray-300 rounded-lg bg-white 
                text-gray-800 text-base placeholder-gray-400 focus:outline-none 
                focus:ring-2 focus:ring-green-500 focus:border-transparent
                md:py-2.5 md:text-sm"
            />
            <button 
              type="submit"
              className="px-4 py-3 mt-2.5 bg-green-200 border border-green-600 
                rounded-lg text-gray-800 text-base cursor-pointer 
                transition-colors duration-300 hover:bg-green-700 hover:text-white
                md:py-2.5 md:text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;