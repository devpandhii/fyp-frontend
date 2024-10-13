import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'localhost.url/protected-route', // Your API base URL
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token'); // Get token from local storage
    // if (token) {
    //   config.headers['Authorization'] = token;
    // }
    // console.log(config);
    return config;
    
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token'); // Remove token if unauthorized
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// axios.get('/protected-route', {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}` // Replace with your actual token retrieval method
//     }
//   })
//   .then(response => {
//     console.log(response.data); // Check if you receive expected data from the protected route
//   })
//   .catch(error => {
//     console.error('Request error:', error);
//   });

export default axiosInstance;


