import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../Util/cloudinary.util.js";

export const register = async (req, res) => {
  try {
   

   const { fullname, username, email, password, phoneno, role,} = req.body;
console.log(fullname, username, email, password, phoneno, role, req.file)
    if (!fullname || !username || !email || !password || !phoneno || !role) {
      return res.status(400).json({
        status: 400,
        message: "Please fill all the mandatory fields",
        success: false,
      });
    }

console.log(role)
    const userResult = await User.findOne({ email });
    if (userResult) {
      return res.status(400).json({
        status: 400,
        message: "User with this email already exists",
        success: false,
      });
    }
let resume=req?.file?.path;
    if (!resume) {
      return res.status(400).json({
        status: 400,
        message: "Resume file is missing",
        success: false,
      });
    }

    const resume_upload= resume;
    console.log("Resume path:", resume_upload);

    const result = await uploadOnCloudinary(resume_upload);
    if (!result) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong when uploading to the server",
        success: false,
      });
    }

    console.log("Uploaded resume URL:", result.url);

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      phoneno,
      role,
      Profile: {
        resume: result.url,
      },
    });

    await newUser.save();

    return res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: newUser,
      success: true,
    });
  } catch (error) {
    console.error('Error in register function:', error);
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        status: 400,
        message: "Please provide email, password, and role",
        success: false,
      });
    }

    const loginUser = await User.findOne({ email: email });
    if (!loginUser) {
      return res.status(400).json({
        status: 400,
        message: "No user found with this email",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email or password",
        success: false,
      });
    }

    if (role.toLowerCase() !== loginUser.role.toLowerCase()) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect role provided",
        success: false,
      });
    }

    const tokenData = {
      userid: loginUser._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKENONE, { expiresIn: "10d" });
console.log("creating and implementing token during login ",token)
    return res.status(200).cookie("ref_token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'Strict',
      secure: true,
    }).json({
      status: 200,
      message: "User logged in successfully",
      data: loginUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const reqid = req.id;
    const result = await User.findById(reqid);

    if (!result) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      status: 200,
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const { fullname, email, phoneno, bio, skills } = req.body;
    const resumeUpload = req?.file?.path;  // Get resume file path from the request
    const userId = req.id;
    const profile = await User.findById(userId);

    if (!profile) {
      return res.status(201).json({
        message: "Unable to find user, please login again.",
        success: false
      });
    }

    // Update the profile fields only if they are provided
    profile.fullname = fullname || profile.fullname;
    profile.email = email || profile.email;
    profile.phoneno = phoneno || profile.phoneno;
    profile.Profile.bio = bio || profile.Profile.bio;

    // Handle skills update
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      profile.Profile.skills = skillsArray.length > 0 ? skillsArray : profile.Profile.skills;
    }

    // Handle resume upload only if a file is provided
    if (resumeUpload) {
      const resume_cloudinary = await uploadOnCloudinary(resumeUpload);
      if (!resume_cloudinary) {
        return res.status(400).json({
          message: "Uploading resume failed.",
          success: false
        });
      }
      profile.Profile.resume = resume_cloudinary.url;
    }

    await profile.save({validateBeforeSave:false});

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      data: profile,
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(404).json({
        status: 404,
        message: "No users found",
        success: false,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Users retrieved successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
      success: false,
    });
  }
};



export const userid=async(req,res)=>{

console.log(req)
        const userid=req.id;
        if(userid){
          res.status(200).json({id:userid,success:true,message:"userid fetched successfully"})
        }
        else{
          throw new Error("login again")
        }
}