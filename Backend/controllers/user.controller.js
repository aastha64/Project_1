import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    try{
        const {FullName, Email, PhoneNumber, Password, Role} = req.body;
        if(!FullName || !Email || !PhoneNumber || !Password || !Role){
            return res.status(400).json({
               message:"Something is missing",
               sucess:false 
            });
        };

        let user = await User.findOne({Email});
        if(user){
            return res.status(400).json({
                message:'User already exists with this email.',
                sucees:false,
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        await User.create({
            FullName,
            Email,
            PhoneNumber,
            Password:hashedPassword,
            Role,
        });
        return res.status(201).json({
            message:"Account created successfully.",
            success:true,
        });

    } catch(error){
        console.log(error);   
    }
}
export const login = async (req, res) => {
    try {
        const { Email, Password, Role } = req.body;

        // Check if any required field is missing
        if (!Email || !Password || !Role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // Find the user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect Email or Password",
                success: false,
            });
        }

        // Compare the passwords
        const isPasswordMatch = await bcrypt.compare(Password, user.Password);  // `user.Password`, not `User.Password`
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect Email or Password",
                success: false,
            });
        }

        // Check if the role matches
        if (Role !== user.Role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        // Create JWT token
        const tokenData = {
            userID: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Define the response object for the user
        const userResponse = {
            _id: user._id,
            FullName: user.FullName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            Role: user.Role,
            profile: user.profile,
        };

        // Send response with token
        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.FullName}`,
                user: userResponse,
                success: true,
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token", "",{maxAge:0}).json({
            message:"Logged out successfully",
            succes:true
        })
    }
    catch(error){
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { FullName, Email, PhoneNumber, Bio, Skills } = req.body;
        const file = req.file;

        let SkillsArray;
        if (Skills) {
            SkillsArray = Skills.split(",");
        }

        const userID = req.id; // Middleware authentication (user ID from token)
        console.log("User ID:", userID);
        let user = await User.findById(userID); // Corrected function name

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Update user information
        if (FullName) user.FullName = FullName;
        if (Email) user.Email = Email;
        if (PhoneNumber) user.PhoneNumber = PhoneNumber;
        if (Bio) user.Bio = Bio;
        if (Skills) user.Skills = SkillsArray;

        // Save the updated user to the database
        await user.save();

        // Define the updated user object to send back in the response
        const updatedUser = {
            _id: user._id,
            FullName: user.FullName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            Role: user.Role,
            profile: user.Profile,
        };

        // Send a success response with the updated user data
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true,
        });

    } catch (error) { // This should now work properly
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};
