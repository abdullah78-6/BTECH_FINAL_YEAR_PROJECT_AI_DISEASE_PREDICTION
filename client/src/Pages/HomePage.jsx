import { Activity, ArrowRight, Brain, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios"
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { control } from "../Redux/slice";
import {toast} from "react-hot-toast"
function HomePage({url}) {
  const dispatch=useDispatch();
  const profile=useSelector(state=>state.main.profile);
  
  return (
    <div className="min-h-screen bg-white">

      <Navbar url={url} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-cyan-600">

        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-6 py-16 text-center">

          <div className="max-w-3xl">

            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white">
              <Activity size={30} />
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-100">
              Explainable Artificial Intelligence
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Smarter Health Predictions with AI
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              Predict possible health conditions using machine learning
              and understand why the AI made each prediction.
            </p>


            {/* Predict Button */}
            <Link
              to="/predict"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Your Prediction

              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-12 text-center">

          <p className="text-sm font-semibold text-emerald-600">
            HEALTHPREDICT AI
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            Healthcare powered by AI
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Our system combines machine learning with Explainable AI
            to make medical predictions easier to understand.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-3">

          {/* AI Prediction */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Brain size={24} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              AI-Based Diagnosis
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Machine learning models analyse patient medical data
              to predict possible health conditions.
            </p>

          </div>


          {/* Explainable AI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Activity size={24} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              Explainable Predictions
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Understand which medical factors influenced the
              prediction made by the AI model.
            </p>

          </div>


          {/* Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <ShieldCheck size={24} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              Secure & Private
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Patient information will be handled securely when
              the backend is connected.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;