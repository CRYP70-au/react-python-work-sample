import axios from "axios";
import { useState } from "react"


export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('');

    const submitRegistration = () => {
        const params = JSON.stringify({username: username, password: password, confirm_password: confirmPassword})
        axios.post('/api/create_user', params, {
            headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
            window.location = "/login" // Force a redirect on registration
        }).catch(err => {
            const errorMessage = err.response.data.message
            setError(errorMessage);

        })
    }

    return (
        <div>
            <div >
                <h2 class="flex y-screen items-center justify-center font-semibold">Register</h2>
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
                        <div class="py-4">
                            <label for="confirmpassword"><b>Confirm Password</b></label>
                        </div>
                        <div class="bg-gray-50 border border-gray-300">
                            <input type="password" placeholder="Enter Password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                    </div>

                    <div class="flex justify-center py-4">
                        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => submitRegistration()} type="submit">
                            Register
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