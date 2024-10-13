import React from 'react';
import './login2.css';

function Modals({ onContinue, onLogout }) {
  return (
    <div className='mainBody'>
      <div className="card-pop">
        <div className="content-wrapper">
          <h2 className="heading">Session Expiry</h2>
          <p>Your session is about to expire. Do you want to continue or logout?</p>
        </div>
        <button className="btn btn-success" onClick={onContinue}>Continue</button>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export { Modals };
