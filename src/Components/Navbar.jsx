import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import localhost from './env';
import './img.css'

function Navbar(props) {
  const navigate=useNavigate();
  const handleLogout=()=>{
    Cookies.remove("token");
    console.log(document.cookie);
    // navigate('/');
    window.location.href = "http://localhost:3000";
  }
  return (
    <>
    <nav className="navbar navbar-expand-lg  navbar-dark profile-nav">
  <a className="navbar-brand" href="#">Final Year Project</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse a-div" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/home">Home <span className="sr-only"></span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/profile">Profile</a>
      </li>
     
      
      {/* <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </li> */}
      {/* <li className="nav-item">
        <a className="nav-link disabled" href="#">Disabled</a>
      </li> */}
    </ul>
      {/* <input className=" mr-sm-2 mx-5" type="search" placeholder="Search" aria-label="Search"/> */}
      
  </div>
  
  <button className="btn my-2 my-sm-0 logout-btn" onClick={handleLogout}>Logout</button>
  <img
        src={`${localhost.imgUrl}/${props.profileImage}`}
        alt="Profile"
        onError={(e) => {
          e.target.src = 'Images/demoImage.jpg'; // Replace with your fallback image
        }}
        className="rounded-circle img-fluid profile-image"
      />
</nav>
    </>
  )
}

export default Navbar;
