import { useEffect, useState } from "react";
import {RefreshCw,Sparkles,} from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch } from "react-redux";
const symptomsList = [
  "Itching",
  "Skin Rash",
  "Nodal Skin Eruptions",
  "Continuous Sneezing",
  "Shivering",
  "Chills",
  "Joint Pain",
  "Stomach Pain",
  "Acidity",
  "Ulcers On Tongue",
  "Muscle Wasting",
  "Vomiting",
  "Fatigue",
  "Weight Loss",
  "Cough",
  "Headache",
  "Nausea",
  "Fever",
  "Dizziness",
  "Chest Pain",
  "Breathlessness",
  "Weakness",
  "Abdominal Pain",
  "Loss of Appetite",
  "High Fever",
  "Mild Fever",
  "Cold",
  "Sore Throat",
  "Runny Nose",
  "Nasal Congestion",
  "Sneezing",
  "Dry Cough",
  "Blood in Sputum",
  "Phlegm",
  "Wheezing",

  "Back Pain",
  "Neck Pain",
  "Muscle Pain",
  "Muscle Weakness",
  "Leg Pain",
  "Swelling Joints",
  "Knee Pain",
  "Shoulder Pain",

  "Diarrhea",
  "Constipation",
  "Indigestion",
  "Bloating",
  "Gas",
  "Stomach Bloating",
  "Heartburn",
  "Difficulty Swallowing",
  "Abdominal Swelling",

  "Yellowish Skin",
  "Yellowish Eyes",
  "Pale Skin",
  "Red Eyes",
  "Dark Urine",
  "Blood in Urine",
  "Frequent Urination",
  "Painful Urination",
  "Burning Urination",
  "Dehydration",

  "Blurred Vision",
  "Eye Pain",
  "Watery Eyes",
  "Loss of Vision",

  "Hearing Loss",
  "Ear Pain",
  "Ringing in Ears",

  "Hair Loss",
  "Dry Skin",
  "Excessive Sweating",
  "Acne",
  "Skin Discoloration",

  "Fast Heart Rate",
  "Irregular Heartbeat",
  "Low Blood Pressure",
  "High Blood Pressure",

  "Anxiety",
  "Confusion",
  "Memory Loss",
  "Difficulty Concentrating",
  "Insomnia",
  "Drowsiness",

  "Loss of Smell",
  "Loss of Taste",
  "Difficulty Breathing",
  "Rapid Breathing",

  "Pus Filled Pimples",
  "Blister",
  "Red Spots",
  "Itchy Eyes",

  "Paleness",
  "Cold Hands and Feet",
  "Excessive Hunger",
  "Excessive Thirst",

  "Weight Gain",
  "Swollen Legs",
  "Swollen Feet",
  "Facial Swelling",

  "Tiredness",
  "General Discomfort",
  "Malaise",
  "Restlessness",

  "Chills with Fever",
  "Night Sweats",
  "Body Pain",
  "Loss of Energy"
];

function DiagnosisPage({url}) {

  // ================= STATE =================

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const dispatch=useDispatch();

  // ================= TOGGLE SYMPTOM =================

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };
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


  // ================= RANDOMIZE =================

  const randomizeSymptoms = () => {
    const shuffled = [...symptomsList].sort(
      () => Math.random() - 0.5
    );

    setSelectedSymptoms(shuffled.slice(0, 3));
  };


  // ================= PREDICTION =================

  const handlePrediction = () => {

    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    alert(
      `Prediction started with ${selectedSymptoms.length} symptoms.`
    );
  };


  // ================= UI =================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* ================= NAVBAR ================= */}

      <Navbar url={url} />


      {/* ================= MAIN CONTENT ================= */}

      <main className="mx-auto max-w-6xl px-5 py-10">

        {/* ================= HEADING ================= */}

        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Disease Prediction
          </h2>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Select your symptoms below to get an AI-powered
            health prediction.
          </p>

        </div>


        {/* ================= CONTENT GRID ================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">


          {/* ================= SYMPTOMS ================= */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            {/* Symptoms Header */}

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-lg font-bold text-slate-800">
                Symptoms ({selectedSymptoms.length} selected)
              </h3>


              {/* Randomize Button */}

              

            </div>


            {/* ================= SYMPTOMS GRID ================= */}

            <div className="grid max-h-[500px] grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">

              {symptomsList.map((symptom) => {

                const isSelected =
                  selectedSymptoms.includes(symptom);

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


                      {/* Radio Circle */}

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


                      {/* 0 / 1 */}

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


                    {/* Symptom Name */}

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


          {/* ================= ANALYSIS ================= */}

          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">


            {/* Analysis Header */}

            <div className="flex items-center gap-2">

              <Sparkles
                size={21}
                className="text-emerald-600"
              />

              <h3 className="text-xl font-bold text-slate-800">
                Analysis
              </h3>

            </div>


            {/* ================= TOTAL SYMPTOMS ================= */}

            <div className="mt-5 rounded-xl bg-blue-50 p-5">

              <p className="text-xs font-semibold text-blue-600">
                Total Symptoms
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {selectedSymptoms.length}
              </p>

            </div>


            {/* ================= ACTIVE SYMPTOMS ================= */}

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


            {/* ================= PREDICT BUTTON ================= */}

            <button
              onClick={handlePrediction}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
            >

              <Sparkles size={18} />

              Predict Disease

            </button>


            {/* ================= DISCLAIMER ================= */}

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              This prediction is generated by an AI model and
              should not replace professional medical advice.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DiagnosisPage;