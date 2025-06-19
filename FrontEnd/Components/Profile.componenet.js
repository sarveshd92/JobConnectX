import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setuserdata_global } from "../Utils/Store/userslice";
import { toast } from "react-toastify";
import axios from "axios";
import AppliedJobsNavbar from "./AppliedJobs_navbar.component.js";
import { addapplication } from "../Utils/Store/applicationSlice.js";
import { localhost } from "../Utils/constant.js";
// import { updateProfile } from "./profileSlice"; // Replace with your actual action

const Profile = () => {
    const fileinputref=useRef("");
    const skills1 = ["html", "css", "js"];
    const data = [
        { company: "ABC Corp", role: "Software Engineer", status: "Applied" },
        { company: "XYZ Inc", role: "Frontend Developer", status: "Interviewed" },
        { company: "Tech Solutions", role: "Backend Developer", status: "Rejected" },
    ];
    const { userdata_global } = useSelector((store) => store.userslice);
    const[applidata,setapplidata]=useState([])
    const dispatch = useDispatch();
    const[uploadfile, setuploadfile]=useState({})
    // State for popup and form data
    const [popup, setPopup] = useState(false);
    const [formData, setFormData] = useState({
        fullname: userdata_global?.data?.fullname || "",
        bio: userdata_global?.data?.Profile?.bio || "",
        email: userdata_global?.data?.email || "",
        phoneno: userdata_global?.data?.phoneno || "",
       resumeUpload:userdata_global?.data?.Profile.resume||"", 
       skills:userdata_global?.data?.Profile?.skills||"",
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };





    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("going this data to backend",formData)
            fetchdata();
        setPopup(false); // Close popup after submission
    };

    // console.log("profile compoentent->",userdata_global)
    const fetchdata=async()=>{

             try {
                 const data=await axios.post( localhost +"/api/v1/user/profile/update",formData,{
                   headers:{
                       "Content-Type":"multipart/form-data",},
                       withCredentials:true,
                   },)
                 
             
                 if(data?.data?.success){
                    toast.success(data?.data?.message);
                    dispatch(setuserdata_global(data.data))
                 }
             } catch (error) {
                // console.log(error?.response)
                toast.error(`${error.message}`);
                
             }
             
    }




// Avoid Separate State: Agar tu file ko uploadfile mein set kar raha hai aur uske baad formData mein,
//  toh state update ka delay issue aayega. Isliye, directly formData mein set kar dena best practice hai.
// Spelling Mistakes: FormData ki jagah formData use kar, aur uloadfile ki jagah uploadfile use kar.
const handleinputfile = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Update the uploadfile state first
        setuploadfile(file);
        
        // Then update formData after the uploadfile state is updated
        setFormData((prevFormData) => ({
            ...prevFormData,
            resumeUpload: file,
        }));

        // console.log(formData)
    } else {
        setFormData({ ...formData, resumeUpload: userdata_global?.Profile?.resume });
    }
};
    const fetchjobdata=async()=>{

        try {
            const data=await axios.get("http://localhost:7777/api/v1/application/appliedjobs",{
                withCredentials:true
            });
            // console.log("jobdata",data)
            setapplidata(data?.data?.result)
        
        } catch (error) {
            
        }
    }
    
     useEffect(()=>{
            fetchjobdata()
     },[setapplidata])
    
    return (
        <div className="flex flex-col mx-auto my-auto w-4/5">
            <div className="flex h-[70%] w-[70%] my-auto p-5 mx-auto shadow-lg rounded-lg">
                <div className="w-[95%]">
                    <div className="flex gap-5 mt-4">
                        <div>
                            <img
                                className="w-20 h-16 rounded-lg shadow-md"
                                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                                alt="Company Logo"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-lg font-bold">{userdata_global?.data?.fullname || "Guest"}</div>
                            <div className="text-gray-500">{userdata_global?.data?.Profile?.bio || "Description"}</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <polyline points="3 7 12 13 21 7" />
                            </svg>
                            <a href="mailto:dummy@gmail.com" className="ml-2 font-medium hover:underline text-sm">{userdata_global?.data?.email}</a>
                        </div>
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href="tel:1234567890" className="ml-2 font-medium hover:underline text-sm">{userdata_global?.data?.phoneno}</a>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h1 className="font-medium">Skills</h1>
                        <div className="flex flex-wrap mt-2">
                            {
                            userdata_global?.data?.Profile?.skills.map((sk, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
                                    {sk}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-[100%] items-center ">
                        <div>
                        <h1 className="font-medium">Resume</h1>
                        <h1 className="font-normal">
                            <a href={`${userdata_global?.data?.Profile?.resume || "#"}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {`${userdata_global?.data?.fullname || "Resume"}`}
                            </a>
                        </h1>
                        </div>
                        <div className="h-[70%] w-15  flex gap-2  ">
                       
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-7  w-[50%] " ><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>
                        </div>
                    </div>
                </div>
                <div className="w-[5%] max-h-6">
                    <button onClick={() => setPopup(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                        </svg>
                    </button>
                </div>
            </div>

            {popup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto w-full h-3/4 overflow-y-auto scrollable-popup font-mono">
                        <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>
                        <form onSubmit={handleSubmit}>


                      
                            <div className="mb-4 ">
                                <label className="block text-sm font-medium mb-1" htmlFor="fullname">Full Name</label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="phoneno">Phone Number</label>
                                <input
                                    id="phoneno"
                                    name="phoneno"
                                    type="tel"
                                    value={formData.phoneno}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4 ">
                                <label className="block text-sm font-medium mb-1" htmlFor="skills">Skills <span className="text-gray-600">{`(separate your skils by ",")`}</span></label>
                                <input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </div>
                           
                          
                            <div className="flex justify-between h-[10%] ">
                           <div>
                            
<label class="block mb-2 text-sm font-normal text-gray-900 dark:text-white" for="file_input">Upload file</label>
<input class="block w-full text-sm px-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="resumeUpload" name="resumeUpload" type="file" onChange={handleinputfile}/>
<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help"></p>

                           </div>
                        
                            
                                <div className="flex  w-[50%] gap-2 justify-end">
                                    <button
                                    type="button"
                                    onClick={() => setPopup(false)}
                                    className="bg-gray-300 text-gray-800 h-10 py-2 px-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white h-10 py-2 px-2 rounded"
                                >
                                    Save
                                </button></div>
                              
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* <div className="overflow-x-auto h-[70%] w-[70%] mx-auto my-3 p-5 rounded-lg bg-white">
                <h1 className="font-bold text-xl py-2">Applied Jobs</h1>
                <table className="w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr className="text-gray-600 text-left">
                            <th className="py-2 px-4 border-b">Company</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((job, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{job.company}</td>
                                <td className="py-2 px-4 border-b">{job.role}</td>
                                <td className="py-2 px-4 border-b">{job.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}


<AppliedJobsNavbar applications={applidata}/>
            
        </div>
    );
};

export default Profile;
