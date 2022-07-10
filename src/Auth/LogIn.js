import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const LogIn = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const setEmailFunc = (e) => {
        setEmail(e.target.value)
    }

    const setPasswordFunc = (e) => {
        setPassword(e.target.value)
    }

    const LogInFunc = (e) => {
        e.preventDefault()
        fetch("https://lawson.pythonanywhere.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({email: email,password: password})
        })
        .then(resp => resp.json())
        .then((data) => {
            props.showFlash(data.message, data.success)
            if (data.success) {
                localStorage.setItem("access-token", data.tokens.access)
                localStorage.setItem("refresh-token", data.tokens.refresh)
                props.isLoggedInTrue()
                navigate("/")
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return ( 
        <div className="container-fluid min-vh-100">
                <div className="rounded d-flex justify-content-center">
                    <div className="col-md-4 col-sm-12 shadow p-5 bg-light">
                        <div className="text-center">
                            <h3 className="text-primary">Login</h3>
                        </div>
                        <div className="p-4">
                            <form onSubmit={LogInFunc}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary"><i
                                            className="bi bi-envelope text-white"></i></span>
                                    <input type="email" className="form-control" placeholder="Email..."
                                    onChange={setEmailFunc}/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary"><i
                                            className="bi bi-key-fill text-white"></i></span>
                                    <input type="password" className="form-control" 
                                    placeholder="Password..." onChange={setPasswordFunc}/>
                                </div>
                                <div className="d-grid col-12 mx-auto">
                                    <button className="btn btn-primary" type="submit">Login</button>
                                </div>
                                <p className="text-center mt-3">Don't have an account? 
                                    <Link to="/register" className="text-primary text-decoration-none">
                                         Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
     );
}
 
export default LogIn;