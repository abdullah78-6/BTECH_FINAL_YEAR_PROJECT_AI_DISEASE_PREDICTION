import { Routes, Route,Navigate } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import HomePage from "./Pages/HomePage";
import DiagnosisPage from "./Pages/DiagnosisPage";
import {useSelector,useDispatch} from "react-redux"
import axios from "axios"
import { useEffect } from "react";
import { control } from "./Redux/slice";
function App() {
  const dispatch=useDispatch();
  const profile=useSelector(state=>state.main.profile);
  const backendurl="http://localhost:9000"
  const Fetch=async()=>{
      try {
        const res=await axios.get(backendurl+"/api/auth/getprofile",{
          
          withCredentials:true
        });
        if(res.data.status){
          dispatch(control.setprofile(res.data.email));
        }

      } catch (error) {
        console.log("fetch profile server",error);
        
      }
      
    }
    useEffect(()=>{
      Fetch();

    },[])
  return <div>
    <Routes>
      <Route path="/predict" element={profile?<DiagnosisPage url={backendurl}/>:<Navigate to="/login" />}></Route>
      <Route path="/login" element={!profile?<AuthPage url={backendurl}/>:<Navigate to="/"/>}></Route>
      <Route path="/" element={profile?<HomePage url={backendurl}/>:<Navigate to="/login"/>}></Route>
      
    </Routes>
    
   
  </div>

}

export default App
