import { Checkbox } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";


export function CreatePost() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [privatePost, setPrivate] = useState(false);

    const [error, setError] = useState(false);

    const submitPost = () => {

        const parameters = JSON.stringify({title: title, content: content, private: privatePost })
        axios.post('/api/create_post', parameters, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            window.location = "/create-post"
        }).catch(err => {
            setError("Failed to create post!")
        });
    }

    return (

        <div>
            <div >
                <h2 class="flex y-screen items-center justify-center font-semibold p-2">Create Post</h2>
            </div>
            <div class="flex h-screen items-center justify-center">
                <div>
                    <div>
                        <div class="py-4">
                            <label for="usename"><b>Title</b></label>
                        </div>
                        <div class="bg-gray-50 border border-gray-300">
                            <input class="italic" type="text" placeholder="Title" required onChange={(e) => setTitle(e.target.value)} maxLength={40}/>
                        </div>

                        <div class="py-4">
                            <label for="password"><b>Content</b></label>
                        </div>
                        <div class="bg-gray-50 border border-gray-300">
                            <textarea type="Content" placeholder="Write your deepest thoughts here..." required onChange={(e) => setContent(e.target.value)} maxLength={300}/>
                        </div>

                        <div class="py-4">
                            <label for="private"><b>Private</b></label>
                        </div>
                        <div>
                            <Checkbox type="private" required checked={privatePost} onClick={() => setPrivate(!privatePost)}/>
                        </div>
                    </div>

                    <div class="flex justify-center py-4">
                        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
                            onClick={() => submitPost()} type="submit"
                        >
                            Submit Post
                        </button>
                    </div>

                    <div>
                        {
                            error ? (
                                <div class="text-red-600 justify-center flex">{error}</div>  
                            ): (
                                <div></div>
                            )
                        }
                    </div>
                </div>

        </div>
      </div>

    );
}