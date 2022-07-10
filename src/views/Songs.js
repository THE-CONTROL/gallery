import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SongModal from '../Modals/SongModal'
import DelSongModal from '../Modals/DelSongModal';

const Songs = (props) => {
    const navigate = useNavigate()
    const [ songModal, setSongModal ] = useState(false)
    const [ songArray, setSongArray ] = useState([  ])
    const [ delSongModal, setDelSongModal ] = useState(false)
    const [ delSongId, setDelSongId ] = useState()
    const [ pagesInfo, setPagesInfo ] = useState({})
    const [ pageNumbers, setPageNumbers ] = useState([])
    const [ play, setPlay ] = useState("")
    const [ playName, setPlayName ] = useState("")
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const showModal = () => {
        setSongModal(true)
        setDelSongModal(false)
    }

    const hideModal = () => {
        setSongModal(false)
    }

    const showDelSongModal = (id) => {
        setDelSongId(id)
        setSongModal(false)
        setDelSongModal(true)
    }

    const hideDelSongModal = () => {
        setDelSongModal(false)
        setDelSongId()
    }

    const setPlayFunc = (song, name) => {
        setPlay(song)
        setPlayName(name)
    }

    const range = (start, end) => {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }

    const getSongs = (page) => {
        startGettingData()
        window.scrollTo(0, 0)
        fetch("https://lawson.pythonanywhere.com/songs/all", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                page: page
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setSongArray(data.result)
            setPagesInfo(data.meta)
            setPageNumbers(range(1, data.meta.pages))
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
            getSongs(1)
        }
    }, [props.loggedIn, songModal, delSongModal])
    
    return ( 
        <div className='container-sm min-vh-100'>
            {!songModal && !delSongModal && <div className='w-100 m-auto'>
                <h2 className='text-dark text-center'>
                    Songs
                </h2>
                {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                {gettingData !== "Loading..." && <div className='w-100'>
                    {songArray.length > 0 && <div className='shadow-lg w-100 mt-3 pb-2'>
                        <div className="w-100 d-flex justify-content-center p-3 rounded-lg 
                        flex-wrap">
                            {songArray.map((songObject) => (
                            <div className='col-8 col-sm-5 col-md-3 m-4 shadow p-1'
                            key={songObject.id}>
                                <video className='w-100 bg-dark rounded shadow-sm' onClick={() => 
                                    {setPlayFunc(songObject.song, songObject.song_name)}}> 
                                    <source src={songObject.song} alt={songObject.song} 
                                    style={{ height: "150px" }}></source>
                                </video>
                                <p className='text-center overflow-auto'>{songObject.song_name}</p>
                                <div className='container w-100 d-flex justify-content-center'>
                                    <button className="btn-sm btn-danger mt-1" type="button"
                                    onClick={() => {showDelSongModal(songObject.id)}}>Delete</button>
                                </div>
                            </div>))}
                        </div>
                        {!play && <p className='h6 text-center'>Click song to play...</p>}
                    </div>}
                    {songArray.length === 0 && <p className='text-center h6'>No songs yet...</p>}
                    <div className='container d-flex justify-content-center w-100 mt-2'>
                        {play && <div className='col-12 col-sm-10 col-md-8 text-center'>
                            <iframe className="w-100 rounded shadow" src={play} title={play}>
                            </iframe>
                            <p className='overflow-auto'>{playName}</p>
                        </div>}
                    </div>
                    <div className='container d-flex justify-content-center mt-3'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {pagesInfo.has_prev && <li className="page-item" onClick={() => 
                                {getSongs(pagesInfo.prev_page)}}><p className="page-link">Previous</p></li>}
                                {pageNumbers.map((page) => (
                                    <li className="page-item" key={page} onClick={() => {getSongs(page)}}>
                                        <p className="page-link">{page}</p></li>
                                ))}
                                {pagesInfo.has_next && <li className="page-item" onClick={() => 
                                {getSongs(pagesInfo.next_page)}}><p className="page-link">Next</p></li>}
                            </ul>
                        </nav>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                        <button className="btn-sm btn-btn btn-success mb-5"
                        onClick={showModal}>Add Song</button>
                    </div>
                </div>}
            </div>}
            {songModal &&  !delSongModal && <SongModal hideModal={hideModal} showFlash={props.showFlash}/>}
            {delSongModal && !songModal && <DelSongModal hideDelSongModal={hideDelSongModal} showFlash={props.showFlash}
            delSongId={delSongId}/>}
        </div>
     );
}
 
export default Songs;