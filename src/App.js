import React, { useEffect, useState } from 'react';
import NavBar from './component/NavBar';
import Flash from './component/Flash';
import LogIn from './Auth/LogIn'
import SignUp from './Auth/SignUp'
import UpdateUser from './Auth/UpdateUser'
import Images from './views/Images'
import Songs from './views/Songs'
import Videos from './views/Videos'
import Profile from './views/Profile'
import Footer from './component/Footer';
import Error from './views/Error';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [ loggedIn, setIsLoggedIn ] = useState(false)
  const [ flash, setFlash ] = useState("")
  const [ flashState, setFlashState ] = useState(true)
  const [ showApp, setShowApp ] = useState(false)

  const showAppFunc = () => {
    setShowApp(true)
  }

  const removeFlash = () => {
    setFlash("")
  }

  const showFlash = (message, state) => {
    setFlash(message)
    setFlashState(state)
  }

  const isLoggedInTrue = () => {
    setIsLoggedIn(true)
  }

  const logOut = () => {
    localStorage.clear()
    setFlash("Logout Successful!", true)
    setIsLoggedIn(false)
  }

  const getToken = () => {
    fetch("https://lawson.pythonanywhere.com/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem('refresh-token')}`,
      }
    })
    .then(resp => resp.json())
    .then((data) => {
      if (data.access) {
        localStorage.setItem("access-token", data.access)
      }
      else {
        setIsLoggedIn(false)
        localStorage.clear()
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (localStorage.getItem("refresh-token")) {
      isLoggedInTrue()
      getToken()
      setInterval(getToken, 240000)
    }
    setTimeout(showAppFunc, 3000)
  }, [])

  return (
    <Router>
      {showApp && <div className="container-sm-fluid" style={{ paddingTop: "70px" }}>
        <NavBar loggedIn={loggedIn} logOut={logOut}/>
        <Flash flash={flash} removeFlash={removeFlash} flashState={flashState}/>
        <Routes>
          <Route exact path="/login" element={<LogIn showFlash={showFlash}
          isLoggedInTrue={isLoggedInTrue}/>}></Route>
          <Route exact path="/register" element={<SignUp showFlash={showFlash}
          isLoggedInTrue={isLoggedInTrue}/>}></Route>
          <Route exact path="/update" element={<UpdateUser showFlash={showFlash}
          isLoggedInTrue={isLoggedInTrue}/>}></Route>
          <Route exact path="/" element={<Profile showFlash={showFlash}
          loggedIn={loggedIn} logOut={logOut}/>}></Route>
          <Route exact path="/images" element={<Images showFlash={showFlash}
          loggedIn={loggedIn}/>}></Route>
          <Route exact path="/songs" element={<Songs showFlash={showFlash}
          loggedIn={loggedIn}/>}></Route>
          <Route exact path="/videos" element={<Videos showFlash={showFlash}
          loggedIn={loggedIn}/>}></Route>
          <Route path="*" element={<Error/>}></Route>
        </Routes>
        <Footer/>
      </div>}
      {!showApp && <div className='container-fluid vh-100 bg-dark pt-5'>
        <h1 className='h2 text-center text-light'>CONTROL</h1>
      </div>}
    </Router>
  );
}

export default App;
