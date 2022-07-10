import React, { useState } from "react";

const ImageModal = (props) => {
    const [ picture, setPicture ] = useState('')
    const [ loading, setLoading ] = useState('')

    const startLoading = () => {
        setLoading("Loading...")
    }

    const endLoading = () => {
        setLoading()
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

    const addImage = (e) => {
        e.preventDefault()
        fetch("https://lawson.pythonanywhere.com/images/add", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({image: picture}) 
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

    const clearPicture = () => {
        setPicture("")
    }

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" onClick={props.hideModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Add Image</h3>
                </div>
                <div className="p-4">
                    <form onSubmit={addImage}>
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-primary"><i
                                className="bi bi-envelope text-white"></i></span>
                            <input type="file" className="form-control" onChange={setPictureFunc}/>
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
                            <button className="btn btn-primary" type="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default ImageModal;