import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Home_info from "./Home_info.component.js";
import Home_Category_carousel from "./Home_Category_carousel.component.js";
import Home_Latest_jobs from "./Home_Latest_jobs.component.js";
import Home_Footer from "./Home_Footer.component.js";

import { setgetalljobs } from "../Utils/Store/jobSlice.js";
import { localhost } from "../Utils/constant.js";
import {toast} from "react-toastify"
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userdata_global } = useSelector((store) => store.userslice);
  const { getalljobs } = useSelector((store) => store.jobSlice);

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const result = await axios.get(`${localhost}/api/v1/job/getalljobs`, {
        withCredentials: true,
      });

      if (result?.data) {
        dispatch(setgetalljobs(result.data));
        setJobs(result.data?.result || []);
      }
    } catch (error) {
      toast.error('Error fetching jobs:')
      navigate('/home')
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();

    if (userdata_global?.data?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <>
      <Home_info />
      <Home_Category_carousel />
      <Home_Latest_jobs />
      <Home_Footer />
    </>
  );
};

export default Home;
