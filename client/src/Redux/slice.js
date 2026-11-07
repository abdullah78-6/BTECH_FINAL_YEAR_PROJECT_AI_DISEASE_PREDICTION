import {createSlice} from "@reduxjs/toolkit"
import { act } from "react";
const Diseaseslice=createSlice({
    name:"Disease",
    initialState:{
        profile:"",logindata:{
            name:"",
            email:"",
            password:""
        },
        prediction:null,
        inputtext:""
    },
    reducers:{
        setprofile(state,action){
            state.profile=action.payload;
        },
        setinputtext(state,action){
            state.inputtext=action.payload;
        },
        setlogindata(state,action){
            const {name,value}=action.payload;
            state.logindata[name]=value;

        },
        setprediction(state,action){
            state.prediction=action.payload;
        }
    }
})
export const control=Diseaseslice.actions;
export default Diseaseslice.reducer;