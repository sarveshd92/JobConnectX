import { useNavigate } from "react-router-dom";

const Home_Latest_Job_Card = ({ data }) => {
  const navigate = useNavigate();

  if (!data) {
    // Loading Placeholder
    return (
      <div className="h-56 w-80 m-4 p-4 border rounded-lg shadow animate-pulse bg-gray-100"></div>
    );
  }

  const handleClick = () => {
    navigate(`/Details/${data?._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="h-56 w-80 shadow-lg border border-gray-200 rounded-lg p-4 m-4 flex flex-col justify-between transition-transform transform hover:scale-105 cursor-pointer"
    >
      <div>
        <div className="text-xl font-semibold text-gray-800">{data?.company?.name}</div>
        <div className="text-sm text-gray-500 mb-1">India</div>
        <div className="text-lg font-bold text-gray-700 mb-1">{data?.title}</div>
        <div
          className="text-sm text-gray-600 overflow-hidden overflow-ellipsis"
          style={{ maxHeight: "3.2rem" }}
        >
          {data?.description?.length > 70
            ? `${data?.description.slice(0, 70)}...`
            : data?.description}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded">
          {data.noofposition} Positions
        </span>
        <span className="bg-red-100 text-red-600 font-semibold px-2 py-1 rounded">
          {data.jobType}
        </span>
        <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">
          {data.salary} LPA
        </span>
      </div>
    </div>
  );
};

export default Home_Latest_Job_Card;
