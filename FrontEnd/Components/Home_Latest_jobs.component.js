import { useSelector } from "react-redux";
import Home_Latest_Job_Card from "./Home_Latest_Job_Card.component.js";

const Home_Latest_jobs = () => {
  const { getalljobs } = useSelector((store) => store.jobSlice);

  return (
    <div className="w-full mt-2 flex flex-col">
      <div className="ml-6">
        <h1 className="text-4xl font-bold">
          <span className="text-[#6a38c2]">Latest & Top </span>Job Openings
        </h1>
      </div>

      <div className="flex flex-wrap mt-3 w-full justify-evenly">
        {getalljobs?.result && getalljobs.result.length > 0 ? (
          getalljobs.result.slice(0, 6).map((job, idx) => (
            <Home_Latest_Job_Card key={job._id || idx} data={job} />
          ))
        ) : (
          Array(6)
            .fill(null)
            .map((_, idx) => <Home_Latest_Job_Card key={idx} />)
        )}
      </div>
    </div>
  );
};

export default Home_Latest_jobs;
