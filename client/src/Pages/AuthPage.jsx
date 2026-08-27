import { useState } from "react";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShieldCheck,
  Brain,
  Activity,
  Sparkles,
  Globe,
} from "lucide-react";

function AuthPage() {
  // Sign Up first
  const [isLogin, setIsLogin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      {/* ================= LEFT SIDE ================= */}

      <div className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500 lg:flex lg:w-1/2">

        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

          {/* ================= LOGO ================= */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-green-600 shadow-lg">
              AI
            </div>

            <div>
              <span className="block text-2xl font-bold tracking-tight text-white">
                HealthPredict
              </span>

              <span className="text-xs text-green-50">
                Explainable AI for Medical Diagnosis
              </span>
            </div>

          </div>


          {/* ================= MAIN CONTENT ================= */}

          <div className="max-w-lg">

            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">

              <ShieldCheck size={17} />

              <span>AI-Powered</span>

              <span>•</span>

              <span>Explainable</span>

              <span>•</span>

              <span>Reliable</span>

            </div>


            {/* Heading */}

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">

              Smarter Health
              <br />

              <span className="text-green-100">
                Predictions with AI
              </span>

            </h1>


            {/* Description */}

            <p className="mt-6 max-w-md text-base leading-7 text-white/90 xl:text-lg">

              Predict possible health conditions using machine
              learning and understand why the AI made each
              prediction with Explainable AI.

            </p>


            {/* ================= FEATURES ================= */}

            <div className="mt-10 space-y-5">

              {/* Feature 1 */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">

                  <Brain size={19} />

                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    AI-Based Diagnosis
                  </h3>

                  <p className="text-sm text-green-50">
                    Machine learning models analyze patient data
                  </p>

                </div>

              </div>


              {/* Feature 2 */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">

                  <Activity size={19} />

                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    Explainable Predictions
                  </h3>

                  <p className="text-sm text-green-50">
                    Understand the important factors behind predictions
                  </p>

                </div>

              </div>


              {/* Feature 3 */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">

                  <ShieldCheck size={19} />

                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    Secure & Private
                  </h3>

                  <p className="text-sm text-green-50">
                    Patient information is handled securely
                  </p>

                </div>

              </div>


              {/* Feature 4 */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">

                  <Sparkles size={19} />

                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    Better Understanding
                  </h3>

                  <p className="text-sm text-green-50">
                    AI explanations help users understand results
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= FOOTER ================= */}

          <p className="text-sm text-green-100">
            AI-assisted medical prediction • Transparent • Responsible
          </p>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">

        <div className="w-full max-w-md">


          {/* ================= MOBILE LOGO ================= */}

          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 font-bold text-white">
              AI
            </div>

            <span className="text-xl font-bold text-slate-800">
              HealthPredict
            </span>

          </div>


          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">

              {isLogin
                ? "Welcome back!"
                : "Create your account"}

            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              {isLogin
                ? "Enter your details to access your HealthPredict account."
                : "Create your account to access AI-powered medical prediction."}

            </p>

          </div>


          {/* ================= FORM ================= */}

          <form className="space-y-5">


            {/* Full Name */}

            {!isLogin && (

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />

                </div>

              </div>

            )}


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />

              </div>

            </div>


            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-green-600"
                >

                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}

                </button>

              </div>

            </div>


            {/* Confirm Password */}

            {!isLogin && (

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-green-600"
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>

            )}


            {/* Forgot Password */}

            {isLogin && (

              <div className="flex justify-end">

                <button
                  type="button"
                  className="cursor-pointer text-sm font-semibold text-green-600 transition hover:text-green-700"
                >
                  Forgot password?
                </button>

              </div>

            )}


            {/* Main Button */}

            <button
              type="button"
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600 hover:shadow-green-600/30 active:scale-[0.99]"
            >

              {isLogin ? "Login" : "Create Account"}

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </form>


          {/* ================= DIVIDER ================= */}

          <div className="my-7 flex items-center gap-4">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>


          {/* ================= GOOGLE ================= */}

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >

            <Globe size={19} />

            Continue with Google

          </button>


          {/* ================= SWITCH ================= */}

          <p className="mt-7 text-center text-sm text-slate-500">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 cursor-pointer font-semibold text-green-600 transition hover:text-green-700"
            >

              {isLogin ? "Sign Up" : "Login"}

            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default AuthPage;