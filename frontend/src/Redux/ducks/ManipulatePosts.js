import { createSlice, current } from "@reduxjs/toolkit";


export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: []
    },
    reducers: {
        addPosts (state, action) {
            state.posts = action.payload
        },
        removePost (state, action) {
            state.posts = state.posts.filter((post) => parseInt(post.id) !== parseInt(action.payload))
        },
        editPosts (state, action) {
            state.posts.map((post, index) => {
                if(parseInt(post.id) === parseInt(action.payload.id)) {
                    state.posts[index] = action.payload
                }
            })
        },
        default(state) {
            return {
                ...state.posts

            }
        }
    }
})


export const {addPosts, removePost, editPosts} = postsSlice.actions;
export default postsSlice.reducer;