import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { control } from "../Redux/slice";
import { toast } from "react-hot-toast";

const initialForm = {
  age: "",
  sex: "",
  "chest pain type": "",
  "resting blood pressure": "",
  "serum cholestoral": "",
  "fasting blood sugar": "",
  "resting electrocardiographic results": "",
  "max heart rate": "",
  "exercise induced angina": "",
  oldpeak: "",
  "ST segment": "",
  "major vessels": "",
  thal: ""
};

function HeartDiseaseForm({ url }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const profile = useSelector((state) => state.main.profile);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile) {
      toast.error("User Login Required");
      return;
    }

    const emptyField = Object.entries(formData).find(
      ([, value]) => value === ""
    );

    if (emptyField) {
      toast.error(`Please enter ${emptyField[0]}`);
      return;
    }

    const numericData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        Number(value)
      ])
    );

    if (
      Object.values(numericData).some(
        (value) => !Number.isFinite(value)
      )
    ) {
      toast.error("Please enter valid numeric values.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        url + "/api/health/heart",
        numericData,
        { withCredentials: true }
      );

      console.log("Heart Prediction Response:", res.data);

      if (res.data.status) {
        dispatch(control.setprediction(res.data.result));
        toast.success("Heart prediction completed!");
      } else {
        toast.error(res.data.message || "Prediction failed");
      }
    } catch (error) {
      console.error(
        "Heart prediction error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Unable to predict heart disease."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8"
      >

        {/* Header */}
        <div className="border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Heart Disease Prediction
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter all 13 clinical features required by the machine learning model.
          </p>
        </div>

        {/* Patient Measurements */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Patient Measurements
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Age */}
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                step="1"
                placeholder="Enter age"
                className={inputClass}
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            {/* Resting Blood Pressure */}
            <div>
              <label className={labelClass}>
                Resting Blood Pressure (mmHg)
              </label>
              <input
                type="number"
                name="resting blood pressure"
                min="1"
                step="1"
                placeholder="e.g. 120"
                className={inputClass}
                value={formData["resting blood pressure"]}
                onChange={handleChange}
                required
              />
            </div>

            {/* Serum Cholesterol */}
            <div>
              <label className={labelClass}>
                Serum Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                name="serum cholestoral"
                min="0"
                step="1"
                placeholder="e.g. 200"
                className={inputClass}
                value={formData["serum cholestoral"]}
                onChange={handleChange}
                required
              />
            </div>

            {/* Maximum Heart Rate */}
            <div>
              <label className={labelClass}>
                Maximum Heart Rate
              </label>
              <input
                type="number"
                name="max heart rate"
                min="1"
                step="1"
                placeholder="e.g. 150"
                className={inputClass}
                value={formData["max heart rate"]}
                onChange={handleChange}
                required
              />
            </div>

            {/* Oldpeak */}
            <div>
              <label className={labelClass}>Oldpeak</label>
              <input
                type="number"
                name="oldpeak"
                min="0"
                step="any"
                placeholder="e.g. 1.5"
                className={inputClass}
                value={formData.oldpeak}
                onChange={handleChange}
                required
              />
            </div>

          </div>
        </div>

        {/* Clinical Test Results */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Clinical Test Results
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Sex */}
            <div>
              <label className={labelClass}>Sex</label>
              <select
                name="sex"
                className={inputClass}
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <option value="">Select Sex</option>
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>

            {/* Chest Pain Type */}
            <div>
              <label className={labelClass}>Chest Pain Type</label>
              <select
                name="chest pain type"
                className={inputClass}
                value={formData["chest pain type"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Chest Pain Type</option>
                <option value="1">Typical Angina</option>
                <option value="2">Atypical Angina</option>
                <option value="3">Non-anginal Pain</option>
                <option value="4">Asymptomatic</option>
              </select>
            </div>

            {/* Fasting Blood Sugar */}
            <div>
              <label className={labelClass}>
                Fasting Blood Sugar
              </label>
              <select
                name="fasting blood sugar"
                className={inputClass}
                value={formData["fasting blood sugar"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Sugar</option>
                <option value="0">
                  Less than or equal to 120 mg/dL
                </option>
                <option value="1">
                  Greater than 120 mg/dL
                </option>
              </select>
            </div>

            {/* Resting ECG */}
            <div>
              <label className={labelClass}>
                Resting ECG Results
              </label>
              <select
                name="resting electrocardiographic results"
                className={inputClass}
                value={formData["resting electrocardiographic results"]}
                onChange={handleChange}
                required
              >
                <option value="">Select ECG Results</option>
                <option value="0">Normal</option>
                <option value="1">ST-T Wave Abnormality</option>
                <option value="2">Left Ventricular Hypertrophy</option>
              </select>
            </div>

            {/* Exercise Induced Angina */}
            <div>
              <label className={labelClass}>
                Exercise-Induced Angina
              </label>
              <select
                name="exercise induced angina"
                className={inputClass}
                value={formData["exercise induced angina"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Option</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            {/* ST Segment */}
            <div>
              <label className={labelClass}>ST Segment</label>
              <select
                name="ST segment"
                className={inputClass}
                value={formData["ST segment"]}
                onChange={handleChange}
                required
              >
                <option value="">Select ST Segment</option>
                <option value="1">Upsloping</option>
                <option value="2">Flat</option>
                <option value="3">Downsloping</option>
              </select>
            </div>

            {/* Major Vessels */}
            <div>
              <label className={labelClass}>Major Vessels</label>
              <select
                name="major vessels"
                className={inputClass}
                value={formData["major vessels"]}
                onChange={handleChange}
                required
              >
                <option value="">Select Major Vessels</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            {/* Thal */}
            <div>
              <label className={labelClass}>Thal</label>
              <select
                name="thal"
                className={inputClass}
                value={formData.thal}
                onChange={handleChange}
                required
              >
                <option value="">Select Thal</option>
                <option value="3">Normal</option>
                <option value="6">Fixed Defect</option>
                <option value="7">Reversible Defect</option>
              </select>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Analyzing Patient Data..."
            : "Predict Heart Disease"}
        </button>

        <p className="text-center text-xs leading-5 text-gray-500">
          Educational machine-learning prediction only. This tool
          does not replace professional medical diagnosis.
        </p>

      </form>
    </div>
  );
}

export default HeartDiseaseForm;
