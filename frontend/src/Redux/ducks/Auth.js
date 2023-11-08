import { createSlice } from "@reduxjs/toolkit";


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        auth: false
    },
    reducers: {
        login: (state, profile) => {
            state.auth = {
                profile
            }
        },
        logout: (state) => {
            state.auth = {
                
            }
        },
    }
})


export const {login, logout} = authSlice.actions;
export default authSlice.reducer;