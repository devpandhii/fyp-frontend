import React, { useState, useEffect } from 'react';
// import './login.css';
import './login2.css'
import {FaEyeSlash, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios, { all } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { tryLogin } from './apiService';
import { apiClient, encryptData } from './encryption';
import { validateEmail, validatePassword, validateUname, validateIdentifier } from './regex';
import { successAlert, errorAlert, CustomAlert } from './alerts';
import './alerts.css';
import CryptoJS from 'crypto-js';
import localhost from './env';
import Loader from './Loader';

const Login2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [token, setToken] = useState('');
    const [errorsArray, setErrorsArray] = useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reset = params.get('reset');
        const token = params.get('token');

        if (reset === 'true' && token) {
            setIsResetPassword(true);
            setToken(token);
            // verifyToken(token);
        }
    }, [location.search]);


    const loginCheck = async (encryptedData) => {
        const response = await fetch(`${localhost.url}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedData }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user)); // Assuming user data is in response
            // Redirect to home page
            window.location.href = '/profile';
        } else {
            // Handle login error
            alert(data.message);
        }
    };

    // const url = "http://localhost:5000";

    //Forget Password
    const [resetPass, setResetPass] = useState("Registration");
    const [isForgetPass, setIsForgetPass] = useState(false);

    //Success Login
    const [isLogin, setIsLogin] = useState('');
    const [isReg, setIsReg] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })


    const forgetLink = () => {
        setAction(" active ");
        setResetPass("Forget Password");
        setIsForgetPass(true);
        setFormValues({ email: '' });
    }

    const [action, setAction] = useState("");
    const registerLink = () => {
        setErrorsArray([]);
        setShowAlert(false);
        setAction(" active ");
    }
    const loginLink = () => {
        setErrorsArray([]);
        setShowAlert(false);
        setAction("");
        setResetPass("Registration")
    }

    const [formValues, setFormValues] = useState({
        uname: '',
        password: '',
        email: '',
    });

    const [errors, setErrors] = useState({
        uname: '',
        password: '',
        email: ''
    });

    const [type, setType] = useState('password');

    const togglePasswordVisibility = () => {
        if (type === 'password') {
            setType('text');
        }
        if (type === 'text') {
            setType('password');
        }
    }
    

    const [message, setMessage] = useState('');
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const googleAuth = () => {
        setIsGoogleAuth(true);
        const googleLoginWindow = window.open(`${localhost.url}/auth/google`, "_self");

        // Function to check if the Google login was successful
        const checkGoogleLogin = () => {
            // Use a timeout to periodically check the status of the login window
            const checkInterval = setInterval(async () => {
                try {
                    // Fetch the status from the backend
                    const response = await fetch(`${localhost.url}/auth/google/status`, {
                        credentials: 'include'
                    });
                    const result = await response.json();

                    if (result.message === 'Successful Google login') {
                        clearInterval(checkInterval);
                        // Navigate to /home
                        window.location.href = 'http://localhost:3000/profile';
                    }
                } catch (error) {
                    console.error('Error checking Google login status:', error);
                }
            }, 1000); // Check every second
        };

        // Start checking the login status
        checkGoogleLogin();
    };



    // const SECRET_KEY = 'a3bce21f8a2d9e1f4c3e5f6789abdef01234567890abcdef1234567890abcdef';

    // const encryptData = (data) => {
    //     return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    // };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    // const newHandleBlur=(e)=>{
    //     const { name, value } = e.target;
    //     if(name==="identifier" && value=='')
    //     {
    //         setErrors({ ...errors, [name]: "Please enter your email or phone number" });
    //     }
    // }

    const handleBlurNew = (e) => {
        // setTimeout(() => {
        const { name, value } = e.target;
        let errorMessage = '';
        const updatedErrorsArray = [...errorsArray];
        const validations = {
            identifier: {
                isValid: validateIdentifier(value),
                message: 'Enter a valid username (at least 3 characters)',
            },
            password: {
                isValid: validatePassword(value),
                message: 'Password should contain minimum 8 characters and atleast 1 Number and 1 Special Character',
            },
            email: {
                isValid: validateEmail(value),
                message: 'Enter valid email address',
            },
            uname: {
                isValid: validateIdentifier(value),
                message: 'Enter a valid username (at least 3 characters)',
            }
        };

        // Check validation based on the input name
        if (validations[name]) {
            const { isValid, message } = validations[name];
            errorMessage = !isValid ? message : '';

            const errorIndex = updatedErrorsArray.indexOf(message);

            if (!isValid && errorIndex === -1) {
                // Add error if not exis
                updatedErrorsArray.push(message);
            } else if (isValid && errorIndex !== -1) {
                // Remove error message if validation succeeds and it's in the array
                updatedErrorsArray.splice(errorIndex, 1);
            }
        }

        // Set the updated errors array
        setErrorsArray(updatedErrorsArray);

        // Display alert with error messages
        if (updatedErrorsArray.length > 0) {
            setResponseMessage(updatedErrorsArray.join(' \n '));
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
        // }, 250);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const unameValid = validateUname(formValues.uname);
        const identifierValid = validateIdentifier(formValues.identifier);
        const passwordValid = validatePassword(formValues.password);
        const emailValid = validateEmail(formValues.email);
        let username = formValues.uname;
        let email = formValues.email;
        let password = formValues.password;
        // const encryptedData = encryptData({username,email,password});
        // console.log(encryptedData);



        if (isForgetPass) {
            setErrors({
                email: !emailValid ? 'Enter a valid email address' : '',
            });

            if (onclick={handleForgetpass} && emailValid) {
                let email = formValues.email
                const encryptedData = (email);
                console.log("enc email: ",encryptedData);
                setLoading(true);
                try {
                    const res = await apiClient.post(`${localhost.url}/forget-pass`, {
                        email: formValues.email
                    })
                        .then(result => {
                            console.log(result);
                            if(result.data.message === "Email sent successfully"){
                                setResponseMessage('Email sent Successfully');
                                setIsEmail(true);
                                setShowAlert(true);
                                setAction("");
                                setFormValues({email: ''});
                                setTimeout(() => {
                                setLoading(false);  
                                    handleSignInClick();
                                }, 3000);

                            }
                            else{
                                setLoading(false);
                                setResponseMessage('Invalid Email');
                                setIsEmail(true);
                                setShowAlert(true);
                                setAction("");
                                setTimeout(() => {
                                    setShowAlert(false);
                                }, 2000);
                            }
                            
                        })
                        .catch(error => {
                            setLoading(false);
                            console.log(error);
                            setIsEmail(false);
                            setShowAlert(true);
                            setResponseMessage('Error Sending Email');
                        })

                    // localStorage.setItem('token', res.data.token);
                    // setMessage('Login Successful');
                } catch (error) {
                    // console.error('Error Logging In:', error.response ? error.response.data : error.message);
                    setLoading(false);
                    setMessage('Error Logging In');
                    setIsEmail(false);
                    setShowAlert(false);
                    setResponseMessage('Error Sending Email');
                }
            }
        } else {

            if (unameValid && emailValid && passwordValid) {
                setLoading(true);
                try {
                    const res = await apiClient.post(`${localhost.url}/Registration`, {
                        username: formValues.uname,
                        email: formValues.email,
                        password: formValues.password
                    });
                    // const res = await axios.post(`${localhost.url}/Registration`, {data : encryptedData}, {withCredentials: true});
                    console.log("apiClient response: ",res);
                    if (res.data.message === 'Username already exists') {
                        setLoading(false);
                        setResponseMessage('Username Already Exists');
                        setShowAlert(true);
                        setMessage(res.data.message);

                    }
                    else if (res.data.message === 'Form submitted') {
                        setShowAlert(true);
                        setIsReg(true);
                        setResponseMessage('Registration Successful');
                        setTimeout(() => {
                            setLoading(false);
                            setShowAlert(false);
                            setAction("");
                            setFormValues({ uname: '', email: '', password: '' });
                            handleSignInClick();
                        }, 3000);


                    }
                    setMessage(res.data.message);
                    // console.log("Form Submitted Successfully");
                    // setShowAlert(true);

                } catch (err) {
                    setLoading(false);
                    setMessage(err.response.data.message || 'Server Error');
                    setIsReg(false);

                }
            }
            else {

                const allEmpty = [];
                if (onclick = { googleAuth }) {
                    setShowAlert(false);
                }
                if (!unameValid) {
                    allEmpty.push('Username should contain atleast 3 characters \n');
                }
                if (!passwordValid) {
                    allEmpty.push('Password should contain minimum 8 characters and atleast 1 Number and 1 Special Character \n');
                }
                if (!emailValid) {
                    allEmpty.push('Enter a valid email address \n');
                }

                setShowAlert(true);
                setIsReg(false);
                setResponseMessage(allEmpty.join(''));

            }
        }
        // document.getElementById('register-form').reset();
        // setFormValues({ identifier: '', email: '', username: '', password: '' });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const identifierValid = validateIdentifier(formValues.identifier);
        const passwordValid = validatePassword(formValues.password);
        let username = formValues.identifier;
        let password = formValues.password;
        // const encryptedData = ({ uname, upass });

        // await loginCheck(encryptedData);

        // setShowAlert(false);
        // if(onclick={googleAuth}){
        //     setShowAlert(false);
        // }
        if (!formValues.identifier || !formValues.password) {
            const err = [];
            if (isGoogleAuth) {
                setShowAlert(false);
            } else {
                if (!formValues.identifier) {
                    err.push("Please enter username \n");
                }
                if (!formValues.password) {
                    err.push("Please enter password \n");
                }
                setShowAlert(true);
                setResponseMessage(err);
            }
            
        }
        else if(!identifierValid || !passwordValid){
            const err = [];
            if(!identifierValid){
                err.push("Enter a valid username (at least 3 characters)\n");
            }
            if(!passwordValid){
                err.push("Password should contain minimum 8 characters and atleast 1 Number and 1 Special Character");
            }
            setShowAlert(true);
            setResponseMessage(err);
        }
        else {
            if (identifierValid && passwordValid) {
                try {
                    setLoading(true);
                    const msgCall = await tryLogin(username,password);
                    console.log(msgCall);
                    if (msgCall.status === "success") {
                        setShowAlert(true);
                        setIsLogin(true);
                        // setResponseMessage(msgCall.status);
                        setResponseMessage('Successful Login');
                        setTimeout(() => {
                            setLoading(false);
                            setShowAlert(false);// navigate('/home');
                            setFormValues({ identifier: '', email: '', username: '', password: '' });
                            
                            navigate('/profile');
                        }, 3000);
                        // setErrorsArray('');
                    } else if (msgCall === "Incorrect password") {
                        setLoading(false);
                        setShowAlert(true);
                        setIsLogin(false);
                        setResponseMessage(msgCall);




                    } else {
                        setShowAlert(true);
                        setLoading(false);
                        setIsLogin(false);
                        setResponseMessage(msgCall);
                    }

                }
                catch (error) {
                    setIsLogin(false);
                    setLoading(false);
                    setResponseMessage("Server Error");
                    setShowAlert(false);
                }
            }
        }


    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSignUpClick = () => {
        setTimeout(() => {
            setIsSignUp(true);
            setShowAlert(false);
            setFormValues({ identifier: '', uname: '', email: '', password: '' });
            setErrorsArray([]);
            setAction(" active ");
            setType('password');
            setLoading(false);
        }, 500);
        setLoading(true)
    };

    const handleSignInClick = () => {
        setTimeout(() => {
            setIsSignUp(false);
            setResetPass("Registration");
            setShowAlert(false);
            setFormValues({ identifier: '', uname: '', email: '', password: '' });
            setErrorsArray([]);
            setAction("");
            setType('password');
            setIsForgetPass(false);
            setLoading(false);
        }, 500);
        setLoading(true);

    };


    const handleForgetpass = () => {
        setTimeout(() => {
            forgetLink();
            setErrorsArray([]);
            setShowAlert(false);
            setIsSignUp(true);
            setLoading(false);
        }, 500);
        setLoading(true);

        
    }


    return (
        <>
        {loading &&(
        <Loader/>)
        }
            <div className="formbody">
                <div className="alert-div">
                    {showAlert && (
                        <CustomAlert
                            variant={responseMessage.includes('Success') ? "success" : "danger"}
                            message={responseMessage}
                            onClose={() => { setShowAlert(false); setErrorsArray([]) }}
                        />
                    )}
                </div>
                <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
                    <div className="form-container sign-up-container">
                        <form action="" onSubmit={handleSubmit} id='register-form'>
                            <h1 id='forget-reg-h1'>{resetPass}</h1>
                            {resetPass === 'Forget Password' ?
                                <>
                                    <input
                                        type="email" name="email" id='forget-email' placeholder="Enter Your Email" autoComplete='off' value={formValues.email}
                                        onChange={handleChange}
                                        onBlur={handleBlurNew} />
                                    {/* <Falocalhostelope className='icon' /> */}

                                    <button className="submit" id='forget-submit-btn'>Send Email</button>
                                    {/* <p id='forget-link-p'>Go to Login? <a id='resetpass-link' onClick={loginLink}>Click here</a></p> */}

                                </> : <>
                                    <input type="text" placeholder="Enter Username" name='uname' autoComplete='off' value={formValues.uname} onChange={handleChange} onBlur={handleBlurNew} />
                                    <input type="email" name='email' placeholder="Enter Email" value={formValues.email} autoComplete='off' onChange={handleChange} onBlur={handleBlurNew} />
                                    <input type={type} name='password' placeholder="Enter Password" autoComplete='off' value={formValues.password} onChange={handleChange} onBlur={handleBlurNew} />
                                    {type === 'password' ? (<FaEyeSlash className='icon' id='eye-slash' onMouseDown={togglePasswordVisibility} />) : (<FaEye className='icon' id='eye' onMouseDown={togglePasswordVisibility} />)}
                                    <button type='submit' onMouseDown={handleSubmit} id='sign-up-btn'>Sign Up</button></>}
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form action="/" onSubmit={handleLogin} id='login-form'>
                            <h1>Login</h1>
                            <div className="social-container">
                                <div className="google-signin">
                                    <button type='button' onClick={googleAuth} id='google-button'>Sign-In with Google</button>
                                    <FcGoogle className='google-icon' />
                                </div>
                                <hr />
                            </div> 
                            <span>or use your account</span>
                            <input type="text" id='login-textfield' placeholder="Enter Username" name='identifier' value={formValues.identifier} onChange={handleChange} onBlur={handleBlurNew} autoComplete='off' />
                            <input type={type} placeholder="Enter Password" name='password' value={formValues.password} onChange={handleChange} onBlur={handleBlurNew} />
                            {type === 'password' ? (<FaEyeSlash className='icon' id='eye-slash' onMouseDown={togglePasswordVisibility} />) : (<FaEye className='icon' id='eye' onMouseDown={togglePasswordVisibility} />)}
                            {/* <FaLock className='icon' /> */}

                            <a id='forget-link' onMouseDown={handleForgetpass}>Forgot Password?</a>
                            <button type='submit' onMouseDown={handleLogin} id='sign-in-btn'>Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Go Back To Login!</h1>
                                <p>If you have already Registered, Please go to Login page</p>
                                <button className="ghost" onClick={handleSignInClick}>Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start your journey with us</p>
                                <button className="ghost" onMouseDown={handleSignUpClick}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login2;
