import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Sparkles, Search } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { control } from "../Redux/slice";
import { symptomsList } from "../assets/symptom";
import Heartdisease from "./Heartdisease";

function DiagnosisPage({ url }) {

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const prediction = useSelector(
    (state) => state.main.prediction
  );

  const profile = useSelector(
    (state) => state.main.profile
  );

  const inputtext = useSelector(
    (state) => state.main.inputtext
  );

  // =====================================
  // SYMPTOM SELECTION
  // =====================================

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  useEffect(() => {

    if (!inputtext) return;

    const timer = setTimeout(() => {

      setSelectedSymptoms((prev) =>
        prev.includes(inputtext)
          ? prev
          : [...prev, inputtext]
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, [inputtext]);

  // =====================================
  // SYMPTOM PREDICTION
  // =====================================

  const handlePrediction = async () => {

    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return;
    }

    if (!profile) {
      toast.error("User Login Required");
      return;
    }

    setloading(true);

    try {

      const symptom = selectedSymptoms.map((i) => i);

      const res = await axios.post(
        url + "/api/health/predict",
        { symptom },
        {
          withCredentials: true
        }
      );

      console.log("Symptom Backend Response:", res.data);

      const result = res.data.result ?? res.data;

      if (res.data.status === false) {

        toast.error(
          res.data.message || "Prediction failed"
        );

      } else if (result && result.prediction) {

        dispatch(control.setprediction(result));

        toast.success("Prediction completed!");

      } else {

        toast.error("Invalid prediction response");

        console.log("Invalid result:", result);

      }

    } catch (error) {

      console.log("Symptom prediction error:", error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setloading(false);

    }
  };


  const clearAllSymptoms = () => {

    setSelectedSymptoms([]);

    dispatch(control.setinputtext(""));

  };

  // =====================================
  // FILTER SYMPTOMS
  // =====================================

  const filteredSymptoms = symptomsList.filter((symptom) =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =====================================
  // CHECK PREDICTION TYPE
  // =====================================

  const isHeartPrediction = Boolean(
    prediction?.probabilities &&
    (
      prediction.probabilities.heart_disease !== undefined ||
      prediction.probabilities.no_heart_disease !== undefined
    )
  );

  // Heart model percentages are already 0-100.
  // Do not multiply them by 100 again.

  const heartProbabilities = [
    {
      label: "No Heart Disease",
      value: Number(
        prediction?.probabilities?.no_heart_disease ?? 0
      )
    },
    {
      label: "Heart Disease",
      value: Number(
        prediction?.probabilities?.heart_disease ?? 0
      )
    }
  ];

  // =====================================
  // RESULT UI
  // =====================================

  const renderHeartResult = () => {

    const confidence = prediction.predicted_class === 1
      ? prediction.probabilities.no_heart_disease
      : prediction.probabilities.heart_disease;

    return (

      <div className="space-y-5 p-5">

        {/* Main Result */}

        <div className="rounded-xl bg-emerald-50 p-5">

          <p className="text-xs font-semibold text-emerald-600">
            Predicted Result
          </p>

          <h2 className="mt-2 text-2xl font-bold text-emerald-800">
            {prediction.prediction}
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-600">
            Confidence: {Number(confidence).toFixed(2)}%
          </p>

        </div>

        {/* Probability Results */}

        <div>

          <h3 className="mb-4 font-bold text-slate-800">
            Heart Disease Prediction Percentages
          </h3>

          <div className="space-y-4">

            {heartProbabilities.map((item) => {

              const percentage = Number.isFinite(item.value)
                ? Math.min(100, Math.max(0, item.value))
                : 0;

              return (

                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >

                  <div className="mb-2 flex items-center justify-between gap-3">

                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>

                    <span className="text-sm font-bold text-emerald-600">
                      {percentage.toFixed(2)}%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* Model Name */}

        <div className="rounded-xl bg-blue-50 p-4">

          <p className="text-xs font-semibold text-blue-600">
            Machine Learning Model
          </p>

          <p className="mt-1 font-bold text-blue-800">
            {prediction.model || "Heart Disease Model"}
          </p>

        </div>

</div>

    );

  };

  const renderSymptomResult = () => (

    <div className="space-y-4 p-5">

      {/* Main Prediction */}

      <div className="rounded-xl bg-emerald-50 p-4">

        <p className="text-xs font-semibold text-emerald-600">
          Predicted Disease
        </p>

        <h2 className="mt-2 text-2xl font-bold text-emerald-800">
          {prediction.prediction}
        </h2>

        {prediction.confidence !== undefined && (

          <p className="mt-2 text-sm text-slate-600">
            Confidence: {
              (Number(prediction.confidence) * 100).toFixed(2)
            }%
          </p>

        )}

      </div>

      {/* Top Predictions */}

      <div>

        <h3 className="mb-3 font-bold text-slate-800">
          Top Predictions
        </h3>

        {prediction.top_predictions?.length > 0 ? (

          prediction.top_predictions.map((item, index) => {

            const percentage = Number(item.probability) * 100;

            return (

              <div
                key={item.disease || index}
                className="mb-3 rounded-lg border border-slate-200 bg-white p-3"
              >

                <div className="flex justify-between gap-3">

                  <span className="text-sm font-semibold text-slate-700">
                    {item.disease}
                  </span>

                  <span className="text-sm font-bold text-emerald-600">
                    {percentage.toFixed(2)}%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`
                    }}
                  />

                </div>

              </div>

            );

          })

        ) : (

          <p className="text-sm text-slate-400">
            No additional predictions available.
          </p>

        )}

      </div>

      {/* Matched Symptoms */}

      <div>

        <h3 className="font-bold text-slate-800">
          Matched Symptoms
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {prediction.matched_symptoms?.join(", ") || "None"}
        </p>

      </div>

      {/* Disclaimer / Note */}

      {prediction.disclaimer && (

        <div className="rounded-lg bg-yellow-50 p-3">

          <p className="text-xs text-yellow-800">
            {prediction.disclaimer}
          </p>

        </div>

      )}

      {prediction.note && (

        <div className="rounded-lg bg-yellow-50 p-3">

          <p className="text-sm text-yellow-800">
            {prediction.note}
          </p>

        </div>

      )}

    </div>

  );

  // =====================================
  // MAIN COMPONENT
  // =====================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-semibold">

      <Navbar url={url} />

      <main className="mx-auto max-w-6xl px-5 py-10">

        {/* Heart Disease Form */}

        <Heartdisease url={url} />

        <div className="mb-8 mt-10 text-center">

          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Disease Prediction
          </h2>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Select your symptoms below to get an AI-powered health prediction.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Symptoms Section */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="mb-5 flex items-center justify-between">

              {/* <h3 className="text-lg font-bold text-slate-800">
                Symptoms ({selectedSymptoms.length} selected)
              </h3> */}

              {/* {selectedSymptoms.length > 0 && (

                <button
                  onClick={clearAllSymptoms}
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Clear All
                </button>

              )} */}

            </div>

            {/* Search */}

            {/* <div className="relative mb-5">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div> */}

            {/* Symptoms List */}

            <div className="grid max-h-[500px] grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">

              {/* {filteredSymptoms.length > 0 ? (

                filteredSymptoms.map((symptom) => {

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

                })

              ) : (

                <div className="col-span-full py-10 text-center">

                  <Search
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-400">
                    No symptoms found
                  </p>

                </div>

              )}
 */}
            </div>

          </div>

          {/* Analysis Section */}

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

            {/* Total Symptoms */}

            <div className="mt-5 rounded-xl bg-blue-50 p-5">

              <p className="text-xs font-semibold text-blue-600">
                Total Symptoms
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {/* {selectedSymptoms.length} */}
              </p>

            </div>

            {/* Active Symptoms */}

            <div className="mt-4 min-h-[120px] rounded-xl bg-slate-50 p-5">

              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="Enter-Symptom"
                value={inputtext}
                onChange={(e) =>
                  dispatch(control.setinputtext(e.target.value))
                }
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
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

            {/* Prediction Button */}

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

            {/* Final Result */}

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

                    <ClipLoader
                      size={32}
                      color="#10b981"
                    />

                    <p className="text-sm font-bold text-emerald-700">
                      Analyzing...
                    </p>

                  </div>

                ) : prediction ? (

                  isHeartPrediction
                    ? renderHeartResult()
                    : renderSymptomResult()

                ) : (

                  <div className="flex min-h-[260px] items-center justify-center p-5 text-center">

                    <p className="text-sm text-slate-400">
                      Your final prediction result will appear here...
                    </p>

                  </div>

                )}

              </div>

            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              This prediction is generated by a machine-learning model
              and should not replace professional medical advice.
            </p>

          </div>

        </div>

      </main>

      <Footer />

    </div>

  );

}

export default DiagnosisPage;
