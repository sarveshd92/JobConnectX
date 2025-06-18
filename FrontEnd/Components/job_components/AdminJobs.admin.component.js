import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Usealljobs from '../../Hooks/Usealljobs.hook.js';
import axios from 'axios';
import { localhost } from '../../Utils/constant.js';

const AdminJobs = () => {
    const { jobs, loading, error } = Usealljobs();
    const [editVisible, setEditVisible] = useState(null);
    const [search, setSearch] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(jobs);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredJobs(jobs);
    }, [jobs]);

    const handleClick = () => {
        navigate("/admin/create/newjob");
    };

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post( localhost +"/api/v1/job/searchjob", { keyword: search }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setFilteredJobs(response?.data?.result || []);
        } catch (error) {
            console.error("Error fetching filtered jobs:", error);
        }
    };

    const handleClickDelete = async (jobid) => {
        try {
            const response = await axios.get(`http://localhost:7777/api/v1/job/deletebyjobid/${jobid}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response?.data?.success) {
                navigate("/admin/adminjobs");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleViewApplicants = (jobid) => {
        navigate(`/admin/applicants/${jobid}`);
    };

    const handleButtonClick = (index) => {
        setEditVisible(editVisible === index ? null : index);
    };

    if (loading) {
        return <div className="p-4 text-center">Loading data...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error loading data: {error.message}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="w-full md:w-3/4 flex items-center">
                    <form className="flex items-center w-full">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input
                                type="search"
                                id="search"
                                className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search by Title or Description"
                                onChange={handleChange}
                                value={search}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-2 md:mt-0">
                    <button
                        type="button"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        onClick={handleClick}
                    >
                        Post Job
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredJobs.map((company, index) => (
                            <tr key={company?._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company?.company?.name || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                    <a href={company.website} target="_blank" rel="noopener noreferrer">{company.title || "N/A"}</a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company?.createdAt?.substr(0, 10) || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center relative">
                                    <button
                                        onClick={() => handleButtonClick(index)}
                                        className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-2 focus:outline-none"
                                    >
                                        <b>•••</b>
                                    </button>
                                    {editVisible === index && (
                                        <div
                                            className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg"
                                        >
                                            <div className="py-1">
                                                <span
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleClickDelete(company?._id)}
                                                >
                                                    Delete
                                                </span>
                                                <span
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleViewApplicants(company?._id)}
                                                >
                                                    Applicants Applied
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJobs;
