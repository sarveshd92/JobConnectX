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

  const navigate = useNavigate();
  const { userdata_global } = useSelector((store) => store.userslice);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${localhost}/api/v1/company/get/company`, {
          withCredentials: true,
        });
        setCompanies(response?.data?.result || []);
      } catch (err) {
        toast.error("Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !requirement.trim() ||
      !salary ||
      !location.trim() ||
      !jobType ||
      !experience.trim() ||
      !noOfPosition ||
      !company
    ) {
      toast.error("Please fill in all the fields properly.");
      return;
    }

    try {
      if (userdata_global?.data?.role !== 'Recruiter') {
        toast.error("You don’t have permission to access this feature.");
        return navigate('/');
      }

      const response = await axios.post(
        `${localhost}/api/v1/job/register`,
        {
          title,
          description,
          requirement,
          salary,
          location,
          jobType,
          experience,
          noofposition: noOfPosition,
          company,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(response?.data?.message || "Job created successfully.");
      navigate('/admin/adminjobs');
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong while creating the job.");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading companies...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">Create a New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <FormField label="Title" value={title} onChange={setTitle} />
          <FormTextarea label="Description" value={description} onChange={setDescription} />
          <FormField label="Requirement" value={requirement} onChange={setRequirement} />
          <FormField label="Salary" type="number" value={salary} onChange={setSalary} />
          <FormField label="Location" value={location} onChange={setLocation} />

          <SelectField
            label="Job Type"
            value={jobType}
            onChange={setJobType}
            options={['Full Time', 'Part Time', 'Internship']}
          />

          <FormField label="Experience" value={experience} onChange={setExperience} />
          <FormField label="Number of Positions" type="number" value={noOfPosition} onChange={setNoOfPosition} />

          <SelectField
            label="Company"
            value={company}
            onChange={setCompany}
            options={companies.map((comp) => ({ label: comp.name, value: comp._id }))}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

const FormField = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>
);

const FormTextarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
      rows={4}
      required
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) =>
        typeof opt === 'string' ? (
          <option key={idx} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
  </div>
);

export default Createjobpage;
