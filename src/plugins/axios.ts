import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
})

export const axiosVending = axios.create({
    baseURL: 'http://localhost:3001'
})