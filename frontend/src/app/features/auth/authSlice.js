import authService from "./authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const login = createAsyncThunk(
    "user/login",
    async (userData,thunkApi)=>{
        try{
            return await authService.login(userData)
        }catch(error){
            const errorMsg = error.message || error.toString()
            return thunkApi.rejectWithValue(errorMsg)
        }
    }
)
const initialState = {
    userData:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:"",
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:(state) =>{
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ""
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(login.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(login.fulfilled,(state,action)=>{
                state.isLoading=false
                state.isSuccess=true
                state.userData=action.payload['user_data']
            })
            .addCase(login.rejected,(state,action)=>{
                state.isLoading=false
                state.isSuccess=false
                state.isError=true
                state.message=action.payload
                state.data=null
            })
    }
})

export const {reset} =authSlice.actions
export default authSlice.reducer 