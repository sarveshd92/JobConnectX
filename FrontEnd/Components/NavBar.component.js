import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile.component";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // Optional icons

const NavBar = () => {
  const { userdata_global } = useSelector((store) => store.userslice);
  const fullName = userdata_global?.data?.username;
  const Bio = userdata_global?.data?.Profile?.bio;
  const role = userdata_global?.data?.role || "Student";

  const [isOpen, setIsOpen] = useState(false);

  const isRecruiter = role === "Recruiter";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Job<span className="text-red-400">ConnectX</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center font-medium text-gray-700">
            {isRecruiter ? (
              <>
                <Link to="/admin/companies" className="hover:text-blue-600">Companies</Link>
                <Link to="/admin/adminjobs" className="hover:text-blue-600">Jobs</Link>
              </>
            ) : (
              <>
                <Link to="/home" className="hover:text-blue-600">Home</Link>
                <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
                <Link to="/aboutme" className="hover:text-blue-600">About</Link>
              </>
            )}

            {!userdata_global?.data ? (
              <>
                <Link to="/login">
                  <button className="bg-white text-gray-800 border border-gray-300 rounded px-4 py-1 hover:bg-gray-100">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-800">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <UserProfile name={fullName} description={Bio} role={role} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-lg">
          <ul className="flex flex-col space-y-4">
            {isRecruiter ? (
              <>
                <Link to="/admin/companies" onClick={toggleMenu}>Companies</Link>
                <Link to="/admin/adminjobs" onClick={toggleMenu}>Jobs</Link>
              </>
            ) : (
              <>
                <Link to="/home" onClick={toggleMenu}>Home</Link>
                <Link to="/jobs" onClick={toggleMenu}>Jobs</Link>
                <Link to="/aboutme" onClick={toggleMenu}>About</Link>
              </>
            )}

            {!userdata_global?.data ? (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded">Login</button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded">Sign Up</button>
                </Link>
              </>
            ) : (
              <div className="pt-2">
                <UserProfile name={fullName} description={Bio} role={role} />
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
