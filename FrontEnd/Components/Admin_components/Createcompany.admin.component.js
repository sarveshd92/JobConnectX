import { useNavigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setcompany } from "../../Utils/Store/companySlice";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { localhost } from "../../Utils/constant";

const Createcompany=()=>{
    const navigate=useNavigate();

    const dispatch =useDispatch();
    const{company}=useSelector((store)=>store.companySlice)
 const [compName,setcompName]=useState()
 const handlechange=(e)=>{
    setcompName(e.target.value)
    console.log(e.target.value)
}
    const handleclick=async()=>{

       try {
         const result=await axios.post( localhost + "/api/v1/company/register",{compName},{ withCredentials:true,
             Headers:{
                 "Content-Type":"application/json",
             }}
         )
         if(result){
             toast.success("Company created Succesfully")
         dispatch(setcompany({...company,company:compName}))
         console.log(result?.data?.result?._id)
         navigate(`/admin/create/companydetails/${result?.data?.result?._id}`)
         
         }
       
             console.log(company)
       } catch (error) {
        console.log(error)
       }
    }

  


return(
    <div className="w-4/6  mx-auto  mt-4 p-4">
        <div className="">
            <span className="font-medium text-2xl">Your Company Name </span>
            <p className="text-gray-400">what would you like to do here please write here also...</p>
        </div>
      <div className="mt-4 flex flex-col gap-2 ">
        <h1 className="text-lg font-medium">Company Name</h1>
        <input  className="text-gray-800 border-2 rounded-lg ps-4 p-2 border-black mr-2" type="text" required    onChange={(e)=>{handlechange(e)}}></input>
        <div className="mt-4">
        <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Cancel</button>
        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"  onClick={(e)=>{handleclick(e)}}>Continue</button>
      </div>
      </div>
    </div>
)
}
export default Createcompany;