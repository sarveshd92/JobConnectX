import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setloading } from '../../Utils/Store/authslice';
import { localhost } from '../../Utils/constant';

const CreateCompanyDetails = () => {
    const { compid } = useParams();
    const { company } = useSelector((store) => store.companySlice);
    const navigate = useNavigate();
    const [companydetails, setcompanydetails] = useState({
        name: company?.company || "",
        description: company?.description || "",
        website: company?.website || "",
        location: company?.location || "",
        logo: company?.logo || ""
    });

    const handlefile = (e) => {
        setcompanydetails({ ...companydetails, "logo": e.target.files[0] });
    };

    const fetchdata = async () => {
        try {
            const data = await axios.get(`${localhost}/api/v1/company/getcompany/${compid}`);
            setcompanydetails(data?.data?.getcomapany);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchdata();
    }, [setcompanydetails]);

    const handleclick = (e) => {
        const { name, value } = e.target;
        setcompanydetails({ ...companydetails, [name]: value });
    };

    const dispatch = useDispatch();
    const { loading } = useSelector((store) => store.auth);

    const handleupdate = async (e) => {
       
       
        e.preventDefault();
        try {
            dispatch(setloading(true));
            console.log("final ",companydetails.logo)
            const data = await axios.put(
                `${localhost}/api/v1/company/update/details/${compid}`,
                companydetails,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            if (data) {
                toast.success(data?.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setloading(false));
        }
    };

    return (
        <div className="flex justify-center items-center p-4" style={{ width: 'auto', maxWidth: '100%' }}>
            <div className="w-full">
                <form onSubmit={handleupdate} className="space-y-6 p-4 rounded-lg">
                    <h1 className="text-2xl font-medium mb-6 text-center">Company Setup</h1>
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center w-1/2 pr-2">
                                <label className="w-1/3">Name</label>
                                <input value={companydetails?.name} name="name" className="border-2 ml-2 border-black px-2 py-1 rounded-lg w-full" type="text" required onChange={handleclick} />
                            </div>
                            <div className="flex items-center w-1/2 pl-2">
                                <label className="w-1/3">Description</label>
                                <input value={companydetails?.description} className="border-2 border-black ml-2 px-2 py-1 rounded-lg w-full" type="text" required name="description" onChange={handleclick} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center w-1/2 pr-2">
                                <label className="w-1/3">Location</label>
                                <input value={companydetails?.location} className="border-2 ml-2 border-black px-2 py-1 rounded-lg w-full" type="text" required name="location" onChange={handleclick} />
                            </div>
                            <div className="flex items-center w-1/2 pl-2">
                                <label className="w-1/3">Website</label>
                                <input value={companydetails?.website} className="border-2 ml-2 border-black px-2 py-1 rounded-lg w-full" type="text" required name="website" onChange={handleclick} />
                            </div>
                        </div>
                        <div className="flex justify-start items-center w-full mt-6">
                            <label className="w-1/4 text-sm font-medium text-gray-900" htmlFor="file_input">Logo</label>
                            <div className="flex items-center w-full">
                                {companydetails?.logo && typeof companydetails.logo === "string" ? (
                                    <div className="flex items-center">
                                        <img src={companydetails.logo} alt="Company Logo" className="w-10 h-10 object-contain rounded-lg mr-4" />
                                        <label className="cursor-pointer bg-gray-800 text-white py-1 px-3 rounded-lg">
                                            Update Logo
                                            <input
                                                className="hidden"
                                                id="file_input"
                                                type="file"
                                                name="logo"
                                                onChange={handlefile}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <input
                                        className="border-2 ml-2 border-black px-2 py-1 rounded-lg w-full cursor-pointer bg-gray-50"
                                        id="file_input"
                                        type="file"
                                        name="logo"
                                        onChange={handlefile}
                                        required
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        {loading ? (
                            <button disabled type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
                                Loading...
                            </button>
                        ) : (
                            <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5">
                                Update
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompanyDetails;
