import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//@desc Get current user data
//@route GET /api/user/getprofile
const getProfile = async(req,res)=>{
    try {
        const user= req.user;
        return res.status(200).json({
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            picture:`${req.protocol}://${req.get("host")}${user.picture}`

        })
    } catch (error) {

    return res.status(500).json({message :"Server Error",error: error.message});
        
    }
}

//@desc update user profile
//@route PATCH /api/user/updateprofile
const updateProfile = async(req,res)=>{
    try {
        const userId = req.user._id;
        const picture = req.file ? `/uploads/user/${req.file.filename}` : req.user.picture;
        if (req.body.email) {
            const existingUser = await User.findOne({email:req.body.email});
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({message:"Email already in use in another account"});
            }
        }
        await User.findByIdAndUpdate(userId,{
            $set:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                picture                
            },
        },{new:true});
        return res.status(200).json({message:"Profile updated successfuly"})

        
    } catch (error) {
        return res.status(500).json({mmessage :"Server Error",error: error.message});
        
    }
   

}

//@desc Change password for user
//@route PATCH /api/user/changepassword
const changePassword = async (req,res)=>{
    try {
        const user = req.user;
        const {oldPassword,newPassword}=req.body;
        if (!oldPassword || !newPassword) {
            return res.status(422).json({message:"Please fill in all fields"})
        }
        const PasswordHashed = await bcrypt.hash(newPassword,10);
        const passwordMatch = await bcrypt.compare(oldPassword,user.password);
        if (passwordMatch) {
               user.password = PasswordHashed;
               user.passwordChangedAt = new Date();
               await user.save();
               return res.status(200).json({message:"Password updated successfuly"});
        }
        return res.status(422).json({message:"old password isn't true"})
        
       
        
    } catch (error) {
        return res.status(500).json({message :"Server Error",error: error.message})
    }
}

//@desc Delete account handler
//@route /api/user/deleteaccount
const deleteAccount = async (req,res)=>{
   try {
        const password = req.body.password;
        const user = req.user
        if (!password) {
            return res.status(400).json({message:"please enter your password"});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (passwordMatch){
            await user.deleteOne();
            return res.status(200).json({message:"account deleted"});
        }
        return res.status(403).json({message:"Password is incorrect"});
   } catch (error) {
    return res.status(500).json({message :"Server Error",error: error.message});
   }
}
export {getProfile,updateProfile,changePassword,deleteAccount};