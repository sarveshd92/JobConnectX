import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { localhost } from "../Utils/constant.js";
import Job_jobcard from "./Job_jobcard.component.js";

const Jobs = () => {
  const [getalljob, setgetalljob] = useState([]);
  const alljobref = useRef([]);

  const metroCities = ["ALL", "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad"];
  const industries = ["ALL", "Backend Engineer", "Frontend Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer"];
  const salaryRanges = ["ALL", "0-5 LPA", "5-10 LPA", "10-15 LPA", "15-20 LPA", "20+ LPA"];

  const [filters, setFilters] = useState({
    city: "ALL",
    role: "ALL",
    salary: "ALL",
  });

  const updateFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const fetchdata = async () => {
    try {
      const result = await axios.get(`${localhost}/api/v1/job/getalljobs`, {
        withCredentials: true,
      });
      const jobs = result?.data?.result || [];
      alljobref.current = jobs;
      setgetalljob(jobs);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    let filtered = [...alljobref.current];

    if (filters.city !== "ALL") {
      filtered = filtered.filter(
        (job) => job.location?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    if (filters.role !== "ALL") {
      const keyword = filters.role.toLowerCase().split(" ")[0];
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(keyword)
      );
    }

    if (filters.salary !== "ALL") {
      if (filters.salary === "20+ LPA") {
        filtered = filtered.filter((job) => job.salary >= 20);
      } else {
        const [min, max] = filters.salary.replace(" LPA", "").split("-").map(Number);
        filtered = filtered.filter((job) => job.salary >= min && job.salary <= max);
      }
    }

    setgetalljob(filtered);
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row w-full pt-[80px] min-h-screen bg-gray-100">
      {/* Filter Section */}
      <div className="w-full md:w-1/5 px-4 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
        <h2 className="font-bold text-lg mt-4 mb-3">Filters</h2>

        <div className="mb-5">
          <h3 className="font-semibold mb-2">Cities</h3>
          {metroCities.map((city, idx) => (
            <label key={idx} className="block text-sm mb-1">
              <input
                type="radio"
                name="city"
                value={city}
                checked={filters.city === city}
                onChange={() => updateFilter("city", city)}
                className="mr-2"
              />
              {city}
            </label>
          ))}
        </div>

        <div className="mb-5">
          <h3 className="font-semibold mb-2">Industries</h3>
          {industries.map((role, idx) => (
            <label key={idx} className="block text-sm mb-1">
              <input
                type="radio"
                name="role"
                value={role}
                checked={filters.role === role}
                onChange={() => updateFilter("role", role)}
                className="mr-2"
              />
              {role}
            </label>
          ))}
        </div>

        <div className="mb-5">
          <h3 className="font-semibold mb-2">Salary Range</h3>
          {salaryRanges.map((sal, idx) => (
            <label key={idx} className="block text-sm mb-1">
              <input
                type="radio"
                name="salary"
                value={sal}
                checked={filters.salary === sal}
                onChange={() => updateFilter("salary", sal)}
                className="mr-2"
              />
              {sal}
            </label>
          ))}
        </div>
      </div>

      {/* Job Cards Section */}
      <div className="w-full md:w-4/5 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getalljob.length > 0 ? (
          getalljob.map((jb) => <Job_jobcard key={jb._id} data={jb} />)
        ) : (
          <p className="col-span-full text-gray-500 text-center">
            No jobs found matching filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
