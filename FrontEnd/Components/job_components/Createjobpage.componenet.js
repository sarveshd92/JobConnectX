import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { localhost } from '../../Utils/constant';

const Createjobpage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirement, setRequirement] = useState('');
    const [salary, setSalary] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [experience, setExperience] = useState('');
    const [noOfPosition, setNoOfPosition] = useState('');
    const [company, setCompany] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const{userdata_global} =useSelector((store)=>store.userslice)
    console.log(userdata_global)
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(  localhost + '/api/v1/company/get/company', {
                    withCredentials: true,
                });
                setCompanies(response?.data?.result);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(userdata_global?.data?.role==='Recruiter'){
        const data = await axios.post(`${localhost}/api/v1/job/register`, {
                title,
                description,
                requirement,
                salary,
                location,
                jobType,
                experience,
                noofposition: noOfPosition,
                company
            },{withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            });
            toast.success(data?.message)
            navigate('/admin/adminjobs');
        }
        else{
            toast.error("you dont have permission to use this api")
            navigate('/')
        }
        } catch (err) {
            setError(err);
        }
    };

    if (loading) {
        return <div>Loading companies...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-3xl form-container bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">Create a New Job</h2>
                <form onSubmit={handleSubmit} className="space-y-6 p-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1  p-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="requirement" className="block text-sm font-medium text-gray-700">Requirement</label>
                        <input
                            type="text"
                            id="requirement"
                            value={requirement}
                            onChange={(e) => setRequirement(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                        <input
                            type="number"
                            id="salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="mt-1  p-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select
                            id="jobType"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Job Type</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            {/* <option value="Contract">Contract</option> */}
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                        <input
                            type="text"
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="noOfPosition" className="block text-sm font-medium text-gray-700">Number of Positions</label>
                        <input
                            type="number"
                            id="noOfPosition"
                            value={noOfPosition}
                            onChange={(e) => setNoOfPosition(e.target.value)}
                            className="mt-1 block w-full p-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 p-2">Company</label>
                        <select
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 overflow-y-auto"
                            required
                        >
                            <option value="">Select Company</option>
                            {companies.map((comp) => (
                                <option key={comp?._id} value={comp?._id}>{comp?.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                        Create Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Createjobpage;
