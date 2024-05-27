import axios from "axios";


const axiosClient = axios.create({
    baseURL: 'http://localhost:3000'
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol'); 
    config.headers.token = token;
    config.headers.rol = rol; 
    return config;
});

axiosClient.interceptors.response.use((response) => {
    return response;
});

export default axiosClient;