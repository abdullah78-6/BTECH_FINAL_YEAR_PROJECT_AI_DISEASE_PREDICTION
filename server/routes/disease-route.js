import express from "express"
import { Predictdisease } from "../controllers/Disease-controller.js";
const Diseaserouter=express.Router();
Diseaserouter.post("/predict",Predictdisease);
export default Diseaserouter;