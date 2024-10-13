import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom';
// import Login from './Components/Login';
import Login2 from './Components/login2';
import ResetPasswordForm from './Components/reset-password';

import Profile from './Components/Profile';
import axios from 'axios';
// import CompleteProfile from './Components/handle-profile';
import { getToken, isTokenValid } from './Components/auth';
import Crud from './Components/Crud';
import { Modals } from './Components/Modals';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { tryReLog } from './Components/apiService';
// import { createStore } from 'react-redux';
// import rootReducer from './reducers'
const token = getToken();
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};


const Registration = () => {
  const query = useQuery();
  const token = query.get('token');
  console.log('Token:', token);

  return (
      <div>
          {token ? <ResetPasswordForm token={token} /> : <p>No token provided</p>}
      </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  //PopUp part
  const [showPopup, setShowPopup] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${window.env.url}/checkAuth`, { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated);
        
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();

    const token = getToken();
    // if(token && isTokenValid(token)){
    //   setIsAuthenticated(true);
    //   <Navigate to="/profile" />
    // }else{
    //   setLoading(false);
    //   <Navigate to="/" />
    // }
    if(token)
    {
      const decoded=jwtDecode(token);
      const currTime = Date.now() / 1000;
      if (decoded.exp < currTime) {
        // window.location.href="http://localhost:3000"
      }
      else{
        const remainingTime = (decoded.exp - currTime) * 1000;
          // const popupTime = remainingTime - 60000;
          const remainingTimeInMinutes = Math.floor((decoded.exp - currTime) / 60);
          // setRemainingMinutes(remainingTimeInMinutes);
          console.log(remainingTimeInMinutes);//39 minutes
          const popupTime = remainingTime - 60000; //
          if (popupTime > 0) {
            setTimeout(() => {
              setShowPopup(true);
            }, popupTime)
          }
      }
    }
    if(token && isTokenValid(token))
    {
      setIsAuthenticated(true);
      <Navigate to="/profile" />
    }
    else
    {
      // window.location.href="http://localhost:3000"
    }
  }, [token]);

  const handleLogout=()=>{
    Cookies.remove("token");
    console.log(document.cookie);
    // navigate('/');
    window.location.href = "http://localhost:3000";
  }

  const handleContinue=()=>{
    setShowPopup(false);
    tryReLog(token)
    setIsAuthenticated(true);
  }


  return (
    <>
    {showPopup && (
      <Modals onContinue={handleContinue} onLogout={handleLogout}/>
    )}
    <BrowserRouter>
    <Routes>
    <Route path="/" element={isTokenValid(getToken()) ? <Navigate to="/profile" /> : <Login2 />} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      {/* <Route path="/gptIntegration" element={<GptIntegration/>}/> */}
      <Route path="/crud" element={<Crud/>}/>
      {/* <Route path="/resumeMaker" element={<ResumeMaker/>}/> */}
      {/* <Route path="/templateSelection" element={<TemplateSelection/>}/> */}
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
