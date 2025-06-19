import { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '../Utils/constant';

const Usealljobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${localhost}/api/v1/job/getalljobs`, {
                    withCredentials: true,
                });
                setJobs(result.data.result); // Adjust based on your API response
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { jobs, loading, error };
};

export default Usealljobs;
