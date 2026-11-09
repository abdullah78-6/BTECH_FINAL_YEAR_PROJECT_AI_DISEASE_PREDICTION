import {Activity,Home,Stethoscope,User,LogOut, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios"
import {toast} from "react-hot-toast"
import { useEffect } from "react";
import { control } from "../Redux/slice";
import { useNavigate } from "react-router-dom";
function Navbar({url}) {
const location = useLocation();
  const profile=useSelector(state=>state.main.profile);
  const isHome = location.pathname === "/";
  const isPredict = location.pathname === "/predict";
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const Logout=async()=>{
        const response=await axios.post(url+"/api/auth/logout",{},{
            withCredentials:true
        });
        if(response.data.status){
            dispatch(control.setprofile(""));
        toast.success(response.data.message);
        navigate("/login");

        }
        else{
            toast.error(response.data.message);
        }



  }
  const Fetch=async()=>{
      try {
        const res=await axios.get(url+"/api/auth/getprofile",{
          
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
const navLinkClass = (active) =>
    `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-emerald-100 text-emerald-700"
        : "text-slate-600 hover:bg-slate-100"
}`;

return (
  <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-6">

      {/* Logo */}
      <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Activity size={24} />
        </div>

        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-800 sm:text-lg hidden md:block lg:block xl:block">
            HealthPredict AI
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Explainable AI for Medical Diagnosis
          </p>
        </div>

      </Link>

      {/* Navigation */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">

        {/* Home */}
        <Link
          to="/"
          className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
            isHome
              ? "bg-emerald-100 text-emerald-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Home size={17} />
          Home
        </Link>

        {/* Predict */}
        <Link
          to="/predict"
          className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
            isPredict
              ? "bg-emerald-100 text-emerald-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Stethoscope size={17} />
          Predict
        </Link>

        {/* User */}
        {profile &&
          <button
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-emerald-100 hover:text-emerald-600 uppercase sm:ml-2 sm:h-9 sm:w-9"
            title="Profile"
          >
            {profile.slice(0,1)}
          </button>
        }

        {/* Logout */}
        {profile ?
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500 sm:h-9 sm:w-9"
            title="Logout"
            onClick={Logout}
          >
            <LogOut size={18} />
          </button> :
          <button
            onClick={()=>navigate("/login")}
            className="ml-1 shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95 sm:ml-2 sm:px-5 sm:text-sm"
          >
            Login
          </button>
        }

      </div>

    </div>
  </nav>
);

  
  }
  
  export default Navbar;