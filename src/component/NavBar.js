import React from 'react';
import { Link } from "react-router-dom";

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
        <div className="container-fluid">
        <h1 className="navbar-brand text-primary">GALLERY</h1>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
        data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              {props.loggedIn && <li className="nav-item">
                <Link to="/" className="nav-link">Profile</Link>
              </li>}
              {!props.loggedIn && <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>}
              {!props.loggedIn && <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>}
              {props.loggedIn && <li className="nav-item">
                <Link to="/images" className="nav-link">Images</Link>
              </li>}
              {props.loggedIn && <li className="nav-item">
                <Link to="/songs" className="nav-link">Songs</Link>
              </li>}
              {props.loggedIn && <li className="nav-item">
                <Link to="/videos" className="nav-link">Videos</Link>
              </li>}
              {props.loggedIn && <li className="nav-item" onClick={props.logOut}>
                <Link to="/login" className="nav-link">Logout</Link>
              </li>}
            </ul>
          </div>
        </div>
    </nav>
  );
}

export default NavBar;