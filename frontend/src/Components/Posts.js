import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post } from './Post';
import { useDispatch } from 'react-redux';
import {addPosts, removePost, editPosts} from '../Redux/ducks/ManipulatePosts'
import Store from '../Redux/Store';

export function Posts(props) {
  const NEWSFEED_ENDPOINT = "/api/posts"
  const PRIVATE_ENDPOINT = "/api/user_posts"
  
  const [error, setError] = useState([]);
  const isInProfile = props.isInProfile;
  
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const [localPostsState, handleChangedPosts] = useState([])


  const fetchPosts = (endpoint) => {
    axios.get(endpoint).then(response => {
      if(response.data.length === 0) {
        setMessage("No posts exist, Try posting your first blog!")
      }
      dispatch(addPosts(response.data))
      handleChangedPosts(Store.getState().posts.posts)
      setError("")
    })
    .catch(err => {
      setError(JSON.parse(err.request.response).message)
    })
  }

  const updateDeletePost = (postId) => {
    dispatch(removePost(postId))
    handleChangedPosts(Store.getState().posts.posts)
  }

  const updateEditPost = (post) => {
    dispatch(editPosts(post))
    handleChangedPosts(Store.getState().posts.posts)
  }

  useEffect(() => {
    if(isInProfile === true) {
      fetchPosts(PRIVATE_ENDPOINT)
    }
    else {
      fetchPosts(NEWSFEED_ENDPOINT);
    }
  }, []);


  return (
    <div>
      <div >
        {
          isInProfile ? (
            <h2 class="flex y-screen items-center justify-center font-semibold p-2  text-2xl">Your Posts</h2>
          ) : (
            <h2 class="flex y-screen items-center justify-center font-semibold p-2  text-2xl">Newsfeed</h2>
          )
        }
      </div>

      <div>
        {
            message ? (
              <div class="flex y-screen items-center justify-center font-semibold p-2">{message}</div>  
            ) : (
              <div></div>
            )
        }
      </div>
      <div class="p-5 grid grid-cols-4 gap-4 items-center">  
      {
        error ? (
          <div>
              {
                  error ? (
                      <div class="text-red-600 justify-center flex">{error}</div>  
                  ) : (
                      <div></div>
                  )
              }
          </div>
        ) : (
          localPostsState.map((dataObj) => {
            return (
              <Post dataObj={dataObj} isInProfile={isInProfile} updateDeletePost={updateDeletePost} updateEditPost={updateEditPost}/>
            )
          })
        )
      }
      </div>
    </div>
  );
}

