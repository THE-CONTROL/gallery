import React, { useEffect, useState } from "react";

const Fullscreen = (props) => {
    const [ picture, setPicture ] = useState({})
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const getImage = () => {
        startGettingData()
        fetch(`https://lawson.pythonanywhere.com/images/${props.delImageId}`, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setPicture(data.result)
            stopGettingData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getImage()
    }, [])

    return ( 
        <div className="container-fluid col-12 mt-1 mb-3 min-vh-100">
            <div className="container-fluid w-100 d-flex justify-content-end">
                <button className="btn-close float-end bg-danger" onClick={props.hideFullscreen}></button>
            </div>
            {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
            {gettingData !== "Loading..." && <div className='image-fluid'>
                <img src={picture.image} className="w-100 h-100 rounded shadow mt-2" 
                alt={picture.image} style={{height: "90%"}}/>
            </div>}
        </div>
    );
}
 
export default Fullscreen;