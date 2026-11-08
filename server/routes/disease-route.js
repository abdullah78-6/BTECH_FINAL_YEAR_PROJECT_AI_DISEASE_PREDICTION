import express from "express"
import { Heartdisease, Predictdisease } from "../controllers/Disease-controller.js";
const Diseaserouter=express.Router();
Diseaserouter.post("/predict",Predictdisease);
Diseaserouter.post("/heart",Heartdisease);
export default Diseaserouter;