import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { RefreshCw, Sparkles } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { control } from "../Redux/slice";
import { symptomsList } from "../assets/symptom";
function DiagnosisPage({ url }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();
  const prediction = useSelector((state) => state.main.prediction);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };
const handlePrediction = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return;
    }

    setloading(true);

    try {
      const symptom = selectedSymptoms.map((i) => {
        return i;
      });

      const res = await axios.post(
        url + "/api/health/predict",
        { symptom },
        {
          withCredentials: true
        }
      );

      if (res.data.status) {
        dispatch(control.setprediction(res.data.result));
        setloading(false);
      } else {
        toast.error(res.data.message);
        setloading(false);
      }
    } catch (error) {
      console.log("error from backend", error);
      setloading(false);
    }
  };
return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-semibold">

      <Navbar url={url} />

      <main className="mx-auto max-w-6xl px-5 py-10">

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Disease Prediction
          </h2>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Select your symptoms below to get an AI-powered health prediction.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Symptoms ({selectedSymptoms.length} selected)
              </h3>
            </div>

            <div className="grid max-h-[500px] grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">

              {symptomsList.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);

                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`relative min-h-[70px] rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-emerald-500"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <span
                        className={`text-sm font-bold ${
                          isSelected
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {isSelected ? "1" : "0"}
                      </span>
                    </div>

                    <span
                      className={`mt-2 block text-xs font-medium ${
                        isSelected
                          ? "text-emerald-800"
                          : "text-slate-600"
                      }`}
                    >
                      {symptom}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-2">
              <Sparkles
                size={21}
                className="text-emerald-600"
              />

              <h3 className="text-xl font-bold text-slate-800">
                Analysis
              </h3>
            </div>

            <div className="mt-5 rounded-xl bg-blue-50 p-5">
              <p className="text-xs font-semibold text-blue-600">
                Total Symptoms
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {selectedSymptoms.length}
              </p>
            </div>

            <div className="mt-4 min-h-[120px] rounded-xl bg-slate-50 p-5">

              <p className="text-sm font-semibold text-slate-700">
                Active Symptoms
              </p>

              {selectedSymptoms.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  No symptoms selected
                </p>
              ) : (
                <div className="mt-3 space-y-1">
                  {selectedSymptoms.map((symptom) => (
                    <p
                      key={symptom}
                      className="text-sm text-slate-600"
                    >
                      • {symptom}
                    </p>
                  ))}
                </div>
              )}

            </div>

            <button
              onClick={handlePrediction}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <ClipLoader
                    size={18}
                    color="#ffffff"
                    speedMultiplier={0.8}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Predict Disease
                </>
              )}
            </button>

            <div className="mt-6 w-full">

              <div className="mb-3 flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                    <Sparkles
                      size={15}
                      className="text-emerald-600"
                    />
                  </span>

                  Final Result
                </label>

                {prediction && !loading && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    AI Generated
                  </span>
                )}

              </div>

              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 shadow-[inset_0_2px_8px_rgba(15,23,42,0.04),0_8px_25px_rgba(16,185,129,0.08)]">

                {loading ? (
                  <div className="flex h-[260px] flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 shadow-sm">
                      <ClipLoader
                        size={32}
                        color="#10b981"
                        speedMultiplier={0.8}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-700">
                        Analyzing Symptoms
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Please wait while AI generates your prediction...
                      </p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={prediction || ""}
                    readOnly
                    rows={10}
                    placeholder="Your final prediction result will appear here..."
                    className="w-full resize-none border-0 bg-transparent p-5 text-sm font-semibold leading-7 text-emerald-950 outline-none placeholder:text-slate-400 focus:ring-0 "
                  />
                )}

              </div>

            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              This prediction is generated by an AI model and should not replace professional medical advice.
            </p>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default DiagnosisPage;

