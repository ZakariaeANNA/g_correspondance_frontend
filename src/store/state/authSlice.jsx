import { createSlice } from '@reduxjs/toolkit'
import { isExpired, decodeToken } from "react-jwt";


const initialState = { 
    user : {}
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: function(builder){
    builder.addCase("checkLogin" , (state,action)=>{
      const token = localStorage.getItem("token");
      if(isExpired(token)){
        localStorage.clear("token");
        action.history.push("/login");
      }else{
        state.user = decodeToken(token);
      }
      return state;
    });
  }
})

export const { checkLogin } = authSlice.actions
export default authSlice.reducer