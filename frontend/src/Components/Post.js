import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Checkbox,
    Input
} from "@material-tailwind/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";



export function Post(props) {

    const dataObj = props.dataObj;
    const isInProfile = props.isInProfile
    const dispatch = useDispatch();

    const [editing,  setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(dataObj.title)
    const [newContent, setNewContent] = useState(dataObj.content)
    const [newPrivate, setPrivate] = useState(dataObj.private)

    const fromEpoch = (epochTime) => {
        const d = new Date(0);
        d.setUTCSeconds(epochTime);
        const fullString = d.toString()
        return fullString.split("GMT")[0]

    }

    const deletePost = (postId) => {
        const params = JSON.stringify({post_id: parseInt(postId)})

        axios.post('/api/delete_post', params, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            props.updateDeletePost(postId)
        ).catch(err => {
            console.log(err)
        })
    }

    const submitEdit = () => {

        const postId = dataObj.id

        const params = JSON.stringify({post_id: postId, title: newTitle, content: newContent, private: newPrivate})

        axios.post('/api/update_post', params, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            const updatedPost = response.data.data
            props.updateEditPost(updatedPost)
            handleEditing()
        }).catch(err => {
            console.log(err)
        })

    }

    const handleEditing = () => {
        
        setEditing(!editing)
        
        {/* props.updateEditPost() */}

    }

    // Src: https://www.material-tailwind.com/docs/react/card#testimonial-card
    return (
        <div>

            <Card color="transparent" shadow={true} className="w-full max-w-[26rem] pb-10 shadow-lg p-10">
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-4 pt-0 pb-4"
            >
                <div className="flex w-full flex-col gap-0.5">
                <div className="flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                    {dataObj.author}
                    </Typography>
                </div>

                {editing ? (
                    <input placeholder={dataObj.title ? (dataObj.title) : ("New Title")} className="italic" onChange={(e) => setNewTitle(e.target.value)} maxLength={40}/>
                ) : (
                    <Typography color="blue-gray" className="italic">
                        {dataObj.title}
                    </Typography> 
                )}

                </div>
            </CardHeader>
            <CardBody className="p-0">
                {editing ? (
                    <textarea placeholder={dataObj.content ? (dataObj.content) : ("New Content")} onChange={(e) => setNewContent(e.target.value)} maxLength={300}/>
                ) : (
                    <Typography>
                        {dataObj.content}
                    </Typography>
                )}

                <Typography className="text-xs">
                    Updated at: {fromEpoch(dataObj.update_timestamp)}
                </Typography>
                <Typography className="text-xs">
                    {fromEpoch(dataObj.post_timestamp)}
                </Typography>
            </CardBody>
            <Typography className="pb-5 text-xs">
                {isInProfile ? (
                    parseInt(dataObj.private) === 1 ? (
                        "Private"
                    ) : (
                        "Public"
                    )
                ) : (
                    ""
                )}
                {
                    editing ? (
                        <div>
                            <div class="py-4">
                                <label for="private"><b>Set Private</b></label>
                            </div>
                            <div>
                                <Checkbox type="private" required checked={newPrivate} onClick={() => setPrivate(!newPrivate)}/>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </Typography>

            {
                isInProfile ? (
                    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                        <li>
                            <svg onClick={() => deletePost(dataObj.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </li>
                        <li>
                            <svg onClick={() => handleEditing()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                        </li>
                    </ul>
                ) : (
                    <div/>
                )
            }   

            {
                editing ? (

                    <div class=" self-end">
                        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" 
                            onClick={() => submitEdit()} type="submit"
                        >
                            Submit Post
                        </button>
                    </div>

                ) : (
                    <div></div>
                )
            }

            </Card>


            
        </div>

    );

}