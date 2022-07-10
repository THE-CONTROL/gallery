import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DelUser from '../Modals/DelUser';

const Profile = (props) => {
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ picture, setPicture ] = useState("")
    const [ date, setDate ] = useState("")
    const navigate = useNavigate()
    const [ delModal, setDelModal ] = useState(false)
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const showDelModal = () => {
        setDelModal(true)
    }

    const hideDelModal = () => {
        setDelModal(false)
    }

    const getUser = () => {
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
            const newDate = data.user.date.split("T")[0]
            setDate(newDate)
            stopGettingData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (!localStorage.getItem("refresh-token")) {
            navigate("/login")
            props.showFlash("You are not logged in", false)
        }
        else {
            startGettingData()
            getUser()
        }
    }, [props.loggedIn])
        
    return ( 
        <div className='container-sm min-vh-100'>
            {!delModal && <div className='w-100 m-auto'>
                <h2 className='text-dark text-center'>
                    Profile Page
                </h2>
                {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                {gettingData !== "Loading..." && <div className='d-flex justify-content-center w-100'>
                    <div className='col-md-3 col-sm-5 col-8 card shadow bg-light text-dark mb-5'>
                        <img src={picture} className='card-img-top' alt="img"></img>
                        <div className="card-body">
                            <h3 className='card-title h5 text-center'>
                                {username}
                            </h3>
                            <h3 className='card-text h6 text-center'>
                                {email}
                            </h3>
                            <div className='w-100 d-flex justify-content-center'>
                                <small className='card-text'>
                                    Joined: {date}
                                </small>
                            </div>
                            <div className='container-sm d-flex justify-content-around mt-2'>
                                <Link to="/update"><button className='btn-sm btn-primary'>
                                Update</button></Link>
                                <button className='btn-sm btn-danger' onClick={showDelModal}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>}
            {delModal && <DelUser hideDelModal={hideDelModal} logOut={props.logOut} 
            showFlash={props.showFlash}/>}
        </div>
     );
}
 
export default Profile;