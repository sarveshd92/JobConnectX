import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from "react-redux";
import { setuserdata_global, clearuserdata_global } from "../Utils/Store/userslice";
import { removeall } from "../Utils/Store/applicationSlice";
import { localhost } from "../Utils/constant";

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logoutMessage, setLogoutMessage] = useState("");
  const dispatch = useDispatch();

  const performLogout = async () => {
    try {
      const result = await axios.post(
        localhost + "/api/v1/user/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("result->", result);
      if (result?.data?.success) {
        dispatch(clearuserdata_global());
        dispatch(removeall());

        toast.success(result.data.message, {
          position: "bottom-right",
        });

        setLogoutMessage("Logout successful!");
        navigate("/login");
      } else {
        toast.error(result.data.message, {
          position: "bottom-right",
        });

        setLogoutMessage("Logout failed. Please try again.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed", {
        position: "bottom-right",
      });

      setLogoutMessage("Logout failed. Please try again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performLogout();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen pt-[80px] min-h-screen bg-gray-100">
      {loading ? (
        <Oval
          height={80}
          width={80}
          color="blue"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="lightblue"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <h1 className="text-2xl font-bold">{logoutMessage}</h1>
      )}
    </div>
  );
};

export default Logout;
