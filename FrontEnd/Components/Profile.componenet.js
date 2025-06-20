import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setuserdata_global } from "../Utils/Store/userslice";
import { toast } from "react-toastify";
import axios from "axios";
import AppliedJobsNavbar from "./AppliedJobs_navbar.component.js";
import { localhost } from "../Utils/constant.js";

const Profile = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const { userdata_global } = useSelector((store) => store.userslice);
  const [popup, setPopup] = useState(false);
  const [applidata, setApplidata] = useState([]);

  const [formData, setFormData] = useState({
    fullname: userdata_global?.data?.fullname || "",
    bio: userdata_global?.data?.Profile?.bio || "",
    email: userdata_global?.data?.email || "",
    phoneno: userdata_global?.data?.phoneno || "",
    skills: (userdata_global?.data?.Profile?.skills || []).join(", "),
    resumeUpload: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resumeUpload: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.phoneno) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const submitData = new FormData();
    submitData.append("fullname", formData.fullname);
    submitData.append("bio", formData.bio);
    submitData.append("email", formData.email);
    submitData.append("phoneno", formData.phoneno);
    submitData.append("skills", JSON.stringify(formData.skills.split(",").map(skill => skill.trim())));
    if (formData.resumeUpload) {
      submitData.append("resume", formData.resumeUpload);
    }

    try {
      const result = await axios.post(`${localhost}/api/v1/user/profile/update`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (result?.data?.success) {
        toast.success(result.data.message);
        dispatch(setuserdata_global(result.data));
        setPopup(false);
      } else {
        toast.error(result.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const result = await axios.get(`${localhost}/api/v1/application/appliedjobs`, { withCredentials: true });
      setApplidata(result.data.result);
    } catch (err) {
      toast.error("Failed to fetch applied jobs.");
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  return (
    <div className="w-4/5 mx-auto my-10 font-mono">
      {/* Main Card */}
      <div className="flex shadow-md rounded-lg p-6 bg-white">
        <div className="w-full flex justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">{userdata_global?.data?.fullname || "Your Name"}</h2>
            <p className="text-gray-500">{userdata_global?.data?.Profile?.bio || "No bio added."}</p>

            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> {userdata_global?.data?.email}</p>
              <p><strong>Phone:</strong> {userdata_global?.data?.phoneno}</p>
            </div>

            <div>
              <h3 className="font-semibold">Skills:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {(userdata_global?.data?.Profile?.skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-semibold">Resume:</h3>
              {userdata_global?.data?.Profile?.resume ? (
                <a
                  href={userdata_global.data.Profile.resume}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>
          </div>

          <button onClick={() => setPopup(true)} title="Edit Profile">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.83a2 2 0 01-.707.47L7 15l1.7-4.121a2 2 0 01.47-.707z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Popup for Editing */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto h-[80%] scroll-smooth">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="fullname" type="text" value={formData.fullname} onChange={handleChange} placeholder="Full Name" className="input-style" />
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Bio" className="input-style" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-style" />
              <input name="phoneno" type="text" value={formData.phoneno} onChange={handleChange} placeholder="Phone Number" className="input-style" />
              <input name="skills" type="text" value={formData.skills} onChange={handleChange} placeholder='Skills (comma separated)' className="input-style" />
              <input type="file" onChange={handleFileChange} className="input-style p-1" />

              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => setPopup(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applied Jobs */}
      <AppliedJobsNavbar applications={applidata} />
    </div>
  );
};

export default Profile;

