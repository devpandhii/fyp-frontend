import React from 'react'
import Alert from 'react-bootstrap/Alert';
import './alerts.css';

const successAlert=(message)=>{
    return(
        <Alert variant='success' className="alerts" dismissible>
        {message}
      </Alert>
    );
};

const errorAlert=(message)=>{
    return(
        <Alert variant='danger' className="alerts" dismissible>
         {message}
        </Alert>
    )
}


const CustomAlert = ({ variant, message, onClose }) => {
    return (
      <Alert variant={variant} className="alerts" onClose={onClose} dismissible>
        {message}
      </Alert>
    );
  };
export {successAlert,errorAlert,CustomAlert}
