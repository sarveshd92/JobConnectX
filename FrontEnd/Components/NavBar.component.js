import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile.component";
import Login from "./Login.component.js";
import SignUp from "./SignUp.component.js";
// import use_user_info from "../Utils/use_user_info.utils.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addapplication } from "../Utils/Store/applicationSlice.js";
const NavBar = () => {
  const{userdata_global}=useSelector((store)=>store.userslice)

  const fullName = userdata_global?.data?.username;
  const Bio = userdata_global?.data?.Profile?.bio;

  const dispatch=useDispatch();

 
 
  useEffect(()=>{

  },[dispatch])
  
  return (
    <div className="h-16 w-full flex justify-between items-center px-8 bg-gray-100 box-border">
      <div className="flex items-center h-full">
        <h1 className="text-blue-600 font-bold text-2xl">
          Job<span className="text-red-400">ConnectX</span>
        </h1>
      </div>
      <div className="h-full flex items-center">
        <ul className="flex items-center gap-8 text-lg font-mono font-medium">
       
        { 
        (userdata_global?.data?.role !='Recruiter') ?
          <>
          <li>
            <Link to="/Home" className="hover:text-blue-500">Home</Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-blue-500">Jobs</Link>
          </li>
          <li>
            <Link to="/aboutme" className="hover:text-blue-500">About</Link>
          </li>
         
          </>
          :
          <>
          <li>
            <Link to="/admin/companies" className="hover:text-blue-500">Companies</Link>
          </li>
          <li>
            <Link to="/admin/AdminJobs" className="hover:text-blue-500">Jobs</Link>
          </li>
          </>
                     }
         

          
           { !userdata_global.data ? (
              <div className="flex items-center gap-4">
                <Link to="/Login">
                  <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 rounded-lg text-sm px-4 py-2.5 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Login
                  </button>
                </Link>
                <Link to="/SignUp">
                  <button
                    type="button"
                    className="text-white bg-purple-700 rounded-lg text-sm px-4 py-2.5 shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <UserProfile name={fullName} description={Bio} role={userdata_global?.data?.role||"Student"} />
            )
          }
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
