import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addapplication } from "../Utils/Store/applicationSlice";
import { localhost } from "../Utils/constant";

const JobJobcardDetails = () => {
  const dispatch = useDispatch();
  const { jobid } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [status, setStatus] = useState(false);

  // Fetch Job + Status
  const fetchJobData = async () => {
    try {
      const [jobRes, statusRes] = await Promise.all([
        axios.get(`${localhost}/api/v1/job/getjobbyidbyuser/${jobid}`, {
          withCredentials: true,
        }),
        axios.post(
          `${localhost}/api/v1/job/appliedjobstatus`,
          { jobid },
          { withCredentials: true }
        ),
      ]);

      if (statusRes?.data?.result?.application?.length > 0) {
        setStatus(true);
        const apps = await axios.get(`${localhost}/api/v1/application/appliedjobs`, {
          withCredentials: true,
        });
        dispatch(addapplication(apps?.data?.result));
      } else {
        setStatus(false);
      }

      if (jobRes?.data?.success) {
        setJobDetails(jobRes?.data?.result);
      } else {
        toast.error("Job not found");
      }
    } catch (error) {
      toast.error("Session expired. Please log in again.");
    }
  };

  // Apply Handler
  const handleApply = async () => {
    try {
      const result = await axios.post(
        `${localhost}/api/v1/application/applyjob/${jobid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (result.data.success) {
        setStatus(true);
        toast.success("Applied successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Application failed. Please log in.");
    }
  };

  useEffect(() => {
    fetchJobData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      {!jobDetails ? (
        <p className="text-center text-gray-500">Loading job details...</p>
      ) : (
        <>
          {/* Header: Title */}
          <h1 className="text-3xl font-bold mb-4">{jobDetails.title}</h1>

          {/* Company Info */}
          <div className="flex items-center mb-4 gap-3">
            <img
              className="w-10 h-10 rounded border object-contain"
              src={jobDetails?.company?.logo || "https://via.placeholder.com/40"}
              alt="Company Logo"
            />
            <div>
              <h2 className="text-lg font-semibold">{jobDetails?.company?.name}</h2>
              <h3 className="text-gray-600">{jobDetails.location}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4">{jobDetails.description}</p>

          {/* Requirements */}
          <div className="mb-4">
            <h3 className="font-semibold">Requirements:</h3>
            <ul className="list-disc ml-5 text-gray-700 mt-1">
              {jobDetails.requirement.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Job Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <strong>Job Type:</strong> {jobDetails.jobType}
            </div>
            <div>
              <strong>Experience Required:</strong> {jobDetails.experience} years
            </div>
            <div>
              <strong>Salary:</strong> {jobDetails.salary} LPA
            </div>
            <div>
              <strong>Open Positions:</strong> {jobDetails.noofposition}
            </div>
          </div>

          {/* Apply Button */}
          {!status ? (
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Apply Now
            </button>
          ) : (
            <button
              disabled
              className="bg-green-600 text-white px-6 py-2 rounded-md cursor-not-allowed"
            >
              Already Applied
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default JobJobcardDetails;
