import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
const firebaseConfig={
apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
authDomain: "disease-prediction-55e2f.firebaseapp.com",
projectId: "disease-prediction-55e2f",
storageBucket: "disease-prediction-55e2f.firebasestorage.app",
messagingSenderId: "976522404611",
appId: "1:976522404611:web:92634cafc7a648199fbf36",
measurementId: "G-Z5RKBFN73V"
}
const app=initializeApp(firebaseConfig);
const auth=getAuth();
export {app,auth};