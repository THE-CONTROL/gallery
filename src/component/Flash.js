import React from 'react';

const NavBar = (props) => {
  return (
    <div>
        {props.flash && <div className="container-fluid">
            {!props.flashState && <div className="alert alert-warning" role="alert">
                {props.flash}
                <button type="button" className="btn-close float-end" onClick={props.removeFlash}
                aria-label="Close"></button>
            </div>}
            {props.flashState && <div className="alert alert-success" role="alert">
                {props.flash}
                <button type="button" className="btn-close float-end" onClick={props.removeFlash}
                aria-label="Close"></button>
            </div>}
        </div>}
    </div>
  );
}

export default NavBar;