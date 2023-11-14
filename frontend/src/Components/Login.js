import axios from "axios";
import { useState } from "react"


export function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    

    const submitLogin = () => {
        
        const params = JSON.stringify({username: username, password: password})
        axios.post('/api/login', params, {
            headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
            setError("");
            window.location = "/" // Force a redirect on login
        }).catch(err => {
            const errorMessage = err.response.data.message
            setError(errorMessage)

        })
    }

    return (

        <div>
            <div >
                <h2 class="flex y-screen items-center justify-center font-semibold p-2 text-2xl">Login</h2>
            </div>
            <div class="flex h-screen items-center justify-center">
                <div>
                    <div>
                        <div class="py-4">
                            <label for="usename"><b>Username</b></label>
                        </div>
                        <div class="bg-gray-50 border border-gray-300">
                            <input type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div class="py-4">
                            <label for="password"><b>Password</b></label>
                        </div>
                        <div class="bg-gray-50 border border-gray-300">
                            <input type="password" placeholder="Enter Password" required onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>

                    <div class="flex justify-center py-4">
                        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => submitLogin()} type="submit">
                            Login
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

    )

}