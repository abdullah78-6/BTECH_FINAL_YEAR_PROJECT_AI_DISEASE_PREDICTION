import {GoogleGenerativeAI} from "@google/generative-ai"
const Predictdisease=async(req,res)=>{
    try {
        const {symptom}=req.body;
        const genai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model=genai.getGenerativeModel({model:"gemini-2.5-flash-lite"})
    const prompt=symptom.map((i)=>{return i});
    const response=await model.generateContent(`
    Give a Disease prediction  In just 3 to 4 lines  also tell me how can we diagnosis 
    ${prompt}`);
    const airesult=response.response.text();
    console.log("AI RESULT",airesult);
    return res.json({status:true,result:airesult});
    
        
    } catch (error) {
        console.log("Predict disease error ",error);
        return res.json({status:false,message:"SERVER IS OVERLOAD"});
        
    }

}
export {Predictdisease}