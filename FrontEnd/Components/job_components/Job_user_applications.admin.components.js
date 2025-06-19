import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { localhost } from "../../Utils/constant";

const JobUserApplications = () => {
    const [companies, setCompanies] = useState([]);
    const { jobid } = useParams();
    const navigate=useNavigate();
    const fetchData = async () => {
        try {
            const response = await axios.get(`${localhost}/api/v1/job/getjobbyid/${jobid}`, {
                withCredentials: true,
            });
            setCompanies(response.data.result || []);
           
            
        } catch (error) {
            console.log("Error fetching companies:", error);
        }
    };

    const handleClick = async (status, appid, userid) => {
        try {
       
            const response = await axios.put(
                `${localhost}/api/v1/application/updatestatus/${appid}`,
                { status, userid },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Update the local state to reflect the status change
            setCompanies((prevCompanies) => {
                const updatedApplications = prevCompanies.application.map((application) =>
                    application._id === appid
                        ? { ...application, status }
                        : application
                );
                return { ...prevCompanies, application: updatedApplications };
            });

      
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
const handleChat=(userid)=>{

     navigate(`/chat/${userid}`)
}
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="mt-4 p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Applicants ({companies?.application?.length || "0"})
            </h1>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
                <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chat</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {!companies?.application?.length ? (
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {"No applications for this job"} 
                                </td>
                            </tr>
                        ) : (
                            companies.application.map((application, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {application?.applicant?.fullname || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {application?.applicant?.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {application?.applicant?.phoneno || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                        <a
                                            href={application?.applicant?.Profile?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {application?.applicant?.Profile?.resume
                                                ? `${application.applicant.fullname}_Pdf`
                                                : "Resume Not Uploaded"}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {application?.applicant?.createdAt?.substr(0, 10) || "N/A"}
                                    </td>
                                    <td className="p-2">
                                        {application.status === "Pending" ? (
                                            <>
                                                <button
                                                    className="m-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-2 focus:outline-none"
                                                    onClick={() =>
                                                        handleClick("Selected", application._id, application?.applicant?._id)
                                                    }
                                                >
                                                    Selected
                                                </button>

                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 focus:outline-none"
                                                    onClick={() =>
                                                        handleClick("Rejected", application._id, application?.applicant?._id)
                                                    }
                                                >
                                                    Rejected
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className={`m-2 bg-gray-800 text-white rounded-lg p-2 focus:outline-none cursor-not-allowed opacity-50`}
                                                disabled
                                            >
                                                {application.status}
                                            </button>
                                        )}
                                    </td>
                                    <td> <button
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 focus:outline-none text-right"
                                                    onClick={() =>
                                                        handleChat( application?.applicant?._id)
                                                    }
                                                >💬 
                                                    
                                                </button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobUserApplications;
