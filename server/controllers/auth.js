import usermodel from "../models/usermodel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
const createtoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});

}
const register=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const exist=await usermodel.findOne({email});
        if(exist){
            return res.json({status:false,result:"USER IS ALREADY EXIST "});
        }
        if(!validator.isEmail(email)){
            return res.json({status:false,result:"PLEASE ENTER A VALID EMAIL "});
        }
        if(password.length<8){
            return res.json({status:false,result:"PLEASE ENTER A STRONG PASSWORD "});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);
        const newuser=new usermodel({
            name:name,
            email:email,
            password:hashedpassword
        })
        const user=await newuser.save();
        const token=createtoken(user._id);
        return res.json({status:true,result:"USER REGISTER SUCCESSFULLY"});


        
    } catch (error) {
        console.log(error);
        return res.json({status:false,result:"SIGN-UP ERROR"});
        
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await usermodel.findOne({email});
        if(!user){
            return res.json({status:false,result:"USER DOES NOT EXIST "});
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.json({status:false,result:"PASSWORD IS INCORRECT"});
        }
        const token=createtoken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",//strict for local server
            maxAge:24*60*60*1000
        })

        return res.json({status:true,email:email,result:"LOGIN SUCCESSFULLY"});
        
    } catch (error) {
        console.log("ERROR");
        return res.json({status:false,result:"LOGIN ERROR"});
        
    }
    

}
const Logout=async(req,res)=>{
    try {
        res.clearCookie("token",{
        httpOnly:true,
        // secure: process.env.NODE_ENV === "production",
        sameSite:"strict"//strict for local server
    });
    return res.json({status:true,message:"Logged Out "})
        
    } catch (error) {
        console.log("logout ",error);
        res.json({status:false,message:"Logout error"});
        
    }
    
    
    

}
const getProfile=async(req,res)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.json({status:false});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await usermodel.findById(decoded.id).select("email");
        if(!user){
            return res.json({status:false});
        }
        res.json({status:true,email:user.email})
    } catch (error) {
        res.json({status:false});
    }

}
const Googlelogin=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await usermodel.findOne({email});
        if(user){
            const token=createtoken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",//strict for local server
            maxAge:24*60*60*1000
        })
        return res.json({status:true,message:"Google Login Success",email:user.email});
        }
        else{
        return res.json({status:false,message:"User Not Found"});
        }
        
        
        
    } catch (error) {
        console.log("Google Login error",error);
        
    }

}
export {register,login,Logout,getProfile,Googlelogin}


