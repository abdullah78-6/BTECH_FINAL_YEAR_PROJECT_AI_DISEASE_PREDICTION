import {GoogleGenerativeAI} from "@google/generative-ai"
import axios from "axios"
const Predictdisease=async(req,res)=>{
    try {
        const {symptom}=req.body;
    //     const genai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model=genai.getGenerativeModel({model:"gemini-3.5-flash-lite"})
    // const prompt=symptom.map((i)=>{return i});
    // const response=await model.generateContent(`
    // Give a Disease prediction  In just 3 to 4 lines  also tell me how can we diagnosis 
    // ${prompt}`);
    // const airesult=response.response.text();
    const response=await axios.post("http://127.0.0.1:8000/predict",{symptoms:symptom});
    const airesult=response.data;
    console.log(airesult)
    return res.json({status:true,result:airesult});
    
        
    } catch (error) {
        console.log("Predict disease error ",error);
        return res.json({status:false,message:"SERVER IS OVERLOAD"});
        
    }

}
const Heartdisease=async(req,res)=>{
    try {
        const heartData=req.body;
        console.log(heartData);
    const response=await axios.post("http://127.0.0.1:8000/heart-predict",heartData);
    const airesult=response.data;
    console.log(airesult)
    return res.json({status:true,result:airesult});
    
    } catch (error) {
        console.log("heart disease prediction error",error);
        return res.json({status:false})
    }
}
export {Predictdisease,Heartdisease}