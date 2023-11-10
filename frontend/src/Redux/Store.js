import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./ducks/ManipulatePosts"

export default configureStore({
    reducer: {
        posts: postsReducer // Example reducer
    }
})