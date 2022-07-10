import React, { useEffect, useState } from "react";

const DelVideoModal = (props) => {
    const [ video, setVideo ] = useState({})
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const getVideo = () => {
        startGettingData()
        fetch(`https://lawson.pythonanywhere.com/videos/${props.delVideoId}`, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setVideo(data.result)
            stopGettingData()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const delVideo = () => {
        fetch(`https://lawson.pythonanywhere.com/videos/delete/${props.delVideoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            } 
        })
        .then(resp => resp.json())
        .then((data) => {
            props.showFlash(data.message, data.success)
            props.hideDelVideoModal()
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getVideo()
    }, [])

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" 
                    onClick={props.hideDelVideoModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Delete Video</h3>
                </div>
                <div className="p-4">
                    {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                    {gettingData !== "Loading..." && <div className='w-100'>
                        <div className="w-100 d-flex justify-content-center">
                            <iframe className="rounded shadow-sm" src={video.video} title={video.video}
                            style={{ height: "150px", width: "150px" }}></iframe>
                        </div>
                        <p className='text-center overflow-auto mt-2'>{video.video_name}</p>
                        <div className="d-grid col-12 mx-auto">
                            <button className="btn btn-primary" type="button" onClick={delVideo}
                            >Delete</button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
     );
}
 
export default DelVideoModal;