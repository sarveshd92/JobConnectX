import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { localhost } from "../../Utils/constant";
import { toast } from "react-toastify";

const JobUserApplications = () => {
  const [jobData, setJobData] = useState(null);
  const { jobid } = useParams();
  const navigate = useNavigate();

  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${localhost}/api/v1/job/getjobbyid/${jobid}`, {
        withCredentials: true,
      });
      setJobData(response.data.result || null);
    } catch (error) {
        
      toast.error('No job details found for this ID. ');
      navigate('/admin/adminjobs')
    }
  };

 
  const handleStatusUpdate = async (status, appid, userid) => {
    try {
      await axios.put(
        `${localhost}/api/v1/application/updatestatus/${appid}`,
        { status, userid },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh local state
      setJobData((prev) => {
        const updatedApps = prev.application.map((app) =>
          app._id === appid ? { ...app, status } : app
        );
        return { ...prev, application: updatedApps };
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChat = (userid) => {
    navigate(`/chat/${userid}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-4 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Applicants ({jobData?.application?.length || 0})
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Full Name", "Email", "Contact", "Resume", "Date", "Actions", "Chat"].map((th, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {!jobData?.application?.length ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No applications for this job.
                </td>
              </tr>
            ) : (
              jobData.application.map((app, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app?.applicant?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">{app?.applicant?.email || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">{app?.applicant?.phoneno || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-blue-500">
                    {app?.applicant?.Profile?.resume ? (
                      <a
                        href={app.applicant.Profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {app.applicant.fullname}_Resume
                      </a>
                    ) : (
                      "Resume Not Uploaded"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {app?.createdAt?.substr(0, 10) || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {app.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                          onClick={() => handleStatusUpdate("Selected", app._id, app.applicant._id)}
                        >
                          Select
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                          onClick={() => handleStatusUpdate("Rejected", app._id, app.applicant._id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">{app.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleChat(app.applicant._id)}
                    >
                      💬 Chat
                    </button>
                  </td>
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
