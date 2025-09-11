import axios from "axios";

let token = null;

// Function to set token dynamically
export const setToken = (newToken) => {
    token = newToken;
};

const api = axios.create({
    baseURL: "http://localhost:5050/api", // adjust your backend URL
});

// Add Authorization header automatically
api.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
