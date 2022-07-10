import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoModal from '../Modals/VideoModal'
import DelVideoModal from '../Modals/DelVideoModal';
import VideoFullscreen from '../Modals/VideoFullscreen';

const Videos = (props) => {
    const navigate = useNavigate()
    const [ videoModal, setVideoModal ] = useState(false)
    const [ videoArray, setVideoArray ] = useState([  ])
    const [ delVideoModal, setDelVideoModal ] = useState(false)
    const [ delVideoId, setDelVideoId ] = useState()
    const [ pagesInfo, setPagesInfo ] = useState({})
    const [ pageNumbers, setPageNumbers ] = useState([])
    const [ fullscreen, setFullscreen ] = useState(false)
    const [ gettingData, setGettingData ] = useState()

    const startGettingData = () => {
        setGettingData("Loading...")
    }

    const stopGettingData = () => {
        setGettingData()
    }

    const showModal = () => {
        setVideoModal(true)
        setDelVideoModal(false)
        setFullscreen(false)
    }

    const hideModal = () => {
        setVideoModal(false)
    }

    const showDelvideoModal = (id) => {
        setDelVideoId(id)
        setVideoModal(false)
        setFullscreen(false)
        setDelVideoModal(true)
    }

    const hideDelVideoModal = () => {
        setDelVideoModal(false)
        setDelVideoId()
    }

    const showFullscreen = (id) => {
        setDelVideoId(id)
        setFullscreen(true)
        setVideoModal(false)
        setDelVideoModal(false)
    }

    const hideFullscreen = () => {
        setFullscreen(false)
        setDelVideoId()
    }

    const range = (start, end) => {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }

    const getVideos = (page) => {
        startGettingData()
            window.scrollTo(0, 0)
        fetch("https://lawson.pythonanywhere.com/videos/all", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                page: page
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setVideoArray(data.result)
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
            getVideos(1)
        }
    }, [props.loggedIn, videoModal, delVideoModal])
    
    return ( 
        <div className='container-sm min-vh-100'>
            {!videoModal && !delVideoModal && !fullscreen && <div className='w-100 m-auto'>
                <h2 className='text-dark text-center'>
                    Videos
                </h2>
                {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                {gettingData !== "Loading..." && <div className='w-100'>
                    {videoArray.length > 0 && <div className='shadow-lg w-100 mt-3 pb-2'>
                        <div className="w-100 d-flex justify-content-center p-3 rounded-lg 
                        flex-wrap mb-3">
                            {videoArray.map((videoObject) => (
                            <div className='col-8 col-sm-5 col-md-3 m-4 shadow p-1'
                            key={videoObject.id}>
                                <video className='w-100 bg-dark rounded shadow-sm' onClick={() => 
                                    {showFullscreen(videoObject.id)}}> 
                                    <source src={videoObject.video} alt={videoObject.video} 
                                    style={{ height: "150px" }}></source>
                                </video>
                                <p className='text-center overflow-auto'>{videoObject.video_name}</p>
                                <div className='container w-100 d-flex justify-content-center'>
                                    <button className="btn-sm btn-danger mt-1" type="button"
                                    onClick={() => {showDelvideoModal(videoObject.id)}}>Delete</button>
                                </div>
                            </div>))}
                        </div>
                        <p className='text-center h6'>Click video to play...</p>
                    </div>}
                    {videoArray.length === 0 && <p className='text-center h6'>No videos yet...</p>}
                    <div className='container d-flex justify-content-center mt-3'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {pagesInfo.has_prev && <li className="page-item" onClick={() => 
                                {getVideos(pagesInfo.prev_page)}}><p className="page-link">Previous</p></li>}
                                {pageNumbers.map((page) => (
                                    <li className="page-item" key={page} onClick={() => {getVideos(page)}}>
                                        <p className="page-link">{page}</p></li>
                                ))}
                                {pagesInfo.has_next && <li className="page-item" onClick={() => 
                                {getVideos(pagesInfo.next_page)}}><p className="page-link">Next</p></li>}
                            </ul>
                        </nav>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                        <button className="btn-sm btn-btn btn-success mb-5"
                        onClick={showModal}>Add video</button>
                    </div>
                </div>}
            </div>}
            {videoModal &&  !delVideoModal && <VideoModal hideModal={hideModal} showFlash={props.showFlash}/>}
            {delVideoModal && !videoModal && <DelVideoModal hideDelVideoModal={hideDelVideoModal} 
            showFlash={props.showFlash} delVideoId={delVideoId}/>}
            {fullscreen && !videoModal && !delVideoModal && <VideoFullscreen hideFullscreen={hideFullscreen}
            delVideoId={delVideoId}/>}
        </div>
     );
}
 
export default Videos;