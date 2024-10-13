import axios from "axios";
import localhost from './env';

async function tryUploadImage(formData){
    axios.post(`${localhost.imgUrl}/upload`,formData)
    .then(res=>{
        console.log(res);
        return res;
    })
    .catch(err=>console.log(err))
}

async function tryGetImage()
{
    axios.get(`${localhost.imgUrl}/getImage`)
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}

export {tryUploadImage, tryGetImage}