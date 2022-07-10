import React, { useEffect, useState } from "react";

const VideoFullscreen = (props) => {
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

    useEffect(() => {
        getVideo()
    }, [])

    return ( 
        <div className="container-fluid col-12 vh-100 mt-1 mb-5">
            <div className="container-fluid w-100 d-flex justify-content-end">
                <button className="btn-close float-end bg-danger" onClick={props.hideFullscreen}></button>
            </div>
            {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
            {gettingData !== "Loading..." && <div className='w-100 h-100'>
                <div className="w-100 h-100 mt-2">
                    <iframe className="w-100 rounded shadow h-100" src={video.video} 
                    title={video.video}></iframe>
                </div>
            </div>}
        </div>
    );
}
 
export default VideoFullscreen;