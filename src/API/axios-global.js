import axios from 'axios'
import decodedCookies from '../Admin/Utils/cookieUtils';

const apiUrl = process.env.REACT_APP_SERVER_DOMAINE
console.log("apiUrl:: ",apiUrl)
const adminAPI = axios.create({
    baseURL: `${apiUrl}/admin`,
})

adminAPI.defaults.withCredentials = true

// Add a request interceptor to include headers
adminAPI.interceptors.request.use(
    (config) => {
        const {_auth} = decodedCookies()
        // Modify headers here
        config.headers['Authorization'] = _auth || null;
        // config.headers['Authorization'] = `Bearer ${decodedAuthValue}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const clientAPI = axios.create({
    baseURL: `${apiUrl}/client`,
})
clientAPI.defaults.withCredentials = true

// Add a request interceptor to include headers
clientAPI.interceptors.request.use(
    (config) => {
        const host = window.location.hostname.split('.');
        const subdomain = host.length > 1 ? host[0] : null;

        config.headers['subdomain'] = subdomain;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export {adminAPI , clientAPI}
