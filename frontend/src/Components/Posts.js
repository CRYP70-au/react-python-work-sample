import axios from 'axios';
import { useEffect, useState } from 'react';

export function Posts() {
  
  const [posts, setData] = useState([]);
  const [error, setError] = useState([]);


  const fetchPosts = () => {
    axios.get(`/api/posts`).then(response => {
      setData(response.data)
      setError("")
    })
    .catch(err => {
      setError("Network Error: Unable to fetch posts!")
      console.log(err)
    })
  }

  const fromEpoch = (epochTime) => {
    const d = new Date(0);
    d.setUTCSeconds(epochTime);
    const fullString = d.toString()
    return fullString.split("GMT")[0]

  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div class="p-5 grid grid-cols-4 gap-4">   
    {
      error ? (
        <div>
            {
                error ? (
                    <div class="text-red-600">{error}</div>  
                ): (
                    <div></div>
                )
            }
        </div>
      ) : (
      
          posts.map((dataObj) => {
            return (
              <ul style ={{listStyle:'none', paddingTop: "15px", paddingBottom: "15px"}}>
                <li>
                  <h3> {dataObj.title} </h3>
                </li>
                <li>
                  <a> {dataObj.content} </a>
                </li>
                <li>
                  <a> {dataObj.author} </a>
                </li>
                <li>
                  <a> {fromEpoch(dataObj.post_timestamp)} </a>
                </li>
              </ul>
            )
        })
      )
    }
    </div>
  );
}

