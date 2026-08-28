import express from "express"
import cors from "cors"
import "dotenv/config"
import { Connectiondb } from "./utils/db.js";
import Authrouter from "./routes/user-route.js";
import cookieParser from "cookie-parser";
const app=express();
Connectiondb()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.get("/",(req,res)=>{
    res.json({status:true,message:"SERVER IS ALL SET TO GO"});
})
app.use("/api/auth",Authrouter);
const port=process.env.PORT||9000
app.listen(port,()=>{
    console.log(`server is listing on http://localhost:${port}`);
})
