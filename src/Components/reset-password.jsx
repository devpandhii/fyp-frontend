import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import './resetpass.css';
import { Alert } from 'bootstrap';
import { tryUpdate2 } from './apiService';
import { jwtDecode } from 'jwt-decode';
import localhost from './env';
import { CustomAlert } from './alerts';
import Cookies from 'js-cookie';

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    console.log("Token is equal to: ", token);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('password');
    const [showAlert, setShowAlert] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reset = params.get('reset');
        const token = params.get('token');

        if (reset === 'true' && token) {
            // setIsResetPassword(true);
            // setToken(token);
            verifyToken(token);
        }
    }, [location.search]);

    const togglePasswordVisibility = () => {
        if (type === 'password') {
            setType('text');
        }
        if (type === 'text') {
            setType('password');
        }
    }

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`http://localhost:5000/verify-reset-token?token=${token}`);
            const data = await response.json();
            console.log('Data: ',data);

            if (data.valid) {
                // setIsResetPassword(true);
                // setMessage('Token is valid. You can reset your password.');
                setResponseMessage('Token is Valid. You can reset your password.');
                setShowAlert(true);
            } else {
                setResponseMessage('Session expired. Please request a new reset link.');
                // setMessage('Session expired. Please request a new reset link.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            setMessage('An error occurred while verifying the token.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setResponseMessage("Password Do Not Match");
            setShowAlert(true);
            console.log("Password Do Not Match");
        }

        if(password == '' || confirmPassword == ''){
            if(password = ''){
                setResponseMessage("Please Enter Password");
                setShowAlert(true);
            }
            if(confirmPassword = ''){
                setResponseMessage("Please Enter Confirm Password");
                setShowAlert(true);
            }
        }

        else {
            try {
                const response = await fetch(`http://localhost:5000/reset-password?token=${token}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });
                const data = await response.json();
                console.log('data: ',data);
                if (response.ok) {
                    setMessage('Password updated successfully.');
                    setResponseMessage("Password Updated Successfully");
                    setShowAlert(true);
                    Cookies.remove("token");
                    // console.log("Deleted Token = ",token);
                    console.log(document.cookie);
                    setTimeout(() => {
                        navigate('/'); // Redirect to login or another appropriate page
                    }, 3000);
                } else {
                    setMessage(data.message || 'Error updating password.');
                    setResponseMessage("Password Not Updated.....an error occured");
                    setShowAlert(true);
                }
            } catch (error) {
                console.error('Error updating password:', error);
                setMessage('An error occurred while updating the password.');
                setResponseMessage("Password Not Updated.....an error occured");
                setShowAlert(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.log("Password Do Not Match");
        }
        // else{
        //     tryUpdate2(password);
        //     console.log(password);
        // }


        else {
            console.log(token);
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            const email = decodedToken.email;
            console.log(email);
            try {
                const response = await axios.put(`http://localhost:5000/reset-password?identifier=${email}`, { password: password });
                setMessage(response.data.message);
            } catch (error) {
                setMessage('Error resetting password');
            }
        }
    };


    return (
        <>
        <div>
            <center>
                    {showAlert && (
                        <CustomAlert
                            variant={responseMessage.includes('Valid' || 'Successfully') ? "success" : "danger"}
                            message={responseMessage}
                            onClose={() => { setShowAlert(false);  }}
                        />
                    )}
                    </center>
                </div>
        <div className='reset-form-container'>
            {token ? (
                <form onSubmit={handlePasswordChange}>
                    <h1>Reset Password</h1>
                    <input
                        type={type}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"

                    />
                    {type === 'password' ? (<FaEyeSlash className='icon' id='eye-slash-reset' onClick={togglePasswordVisibility} />) : (<FaEye className='icon' id='eye-reset' onClick={togglePasswordVisibility} />)}


                    <input
                        type={type}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        

                    />
                    {type === 'password' ? (<FaEyeSlash className='icon' id='eye-slash-reset' onClick={togglePasswordVisibility} />) : (<FaEye className='icon' id='eye-reset' onClick={togglePasswordVisibility} />)}
                    <button type="submit">Reset Password</button>
                </form>
            ) : (
                <p>Invalid or expired token</p>
            )}
            {message && <p>{message}</p>}
        </div>
        </>
    );
};

export default ResetPasswordForm;
