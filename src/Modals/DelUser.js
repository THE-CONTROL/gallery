import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';

const DelUser = (props) => {
    const [ username, setUsername ] = useState("")
    const [ picture, setPicture ] = useState("")
    const navigate = useNavigate()
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const getUser = () => {
        startGettingData()
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
            setPicture(data.user.picture)
            stopGettingData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const delUser = () => {
        fetch(`https://lawson.pythonanywhere.com/auth/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            } 
        })
        .then(resp => resp.json())
        .then((data) => {
            props.hideDelModal()
            props.logOut()
            props.showFlash(data.message, data.success)
            navigate("/login")
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getUser()
    }, [])

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" 
                    onClick={props.hideDelModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Delete User</h3>
                </div>
                {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                {gettingData !== "Loading..." && <div className='w-100 p-3'>
                    <div className='card shadow-sm bg-light text-dark'>
                        <img src={picture} className='card-img-top' alt="img" 
                        style={{height: "150px"}}/>
                        <div className="card-body">
                            <h3 className='card-title h5 text-center'>
                                {username}
                            </h3>
                        </div>
                    </div>
                    <div className="d-grid col-12 mx-auto mt-2">
                        <button className="btn btn-primary" type="button" onClick={delUser}
                        >Delete</button>
                    </div>
                </div>}
            </div>
        </div>
     );
}
 
export default DelUser;