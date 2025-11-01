import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:3000";

const authApi = axios.create({
  baseURL: `${SERVER_URI}/users`,
  withCredentials: true,
});

export default authApi;
