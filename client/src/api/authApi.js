import axios from "axios";

const SERVER_URI =  import.meta.env.VITE_SERVER_URI

const authApi  =  axios.create({
    baseURL: `${SERVER_URI}/users` || `http://localhost:3000/users`,
    withCredentials:true
})

export default authApi