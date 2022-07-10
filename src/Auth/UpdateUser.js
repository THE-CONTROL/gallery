import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const UpdateUser = (props) => {
    const [username, setUsername] = useState('Loading...')
    const [email, setEmail] = useState('Loading...')
    const [picture, setPicture] = useState('')
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState('')

    const startLoading = () => {
        setLoading("Loading...")
    }

    const endLoading = () => {
        setLoading()
    }

    const getUser = () => {
        startLoading()
        fetch("https://lawson.pythonanywhere.com/auth/user", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setUsername(data.user.username)
            setEmail(data.user.email)
            setPicture(data.user.picture)
            endLoading()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const UpdateFunc = (e) => {
        e.preventDefault()
        fetch("https://lawson.pythonanywhere.com/auth/update", {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({username: username, email: email, picture: picture})
        })
        .then(resp => resp.json())
        .then((data) => {
            props.showFlash(data.message, data.success)
            if (data.success) {
                navigate("/")
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const clearPicture = () => {
        setPicture("")
    }

    const getCloudPic = (newPic) => {
        const formData = new FormData()
        const upload_preset = "lawson"
        formData.append("upload_preset", upload_preset)
        formData.append("file", newPic)
        fetch("https://api.cloudinary.com/v1_1/de49puo0s/image/upload", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.json())
        .then((data) => {
            setPicture(data.url)
            endLoading()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const setUsernameFunc = (e) => {
        setUsername(e.target.value)
    }

    const setEmailFunc = (e) => {
        setEmail(e.target.value)
    }

    const setPictureFunc = (e) => {
        clearPicture()
        const files = e.target.files || e.dataTransfer.files
        const file = files[0]
        if (file) {
            var fileType = file.type
            var fileGroup = fileType.split("/")[0]
        }
        if (fileGroup) {
            if (fileGroup !== "image") {
                alert("File type must be an image")
            }
            else {
                const reader = new FileReader()
                reader.onload = (e) => {
                    startLoading()
                    getCloudPic(e.target.result)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("refresh-token")) {
            navigate("/login")
            props.showFlash("You are not logged in", false)
        }
        else (
            getUser()
        )
    }, [props.loggedIn])

    return ( 
        <div className="container-fluid  min-vh-100">
                <div className="rounded d-flex justify-content-center">
                    <div className="col-md-4 col-sm-12 shadow p-5 bg-light">
                        <div className="text-center">
                            <h3 className="text-primary">Update Account</h3>
                        </div>
                        <div className="p-4">
                            <form onSubmit={UpdateFunc}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary"><i
                                            className="bi bi-person-plus-fill text-white"></i></span>
                                    <input type="text" className="form-control" placeholder="Username..."
                                    value={username} onChange={setUsernameFunc}/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary"><i
                                            className="bi bi-envelope text-white"></i></span>
                                    <input type="email" className="form-control" placeholder="Email..."
                                    value={email} onChange={setEmailFunc}/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-primary"><i
                                            className="bi bi-envelope text-white"></i></span>
                                    <input type="file" className="form-control" 
                                    onChange={setPictureFunc}/>
                                </div>
                                {picture && <div className="w-100 mb-2">
                                    <div className="container w-100 d-flex justify-content-center">
                                        <button className="btn-close bg-danger" onClick={clearPicture}></button>
                                    </div>
                                    <div className="container w-100 d-flex justify-content-center mt-1">
                                        <img src={picture} className="m-auto shadow-sm rounded" 
                                        alt={picture} style={{ height: "60px", width: "60px" }}/>
                                    </div>
                                </div>}
                                {loading === "Loading..." && <p className="text-center">{loading}</p>}
                                <div className="d-grid col-12 mx-auto">
                                    <button className="btn btn-primary" type="submit">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
     );
}
 
export default UpdateUser;