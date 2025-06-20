import { Link } from "react-router-dom";

const Job_jobcard = ({ data }) => {
  const daysAgo = (postedDate) => {
    const diffTime = new Date() - new Date(postedDate);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="h-[360px] w-[300px] border border-gray-200 shadow hover:shadow-md rounded-xl p-4 flex flex-col justify-between transition duration-200 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>{daysAgo(data?.createdAt)}</span>
        <img
          className="h-4 w-4"
          src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
          alt="bookmark"
        />
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          className="w-8 h-8 rounded object-contain border border-gray-300"
          src={data?.company?.logo || "https://via.placeholder.com/40"}
          alt="Company Logo"
        />
        <div>
          <h3 className="text-sm font-semibold truncate w-[200px]">
            {data?.company?.name || "Unknown Company"}
          </h3>
          <p className="text-xs text-gray-500">{data?.location || "India"}</p>
        </div>
      </div>

      {/* Job Title */}
      <h2 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
        {data?.title || "Untitled Position"}
      </h2>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2">
        {data?.description || "No job description available."}
      </p>

      {/* Tags */}
      <div className="flex justify-between mt-3 text-xs font-semibold">
        <span className="bg-gray-100 text-blue-800 px-2 py-0.5 rounded">
          {data?.noofposition || 0} Openings
        </span>
        <span className="bg-gray-100 text-red-500 px-2 py-0.5 rounded">
          {data?.jobType || "N/A"}
        </span>
        <span className="bg-gray-100 text-purple-600 px-2 py-0.5 rounded">
          {data?.salary ? `${data.salary} LPA` : "N/A"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <Link to={`/Details/${data?._id}`}>
          <button className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 font-medium">
            View Details
          </button>
        </Link>
        <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 font-medium">
          Save
        </button>
      </div>
    </div>
  );
};

export default Job_jobcard;
