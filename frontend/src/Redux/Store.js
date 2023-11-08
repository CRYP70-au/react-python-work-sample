import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./ducks/Auth"

export default configureStore({
    reducer: {
        auth: authReducer // Example reducer
    }
})