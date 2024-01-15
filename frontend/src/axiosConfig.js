import axios from 'axios';

// Create an instance of Axios with default configuration
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your API base URL
  // baseURL: 'https://twitter-backend-2029c7531810.herokuapp.com/', // Your API base URL
  withCredentials: true, // Set withCredentials to true to send cookies
});

export default instance;
