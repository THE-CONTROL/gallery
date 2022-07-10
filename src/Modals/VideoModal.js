import React, { useState } from "react";

const VideoModal = (props) => {
    const [ video, setVideo ] = useState('')
    const [ videoName, setVideoName ] = useState('')
    const [ loading, setLoading ] = useState('')

    const startLoading = () => {
        setLoading("Loading...")
    }

    const endLoading = () => {
        setLoading()
    }

    const getCloudVideo = (newVideo) => {
        const formData = new FormData()
        const upload_preset = "lawson"
        formData.append("upload_preset", upload_preset)
        formData.append("file", newVideo)
        fetch("https://api.cloudinary.com/v1_1/de49puo0s/upload", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.json())
        .then((data) => {
            setVideo(data.url)
            endLoading()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const setVideoFunc = (e) => {
        clearVideo()
        const files = e.target.files || e.dataTransfer.files
        const file = files[0]
        if (file) {
            var filename = file.name
            var fileType = file.type
            var fileGroup = fileType.split("/")[0]
        }
        if (fileGroup) {
            if (fileGroup !== "video") {
                alert("File type must be an video")
            }
            else {
                const reader = new FileReader()
                reader.onload = (e) => {
                    startLoading()
                    getCloudVideo(e.target.result)
                    setVideoName(filename)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const addVideo = (e) => {
        e.preventDefault()
        fetch("https://lawson.pythonanywhere.com/videos/add", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({video: video, video_name: videoName}) 
        })
        .then(resp => resp.json())
        .then((data) => {
            props.showFlash(data.message, data.success)
            if (data.success) {
                props.hideModal()
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const clearVideo = () => {
        setVideo("")
    }

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" onClick={props.hideModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Add video</h3>
                </div>
                <div className="p-4">
                    <form onSubmit={addVideo}>
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-primary"><i
                                className="bi bi-envelope text-white"></i></span>
                            <input type="file" className="form-control" onChange={setVideoFunc}/>
                        </div>
                        {video && <div className="w-100 mb-2">
                            <div className="container w-100 d-flex justify-content-center">
                                <button className="btn-close bg-danger" onClick={clearVideo}></button>
                            </div>
                            <div className="container w-100 d-flex justify-content-center mt-1">
                                <video controls className='w-100 bg-dark rounded shadow-sm'> 
                                    <source src={video} alt={video} 
                                    style={{ height: "150px" }}></source>
                                </video>
                            </div>
                            <p className='text-center overflow-auto mt-2'>{videoName}</p>
                        </div>}
                        {loading === "Loading..." && <p className="text-center">{loading}</p>}
                        <div className="d-grid col-12 mx-auto">
                            <button className="btn btn-primary" type="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default VideoModal;