import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setloading } from "../Utils/Store/authslice.js";
import { localhost } from "../Utils/constant.js";

const SignUp = () => {
  const fullname = useRef(null);
  const username = useRef(null);
  const email = useRef(null);
  const phoneno = useRef(null);
  const password = useRef(null);
  const file = useRef(null);

  const [role, setRole] = useState("Student");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const HandleSubmit = async (e) => {
    e.preventDefault();
if (
  !fullname.current.value ||
  !username.current.value ||
  !email.current.value ||
  !phoneno.current.value ||
  !password.current.value ||
  !file.current.files?.[0]
) {
  toast.error("Please fill all fields and upload resume.");
  return;
}
    const formData = new FormData();
    formData.append("fullname", fullname.current.value);
    formData.append("username", username.current.value);
    formData.append("email", email.current.value);
    formData.append("phoneno", phoneno.current.value);
    formData.append("password", password.current.value);
    formData.append("role", role);
    formData.append("resume", file.current.files?.[0]);

    try {
      dispatch(setloading(true));

      const result = await axios.post(
        localhost+"/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (result?.data?.success) {
        toast.success(result.data.message);
        navigate("/Login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed!");
    } finally {
      dispatch(setloading(false));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 p-6 pt-[80px] min-h-screen bg-gray-100 bg-white border border-gray-200 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Create Your Account
      </h1>

      <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
           
          ref={fullname}
        className={inputStyle}
        />
        <input
          type="text"
          placeholder="Username"
           
          ref={username}
      className={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
           
          ref={email}
         className={inputStyle}
        />
        <input
          type="text"
          placeholder="Phone Number"
           
          ref={phoneno}
         className={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
           
          ref={password}
          className={inputStyle}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Select Role</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input
                type="radio"
                value="Student"
                checked={role === "Student"}
                onChange={(e) => setRole(e.target.value)}
              />
              Student
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input
                type="radio"
                value="Recruiter"
                checked={role === "Recruiter"}
                onChange={(e) => setRole(e.target.value)}
              />
              Recruiter
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Resume
          </label>
          <input
            type="file"
             
            ref={file}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-1.5 bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

// Tailwind utility class to avoid repetition
const inputStyle = `
  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
  focus:border-blue-500 block w-full p-2.5
`;

export default SignUp;
