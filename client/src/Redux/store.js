import {configureStore} from "@reduxjs/toolkit"
import Disease from "./slice.js";
const Medicalstore=configureStore({
    reducer:{
        main:Disease
    }
})
export default Medicalstore;