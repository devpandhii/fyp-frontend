import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
    return Cookies.get('token');
};

export const isTokenValid = (token) => {
    if (!token) {
        return false;
    }
    try{
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const remainingTime=((decoded.exp - currentTime)*1000)
        const popUptime=remainingTime-60000;
        return decoded.exp > currentTime;
    } catch (error){
        return false;
    }
};