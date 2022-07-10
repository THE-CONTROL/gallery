import React from "react";
import errorImage from "../assets/error.jpg"

const Error = () => {
    return ( 
        <div className="container-fluid vh-100 pb-2">
            <img src={errorImage} alt="Error" className="w-100 h-100 shadow-lg"/>
        </div>
     );
}
 
export default Error;