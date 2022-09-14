import axios from 'axios';

export const API_URL = `http://localhost:4000`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})