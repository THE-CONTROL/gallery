import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageModal from '../Modals/ImageModal'
import DelModal from '../Modals/DelModal';
import Fullscreen from '../Modals/Fullscreen';

const Images = (props) => {
    const navigate = useNavigate()
    const [ imageModal, setImageModal ] = useState(false)
    const [ imageArray, setImageArray ] = useState([  ])
    const [ delModal, setDelModal ] = useState(false)
    const [ delImageId, setDelImageId ] = useState()
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
        setImageModal(true)
        setDelModal(false)
        setFullscreen(false)
    }

    const hideModal = () => {
        setImageModal(false)
    }

    const showDelModal = (id) => {
        setDelImageId(id)
        setImageModal(false)
        setFullscreen(false)
        setDelModal(true)
    }

    const hideDelModal = () => {
        setDelModal(false)
        setDelImageId()
    }

    const showFullscreen = (id) => {
        setDelImageId(id)
        setFullscreen(true)
        setImageModal(false)
        setDelModal(false)
    }

    const hideFullscreen = () => {
        setFullscreen(false)
        setDelImageId()
    }

    const range = (start, end) => {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }

    const getImages = (page) => {
        startGettingData()
        window.scrollTo(0, 0)
        fetch("https://lawson.pythonanywhere.com/images/all", {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                page: page
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setImageArray(data.result)
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
            getImages(1)
        }
    }, [props.loggedIn, imageModal, delModal])
    
    return ( 
        <div className='container-sm min-vh-100'>
            {!imageModal && !delModal && !fullscreen && <div className='w-100 m-auto'>
                <h2 className='text-dark text-center'>
                    Images
                </h2>
                {gettingData === "Loading..." && <p className='text-center'>{gettingData}</p>}
                {gettingData !== "Loading..." && <div className='w-100'>
                    {imageArray.length > 0 && <div className='shadow-lg w-100 mt-3 pb-2 mb-3'>
                        <div className="w-100 d-flex justify-content-center p-3 rounded-lg 
                        flex-wrap">
                            {imageArray.map((imageObject) => (
                            <div className='col-8 col-sm-5 col-md-3 m-4 shadow p-1'
                            key={imageObject.id}>
                                <img src={imageObject.image} className="w-100 rounded shadow-sm" 
                                alt={imageObject.image} style={{ height: "150px" }}
                                onClick={() => {showFullscreen(imageObject.id)}}/>
                                <div className='container w-100 d-flex justify-content-center'>
                                    <button className="btn-sm btn-danger mt-1" type="button"
                                    onClick={() => {showDelModal(imageObject.id)}}>Delete</button>
                                </div>
                            </div>))}
                        </div>
                        <p className='h6 text-center'>Click image to view...</p>
                    </div>}
                    {imageArray.length === 0 && <p className='text-center h6'>No images yet...</p>}
                    <div className='container d-flex justify-content-center'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {pagesInfo.has_prev && <li className="page-item" onClick={() => 
                                {getImages(pagesInfo.prev_page)}}><p className="page-link">Previous</p></li>}
                                {pageNumbers.map((page) => (
                                    <li className="page-item" key={page} onClick={() => {getImages(page)}}>
                                        <p className="page-link">{page}</p>
                                    </li>))}
                                {pagesInfo.has_next && <li className="page-item" onClick={() => 
                                {getImages(pagesInfo.next_page)}}><p className="page-link">Next</p></li>}
                            </ul>
                        </nav>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                        <button className="btn-sm btn-btn btn-success mb-5"
                        onClick={showModal}>Add Image</button>
                    </div>
                </div>}
            </div>}
            {imageModal &&  !delModal && !fullscreen && <ImageModal hideModal={hideModal} 
            showFlash={props.showFlash}/>}
            {delModal && !imageModal && !fullscreen && <DelModal hideDelModal={hideDelModal} 
            showFlash={props.showFlash} delImageId={delImageId}/>}
            {fullscreen && !imageModal && !delModal && <Fullscreen hideFullscreen={hideFullscreen}
            delImageId={delImageId}/>}
        </div>
     );
}
 
export default Images;