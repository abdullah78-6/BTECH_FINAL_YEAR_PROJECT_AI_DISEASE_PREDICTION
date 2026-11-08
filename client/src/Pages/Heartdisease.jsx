import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { control } from "../Redux/slice";
import {toast} from "react-hot-toast"
const initialForm = {
  age: "",
  sex: "",
  "chest pain type": "",
  "resting blood pressure": "",
  "serum cholestoral": ""
};

function HeartDiseaseForm({ url }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // Keeping your Redux selectors as they are
  const profile = useSelector(state => state.main.profile);
  const prediction = useSelector(state => state.main.prediction);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericData = {
      age: Number(formData.age),
      sex: Number(formData.sex),
      "chest pain type": Number(formData["chest pain type"]),
      "resting blood pressure": Number(formData["resting blood pressure"]),
      "serum cholestoral": Number(formData["serum cholestoral"])
    };
if(!profile){
  toast.error("User Login Required");
  return ;
}
    try {
      setLoading(true);

      const res = await axios.post(
        url + "/api/health/heart",
        numericData,
        { withCredentials: true }
      );

      if (res.data.status) {
        setLoading(false)
        dispatch(control.setprediction(res.data.result));
      }

    } catch (error) {
      setLoading(false)
      console.error(
        "Prediction error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Heart Disease Prediction
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your basic clinical information.
          </p>
        </div>

        {/* Age */}
        <div>
          <label className={labelClass}>Age</label>
          <input
            className={inputClass}
            type="number"
            name="age"
            min="1"
            max="120"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sex */}
        <div>
          <label className={labelClass}>Sex</label>
          <select
            className={inputClass}
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Select sex</option>
            <option value="0">Female</option>
            <option value="1">Male</option>
          </select>
        </div>

        {/* Chest Pain */}
        <div>
          <label className={labelClass}>Chest Pain Type</label>
          <select
            className={inputClass}
            name="chest pain type"
            value={formData["chest pain type"]}
            onChange={handleChange}
            required
          >
            <option value="">Select chest pain type</option>
            <option value="1">Typical angina</option>
            <option value="2">Atypical angina</option>
            <option value="3">Non-anginal pain</option>
            <option value="4">Asymptomatic</option>
          </select>
        </div>

        {/* Blood Pressure */}
        <div>
          <label className={labelClass}>Resting Blood Pressure (mmHg)</label>
          <input
            className={inputClass}
            type="number"
            name="resting blood pressure"
            min="1"
            placeholder="e.g. 120"
            value={formData["resting blood pressure"]}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cholesterol */}
        <div>
          <label className={labelClass}>Cholesterol (mg/dL)</label>
          <input
            className={inputClass}
            type="number"
            name="serum cholestoral"
            min="0"
            placeholder="e.g. 200"
            value={formData["serum cholestoral"]}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Predicting..." : "Predict Heart Disease"}
        </button>

        <p className="text-center text-xs text-gray-500">
          Educational ML prediction only, not a medical diagnosis.
        </p>
      </form>
    </div>
  );
}

export default HeartDiseaseForm;
