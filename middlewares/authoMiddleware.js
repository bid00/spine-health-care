import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import User from "../models/userModel.js";
configDotenv();

const SECRET = process.env.SECRET;

//@desc authorize user token 
const autho = async(req,res,next)=>{
    const accessHeader = req.headers.authorization  // bearer uabsdbsadsaudhsdyhasd
    const accessToken = accessHeader && accessHeader.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({message: "Access token not found"});
    }
    try {
        const decodedAccessToken = jwt.verify(accessToken , SECRET);
        const user = await User.findById(decodedAccessToken.userId);
        if (!user) {
            return res.status(401).json({message:"unauthorized"});
        }
       if (user.passwordChangedAt && decodedAccessToken.iat * 1000 < user.passwordChangedAt.getTime()) {
         return res.status(403).json({ message: "Password changed. Token invalid." });
}

        req.user= user;
        next();
    } catch (error) {
        return res.status(403).json({message:"Access token is invalid or expired",error});

        
    }
}

export default autho;