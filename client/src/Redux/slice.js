import {createSlice} from "@reduxjs/toolkit"
import { act } from "react";
const Diseaseslice=createSlice({
    name:"Disease",
    initialState:{
        profile:"",logindata:{
            name:"",
            email:"",
            password:""
        }
    },
    reducers:{
        setprofile(state,action){
            state.profile=action.payload;
        },
        setlogindata(state,action){
            const {name,value}=action.payload;
            state.logindata[name]=value;

        }
    }
})
export const control=Diseaseslice.actions;
export default Diseaseslice.reducer;