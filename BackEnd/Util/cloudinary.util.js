import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from 'dotenv';
import { Console } from 'console';

dotenv.config();
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET ,
  });
  
const uploadOnCloudinary = async(filepath)=>{
try {
    
console.log("cloudinary function called ->",filepath);
const isuploaded=await cloudinary.uploader.upload((filepath),{
    resource_type:"auto",
} )
if(isuploaded){
    // console.log(isuploaded);
    fs.unlinkSync(filepath)
    return isuploaded;
}
fs.unlinkSync(filepath)
return null;

} catch (error) {
   console.log("something went wrong on uploading to the server ",error?.message);
fs.unlinkSync(filepath)

   return null;
}

}
  
export {uploadOnCloudinary};