import axios from "axios";
import { useEffect, useState } from "react";




export function Account() {

    const [oldPassword, setOldPassword] = useState('');
    const [password, setNewPassword] = useState('');
    const [confirmedPassword, setConfirmPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const submitPasswordChange = () => {
        const params = JSON.stringify({old_password: oldPassword, password: password, confirmed_password: confirmedPassword})
        axios.post('/api/update_password', params, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            setConfirmPassword("")
            setMessage(response.data.message)
        }).catch(err => {
            setError(err.message)
            console.log(err)
        })
        
    }

    const checkLoggedIn = () => {
        axios.get(`/api/check_auth`).then(response => {
            
        })
        .catch(err => {
            setLoginError("User not logged in!")
        })
    }

    useEffect(() => {
        checkLoggedIn();
    })

    return (

        <div>
            {
                loginError ? (
                    <div class="text-red-600 justify-center flex">{loginError}</div>  
                ) : (
                    <div>
                        <div >
                            <h2 class="flex y-screen items-center justify-center font-semibold p-2 text-2xl">Account</h2>
                        </div>
                        <div class="flex h-screen items-center justify-center">
                            <div>
                                <div>
                                    <div class="py-4">
                                        <label for="header"><b>Change Password</b></label>
                                    </div>
                                    <div class="py-4 text-medium">
                                        <label for="oldPassword"><b>Password</b></label>
                                    </div>
                                    <div class="bg-gray-50 border border-gray-300">
                                        <input type="password" placeholder="Enter Password" required onChange={(e) => setOldPassword(e.target.value)}/>
                                    </div>
                                    <div class="py-4 text-medium">
                                        <label for="password"><b>New Password</b></label>
                                    </div>
                                    <div class="bg-gray-50 border border-gray-300">
                                        <input type="password" placeholder="Enter Password" required onChange={(e) => setNewPassword(e.target.value)}/>
                                    </div>
                                    <div class="py-4 text-medium">
                                        <label for="confirmpassword"><b>Confirm Password</b></label>
                                    </div>
                                    <div class="bg-gray-50 border border-gray-300">
                                        <input type="password" placeholder="Enter Password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                                    </div>
                                </div>

                                <div class="flex justify-center py-4">
                                    <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => submitPasswordChange()} type="submit">
                                        Submit
                                    </button>
                                </div>


                                <div>
                                    {
                                        error ? (
                                            <div class="text-red-600 justify-center flex">{error}</div>  
                                        ): (
                                            <div class="text-green-600 justify-center flex">{message}</div>  

                                        )
                                    }
                                </div>
                                
                            </div>

                        </div>
                    </div>
                )
            }
            
      </div>

    )

}