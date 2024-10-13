import axios from "axios";
// import { encryptData } from "./encryption";
import localhost from './env';
import { apiClient } from "./encryption";

let userData;
let apiResp;

async function tryLogin(username,password) {
  try {
    await apiClient.post(`${localhost.url}/login`, { username: username, password: password }, { withCredentials: true })
      .then(result => {
        console.log(result);
        apiResp = result.data;
        console.log(result.data);

        if (result.data.status === "success") {
          userData = result.data.user;
        } else {
          console.log("Fail");
        }
      })
      .catch(error => {
        console.log(error);
      });

  } catch (error) {
    console.log(error);
  }
  return apiResp;
}

function getUserData(){
    return userData;
}

// async function tryUpdate(uname,email,password,age,mobile,city)
// {
//     try
//     {
//         await axios.put(`${localhost.url}/update?identifier=${uname}`, {
//             username: uname,
//             email: email,
//             password: password,
//             age: age,
//             mobile: mobile,
//             city: city
//         })
//         .then(result=>console.log(result))
//         .catch(error=>console.log(error))
//         // console.log("User is Updated")
//     }
//     catch(error)
//     {
//         console.log("Error updating user: ",error)
//     }
// }

async function tryUpdate(unametemp,uname,email,password,age,mobile,city)
{
    try
    {
        await axios.put(`${localhost.url}/update?identifier=${unametemp}`, {
            username: uname,
            email: email,
            password: password,
            age: age,
            mobile: mobile,
            city: city
        },{withCredentials: true})
        .then(result=>{
          apiResp=result;
        console.log(apiResp);
        // return result.data.id;
      }
        )
        .catch(error=>console.log(error))
        // console.log("User is Updated")
    }
    catch(error)
    {
        console.log("Error updating user: ",error)
    }
    return apiResp;
}

async function tryReLog(token){
  try{
      await axios.post(`${localhost.url}/refreshtoken`,{token},{withCredentials: true})
      .then(result=>console.log(result))
      .catch(error=>console.log(error));
  }
  catch(error)
  {
    console.log(error)
  }
}

// async function trySave(username,age,mobile,city,file){
//   try
//   {
//     await axios.put(`${localhost.url}/profile?identifier=${username}`,{
//       age: age,
//       mobile: mobile,
//       city: city,
//     },file);
//   }
//   catch(error)
//   {
//     console.log(error);
//   }

// }

async function trySave(username,formData){
  try
  {
    await axios.put(`${localhost.url}/profile?identifier=${username}`,formData);
  }
  catch(error)
  {
    console.log(error);
  }

}

export {tryLogin,getUserData,tryUpdate,tryReLog,trySave};