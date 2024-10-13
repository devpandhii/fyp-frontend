import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import {FaEyeSlash, FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { tryReLog, tryUpdate, trySave } from './apiService';
import { CustomAlert } from './alerts';
import { validateEmail, validatePassword, validateAge, validateMobile, validateUname, validateCity } from './regex';
// import { tryUploadImage,tryGetImage } from './imageServices';
import localhost from './env';
import './img.css';
import './login2.css';
import Loader from './Loader';
import { apiClient } from './encryption';
import { decryptData } from './decryption';
import {Modals} from './Modals';
import './nav.css';
// import { encryptData } from './encryption';


function Profile() {

  const [pass, setPass] = useState("password");
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorsArray, setErrorsArray] = useState([]);
  const [usernameAvail, setUserNameAvail] = useState();
  const [unameTemp,setUnameTemp]=useState();
  const [loading,setLoading]=useState(false);



  //Profile Values
  const [profileValues, setProfileValues] = useState({
    username: '',
    email: '',
    pass: '',
    mobile: '',
    age: '',
    city: ''
  })

  //Image
  const [file, setFile] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  //Naviagtor
  const navigate = useNavigate();

  //Cookie Part
  const value = document.cookie;
  console.log("Value variable", value);
  let ogVal = value.split("=");
  const token = ogVal[1];



  //Alerts
  const [showAlert, setShowAlert] = useState(false);
  const [isEmail, setIsEmail] = useState();
  const [isPass, setIsPass] = useState();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if(token)
    {
      fetchData();
    }

    // if (token) {
    //   try {
    //     // alert(token);
    //     const decodedToken = jwtDecode(token);
    //     console.log("This is hard code: ",decodedToken);
    //     const currTime = Date.now() / 1000;
    //     // const currTime=Date.now();
    //     if (decodedToken.exp < currTime) {
    //       // alert("Token Expired");
    //       navigate('/');
    //       Cookies.remove('token');
    //     }
    //     else {
    //       const remainingTime = (decodedToken.exp - currTime) * 1000;
    //       // const popupTime = remainingTime - 60000;
    //       const remainingTimeInMinutes = Math.floor((decodedToken.exp - currTime) / 60);
    //       // setRemainingMinutes(remainingTimeInMinutes);
    //       console.log(remainingTimeInMinutes);//39 minutes
    //       const popupTime = remainingTime - 60000; //
    //       if (popupTime > 0) {
    //         setTimeout(() => {
    //           setShowPopup(true);
    //         }, popupTime)
    //       }
    //     }
    //   }
    //   catch (error) {
    //     console.log(error);
    //     alert("No Token Found");
    //   }
    // }
    fetchData();
  }, [navigate, token]);

  const fetchData = async () => {
    setLoading(true);
    const token = document.cookie;
    const tokensplitter = token.split('=');
    const maintoken = tokensplitter[1];
    
    if (maintoken) {
      try {
        const response = await apiClient.post(`${localhost.url}/verify-token`, { maintoken }, { withCredentials: true });
        console.log('Token verification response:', response.data);
        const decryptedData = decryptData(response.data);
        console.log(decryptedData);
        if (response.data) {
          const { username, email, password, age, mobile, city, profileImage } = decryptedData.decodetoken;
          setProfileValues({
            uname: username || '',
            email: email || '',
            pass: password || '',
            age: age || '',
            mobile: mobile || '',
            city: city || '',
          });
          setProfileImage(profileImage || '');
          console.log(window.env.imgUrl + '/' + profileImage);
          setUserDataLoaded(true);
          setUnameTemp(username);
        } else {
          console.log("Invalid Token");
        }
      } catch (error) {
        console.log('Error Verifying Token',);
      }
      finally
      {
        setLoading(false);
      }
    }
  };

  // const [type, setType] = useState('');
  const togglePasswordVisibility = () => {
    if (pass === 'password') {
        setPass('text');
    }
    if (pass === 'text') {
        setPass('password');
    }
}

  const handleUpdate = () => {
    const inputs = document.querySelectorAll(".disabled-input");
    inputs.forEach(input => {
      input.readOnly = false;
      input.classList.remove("disabled-input");
      input.classList.add("input-editable")
    })
    setPass("text");
  }

  const handleLogout = () => {
    Cookies.remove("token");
    console.log(document.cookie);
    setShowPopup(false);
    navigate('/');
  }

  const handleContinue = () => {
    setShowPopup(false);
    // console.log(token);

    tryReLog(token);
    fetchData();
    console.log(value);

  }

  const handleUpdateDB = async() => {
    const emailvalid = validateEmail(profileValues.email);
    const passwordvalid = validatePassword(profileValues.pass);

    if (usernameAvail === true) {
      if (emailvalid && passwordvalid) {
       const res= await tryUpdate(unameTemp,profileValues.uname, profileValues.email, profileValues.pass,profileValues.age,profileValues.mobile,profileValues.city,token);
        console.log("jhenu22:",res);
        // setBt(res);
        if(res.data.message==="Profile updated Successfully")
        {
        setShowAlert(true);
        setMessage("Data Updated SuccesFully");
        setIsEmail(true);
        setIsPass(true);
        // tryReLog(token)
        }
      }
      else {
        if (!emailvalid && !passwordvalid) {
          setShowAlert(true);
          setIsEmail(false);
          setIsPass(false)
          setMessage("Email and password are Invalid")
        }
        else if (!emailvalid) {
          setShowAlert(true);
          setIsEmail(false)
          setMessage("Email Error");
        }
        else if (!passwordvalid) {
          setShowAlert(true);
          setIsPass(false);
          setMessage("Password Error");
        }
      }
    }else{
      setMessage("UserAvail not true");
      setShowAlert(true);
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProfileValues(
      { ...profileValues, [name]: value }
    )
  }

  const handleSave = async () => {
    const { uname, email, pass, age, mobile, city } = profileValues;
    const errors = [];

    // Validate input fields
    if (!validateAge(age)) errors.push("Enter valid age");
    if (!validateMobile(mobile)) errors.push("Enter valid mobile number");
    if (!validateEmail(email)) errors.push("Enter valid email");
    if (!validatePassword(pass)) errors.push("Enter valid password");

    // If there are validation errors, set alert and return
    if (errors.length > 0) {
      setShowAlert(true);
      setMessage(errors);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('File', file);
    formData.append('age', age);
    formData.append('mobile', mobile);
    formData.append('city', city);

    // Try saving the data
    try {
      console.log(file); 
      await trySave(uname, formData);
      setShowAlert(true);
      setMessage("Data Saved Successfully");
    } catch (error) {
      console.log(error); 
      setShowAlert(true);
      setMessage("Error Occurred");
    }
  };


  const handleImage = (e) => {
    console.log(e.target.files);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(e.target.files[0]))
  }

  const handleBlurUname = async (e) => {
    const uname = e.target.value;
    if (validateUname(uname)) {
      try {
        const res = await axios.post(`${localhost.url}/checkUsername`, { username: uname });
        if (res.data.message === "Username already exists") {
          setUserNameAvail(false)
          setMessage(res.data.message);
          setShowAlert(true);
        } else if (res.data.message === "Username available") {
          setUserNameAvail(true)
          setMessage(res.data.message);
          setShowAlert(true);
        }
      } catch (error) {
        setMessage("Error checking username");
        setShowAlert(true);
      }
    } else {
      setMessage("Enter a valid username (at least 3 characters)");
      setShowAlert(true);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    const updatedErrorsArray = [...errorsArray];
    const validations = {
      // username: {
      //   isValid: validateUname(value),
      //   message: 'Enter a valid username (at least 3 characters)',
      // },
      pass: {
        isValid: validatePassword(value),
        message: 'Password should contain minimum 8 characters and at least 1 Number and 1 Special Character',
      },
      email: {
        isValid: validateEmail(value),
        message: 'Enter valid email address',
      },
      age: {
        isValid: validateAge(value),
        message: 'Enter a valid age',
      },
      mobile: {
        isValid: validateMobile(value),
        message: 'Enter a valid mobile number',
      },
      city: {
        isValid: validateCity(value),
        message: 'Enter a valid city'
      }
    };

    if (validations[name]) {
      const { isValid, message } = validations[name];
      errorMessage = !isValid ? message : '';
      const errorIndex = updatedErrorsArray.indexOf(message);
      if (!isValid && errorIndex === -1) {
        updatedErrorsArray.push(message);
      } else if (isValid && errorIndex !== -1) {
        updatedErrorsArray.splice(errorIndex, 1);
      }
    }

    setErrorsArray(updatedErrorsArray);
    if (updatedErrorsArray.length > 0) {
      setMessage(updatedErrorsArray.join(' \n '));
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  const handleEditIcon = () => {
    const un = document.querySelector("#disabled-ip-id")
    un.classList.remove("disabled-input");
    un.classList.add("input-editable");
    un.readOnly = false;
  }

  return (
    <>
      <Navbar profileImage={profileImage} />
      {showAlert && (
              <CustomAlert
                variant={isEmail || isPass || message.includes("Success") ||message.includes("available") ? 'success' : 'danger'}
                message={message}
                onClose={(e)=>setShowAlert(false)} />
            )}
      {/* {showPopup && (
        <Modals onContinue={handleContinue} onLogout={handleLogout}/>
      )} */}
      {loading ? (
        // <div className='mainBody'>
        // <div className="loader"></div>
        // </div>
        <Loader/>
      ):(
        <section>
        <div className="container py-5">
          <center>
            
          </center>
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img src={imagePreview || `${localhost.imgUrl}/${profileImage}`} alt="avatar"
                    className="rounded-circle img-fluid fixed-size-image" />
                  <h5 className="my-3">{profileValues.uname}</h5>
                  <p className="text-muted mb-1">Techinal Head</p>
                  <p className="text-muted mb-4">{profileValues.city}</p>

                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 my-3">Username:</p>
                    </div>
                    <div className="col-sm-6 input-container">
                      <input type="text" className='disabled-input' id='disabled-ip-id' name="uname" value={profileValues.uname} readOnly onChange={handleOnChange} onBlur={handleBlurUname} />
                      <CiEdit id='ci-edit' onClick={handleEditIcon}/>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 my-3">Email</p>
                    </div>
                    <div className="col-sm-6">
                      {/* <p className="text-muted mb-0">example@example.com</p> */}
                      <input type="text" className='disabled-input' name="email" value={profileValues.email} readOnly onChange={handleOnChange} onBlur={handleBlur} />
                      {/* <CiEdit/> */}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 my-3">Password</p>
                    </div>
                    <div className="col-sm-6 input-container">
                      {/* <p className="text-muted mb-0">(097) 234-5678</p> */}
                      <input type={pass} className='disabled-input' name="pass" value={profileValues.pass} readOnly onChange={handleOnChange} onBlur={handleBlur} />
                      {pass === 'password' ? (<FaEyeSlash className='icon' id='eye-slash-profile' onMouseDown={togglePasswordVisibility} />) : (<FaEye className='icon' id='eye-profile' onMouseDown={togglePasswordVisibility} />)}
                      {/* <CiEdit/> */}
                    </div>
                  </div>
                  <hr />
                  <form>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0 my-3">Age</p>
                      </div>
                      <div className="col-sm-6">

                        <input type="text" className='disabled-input' name="age" value={profileValues.age} onChange={handleOnChange} readOnly onBlur={handleBlur} />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0 my-3">Mobile</p>
                      </div>
                      <div className="col-sm-6">
                        <input type="tel" className='disabled-input' name="mobile" value={profileValues.mobile} onChange={handleOnChange} readOnly onBlur={handleBlur} />

                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0 my-3">City</p>
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className='disabled-input' name="city" value={profileValues.city} onChange={handleOnChange} readOnly onBlur={handleBlur} />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p>Upload an image</p>
                      </div>
                      <div className="col-sm-3">
                        <input type="file" onChange={handleImage} />
                      </div>
                    </div>

                  </form>
                </div>
              </div>
              <div>
                {/* <button className="btn btn-primary" onClick={handleViewProfile}>View Profile Data</button> */}
                <button className="btn btn-primary" onClick={handleUpdate}>Edit</button>
                <button className="btn btn-success" onClick={handleUpdateDB}>Update</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                <Link to={'/crud'} className="btn btn-success">Crud</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )} 
    </>
  )
}

export default Profile
