
import { ClipLoader } from "react-spinners";
import { Sparkles, Activity, HeartPulse, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import Heartdisease from "./Heartdisease";

function DiagnosisPage({ url }) {

  const prediction = useSelector(
    (state) => state.main.prediction
  );

  const isHeartPrediction = Boolean(
    prediction?.probabilities &&
    (
      prediction.probabilities.heart_disease !== undefined ||
      prediction.probabilities.no_heart_disease !== undefined
    )
  );

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

  const renderHeartResult = () => {

    const confidence = prediction.predicted_class === 1
      ? prediction.probabilities.no_heart_disease
      : prediction.probabilities.heart_disease;

    return (

      <div className="space-y-5 p-5 sm:p-6">

        {/* Main Result */}

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

          <div className="flex items-center gap-2 text-emerald-600">

            <HeartPulse size={19} />

            <p className="text-xs font-bold uppercase tracking-wider">
              Predicted Result
            </p>

          </div>

          <h2 className="mt-3 text-2xl font-bold text-emerald-800">
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

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>

                    <span className="text-sm font-bold text-emerald-600">
                      {percentage.toFixed(2)}%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
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

        {/* Model Information */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Machine Learning Model
          </p>

          <p className="mt-2 font-bold text-blue-800">
            {prediction.model || "Heart Disease Model"}
          </p>

        </div>

      </div>

    );

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-cyan-50 font-sans">

      <Navbar url={url} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Page Heading */}

        <div className="mb-9 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

            <Activity size={28} />

          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-emerald-600">
            HealthPredict AI
          </p>

          <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Heart Disease Prediction
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Analyze patient health parameters using artificial intelligence
            and machine learning to generate heart disease predictions.
          </p>

        </div>

        {/* Main Content */}

        <div className="grid items-start gap-7 lg:grid-cols-[1fr_390px]">

          {/* Heart Disease Form */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-5 sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                  <HeartPulse size={24} />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    Heart Health Assessment
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Enter patient medical parameters for analysis
                  </p>

                </div>

              </div>

            </div>

            <div className="p-4 sm:p-7">

              <Heartdisease url={url} />

            </div>

          </section>

          {/* AI Analysis */}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                <Sparkles size={22} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  AI Analysis
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Prediction insights
                </p>

              </div>

            </div>

            {/* Security Information */}

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>

                <p className="text-sm font-bold text-emerald-800">
                  Secure Analysis
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Patient information is processed securely.
                </p>

              </div>

            </div>

            {/* Final Result */}

            <div className="mt-7">

              <div className="mb-4 flex items-center justify-between gap-2">

                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">

                    <Sparkles size={16} />

                  </span>

                  Final Result

                </h3>

                {prediction && isHeartPrediction && (

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    AI Generated
                  </span>

                )}

              </div>

              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-sm">

                {prediction && isHeartPrediction ? (

                  renderHeartResult()

                ) : (

                  <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

                      <HeartPulse size={32} />

                    </div>

                    <h3 className="text-base font-bold text-slate-700">
                      Awaiting Prediction
                    </h3>

                    <p className="mt-2 max-w-[230px] text-xs leading-6 text-slate-400">
                      Your heart disease prediction and probability analysis will appear here.
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* Disclaimer */}

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">

              <p className="text-xs font-bold text-amber-800">
                Medical Disclaimer
              </p>

              <p className="mt-2 text-xs leading-5 text-amber-700">
                This prediction is generated by a machine-learning model
                and should not replace professional medical advice.
              </p>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>

  );

}

export default DiagnosisPage;
