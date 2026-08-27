import { Routes, Route,Navigate } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import HomePage from "./Pages/HomePage";
import DiagnosisPage from "./Pages/DiagnosisPage";
import {useSelector,useDispatch} from "react-redux"
function App() {
  const dispatch=useDispatch();
  const profile=useSelector(state=>state.main.profile);
  return <div>
    <Routes>
      <Route path="/predict" element={profile?<DiagnosisPage/>:<Navigate to="/login"/>}></Route>
      <Route path="/login" element={!profile?<AuthPage/>:<Navigate to="/"/>}></Route>
      <Route path="/" element={profile?<HomePage/>:<Navigate to="/login"/>}></Route>
      
    </Routes>
    
   
  </div>

}

export default App
