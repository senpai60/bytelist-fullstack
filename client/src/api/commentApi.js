import axios from "axios";
const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const commentsApi = axios.create({
  baseURL:
    `${SERVER_URI}/comments` ||
    `http://localhost:3000/comments`,
  withCredentials: true,
});

export default commentsApi;
