import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { localhost } from "../../Utils/constant";

const Companies = () => {
  const [orgCompanies, setOrgCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editVisible, setEditVisible] = useState(null);
  const navigate = useNavigate();

  const filterData = (searchtext) => {
    if (!searchtext) {
      setCompanies(orgCompanies);
    } else {
      const result = orgCompanies.filter((company) =>
        company.name.toLowerCase().includes(searchtext.toLowerCase())
      );
      setCompanies(result);
    }
  };

  const handleClick = () => {
    navigate("/admin/create/company");
  };

  const handleChange = (e) => {
    filterData(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${localhost}/api/v1/company/usercomp`, {
        withCredentials: true,
      });
      setOrgCompanies(response?.data?.result || []);
      setCompanies(response?.data?.result || []);
    } catch (error) {
      console.log("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pt-[80px] min-h-screen bg-gray-100 px-4">
      {/* Top Bar */}
      <div className="mt-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-3/4">
          <input
            type="search"
            id="search"
            className="w-full p-2 pl-4 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Company"
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={handleClick}
        >
          + New Company
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={company._id}>
                  <td className="px-6 py-4">
                    <img
                      src={company.logo || "/default-logo.png"}
                      onError={(e) => (e.target.src = "/default-logo.png")}
                      alt={`${company.name} logo`}
                      className="h-10 w-10 object-contain rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{company.location}</td>
                  <td className="px-6 py-4 text-sm text-blue-500">
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{company.createdAt?.substr(0, 10)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center relative">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setEditVisible(editVisible === index ? null : index)}
                        className="px-2 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        •••
                      </button>
                      {editVisible === index && (
                        <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                          <Link
                            to={`/admin/create/companydetails/${company._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setEditVisible(null)}
                          >
                            Edit
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;
