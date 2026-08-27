import {Activity,Home,Stethoscope,User,LogOut, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
  
    const isHome = location.pathname === "/";
    const isPredict = location.pathname === "/predict";
  
    return (
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
  
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
  
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Activity size={24} />
            </div>
  
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                HealthPredict AI
              </h1>
  
              <p className="hidden text-xs text-slate-400 sm:block">
                Explainable AI for Medical Diagnosis
              </p>
            </div>
  
          </Link>
  
  
          {/* Navigation */}
          <div className="flex items-center gap-2">
  
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
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
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isPredict
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Stethoscope size={17} />
              Predict
            </Link>
  
  
            {/* User */}
            <button
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-emerald-100 hover:text-emerald-600"
              title="Profile"
            >
              <User size={18} />
            </button>
  
  
            {/* Logout */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
  
          </div>
  
        </div>
      </nav>
    );
  }
  
  export default Navbar;