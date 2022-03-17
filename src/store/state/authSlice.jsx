import { createSlice } from "@reduxjs/toolkit";

const initialState = {}; 

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action 
    ) => {
      state.name = action.payload.name;
      state.token = action.payload.token;
    },
    defaultState: (state) => {
      state = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, defaultState } = authSlice.actions;

export default authSlice.reducer;
