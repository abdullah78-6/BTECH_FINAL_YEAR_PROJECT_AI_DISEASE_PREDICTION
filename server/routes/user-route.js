import express from "express"
import { getProfile, Googlelogin, login, Logout, register } from "../controllers/auth.js";
const Authrouter=express.Router();
Authrouter.post("/signup",register);
Authrouter.post("/signin",login);
Authrouter.post("/logout",Logout);
Authrouter.get("/getprofile",getProfile);
Authrouter.post("/google_signin",Googlelogin);
export default Authrouter;
