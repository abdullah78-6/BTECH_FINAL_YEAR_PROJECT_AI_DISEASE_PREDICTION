import {createSlice} from "@reduxjs/toolkit"
const Diseaseslice=createSlice({
    name:"Disease",
    initialState:{
        profile:""
    },
    reducers:{
        setprofile(state,action){
            state.profile=action.payload;
        }
    }
})
export const control=Diseaseslice.actions;
export default Diseaseslice.reducer;