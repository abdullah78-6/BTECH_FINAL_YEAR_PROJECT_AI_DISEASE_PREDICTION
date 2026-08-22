import mongoose from "mongoose"
const Connectiondb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB CONNECTION ESTABLISHED SUCCESSFULLY");
        
    } catch (error) {
        console.log("DB CONNECTION ERROR",error);
        
    }
}
export{Connectiondb}