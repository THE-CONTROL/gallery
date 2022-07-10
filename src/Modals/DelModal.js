import React, { useEffect, useState } from "react";

const DelModal = (props) => {
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

    const delImage = () => {
        fetch(`https://lawson.pythonanywhere.com/images/delete/${props.delImageId}`, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            } 
        })
        .then(resp => resp.json())
        .then((data) => {
            props.showFlash(data.message, data.success)
            props.hideDelModal()
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getImage()
    }, [])

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" 
                    onClick={props.hideDelModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Delete Image</h3>
                </div>
                <div className="p-4">
                    {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                    {gettingData !== "Loading..." && <div className='w-100'>
                        <div className="w-100 d-flex justify-content-center mb-2">
                            <img src={picture.image} className="m-auto shadow-sm rounded" 
                            alt={picture.image} style={{ height: "150px", width: "150px" }}/>
                        </div>
                        <div className="d-grid col-12 mx-auto">
                            <button className="btn btn-primary" type="button" onClick={delImage}
                            >Delete</button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
     );
}
 
export default DelModal;