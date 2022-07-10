import React, { useState } from "react";

const SongModal = (props) => {
    const [ song, setSong ] = useState('')
    const [ songName, setSongName ] = useState('')
    const [ loading, setLoading ] = useState('')

    const startLoading = () => {
        setLoading("Loading...")
    }

    const endLoading = () => {
        setLoading()
    }

    const getCloudSong = (newSong) => {
        const formData = new FormData()
        const upload_preset = "lawson"
        formData.append("upload_preset", upload_preset)
        formData.append("file", newSong)
        fetch("https://api.cloudinary.com/v1_1/de49puo0s/upload", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.json())
        .then((data) => {
            setSong(data.url)
            endLoading()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const setSongFunc = (e) => {
        clearSong()
        const files = e.target.files || e.dataTransfer.files
        const file = files[0]
        if (file) {
            var filename = file.name
            var fileType = file.type
            var fileGroup = fileType.split("/")[0]
        }
        if (fileGroup) {
            if (fileGroup !== "audio") {
                alert("File type must be an audio")
            }
            else {
                const reader = new FileReader()
                reader.onload = (e) => {
                    startLoading()
                    getCloudSong(e.target.result)
                    setSongName(filename)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const addSong = (e) => {
        e.preventDefault()
        fetch("https://lawson.pythonanywhere.com/songs/add", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({song: song, song_name: songName}) 
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

    const clearSong = () => {
        setSong("")
    }

    return ( 
        <div className="rounded d-flex justify-content-center mt-5 min-vh-100">
            <div className="col-md-4 col-sm-12 shadow p-5 bg-light mb-5 h-75">
                <div className="w-100 bg-dark">
                    <button className="btn-close float-end bg-danger" onClick={props.hideModal}></button>
                </div>
                <div className="text-center">
                    <h3 className="text-primary">Add Song</h3>
                </div>
                <div className="p-4">
                    <form onSubmit={addSong}>
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-primary"><i
                                className="bi bi-envelope text-white"></i></span>
                            <input type="file" className="form-control" onChange={setSongFunc}/>
                        </div>
                        {song && <div className="w-100 mb-2">
                            <div className="container w-100 d-flex justify-content-center">
                                <button className="btn-close bg-danger" onClick={clearSong}></button>
                            </div>
                            <div className="container w-100 d-flex justify-content-center mt-1">
                                <video controls className='w-100 bg-dark rounded shadow-sm'> 
                                    <source src={song} alt={song} 
                                    style={{ height: "150px" }}></source>
                                </video>
                            </div>
                            <p className='text-center overflow-auto mt-2'>{songName}</p>
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
 
export default SongModal;