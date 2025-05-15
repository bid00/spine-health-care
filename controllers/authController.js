import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv';
configDotenv();

const accessTokenSecret = process.env.SECRET ;



//@desc register new user and add to database
//@route POST /api/auth/signup
const register = async (req,res)=>{
    try {
        const {firstName, lastName , email, password }=req.body;

        if (!firstName ||!lastName|| !email ||!password) {
            return res.status(422).json({message: "please fill in all fields"});
        }

        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({message: "Account with same Email exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({firstName,lastName,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message: "User registered Successfully"});

        
    } catch (error) {
        return res.status(500).json({message :"Server Error",error: error.message});
    }
}

//@desc login user
//@route POST /api/auth/login
const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(422).json({message:"Please fill in all the fields"})
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "Email or password is invalid"})   
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (!passwordMatch) {
            return res.status(401).json({message: "Email or password is invalid"})
        }

        const accessToken = await jwt.sign({userId :user._id,iat: Math.floor(Date.now() / 1000)},accessTokenSecret);
        return res.status(200).json({id:user._id,name:user.Name,email:user.email,accessToken})
    } catch (error) {
        return res.status(500).json({message :"Server Error",error: error.message});

    }
}

export {register,login} ;