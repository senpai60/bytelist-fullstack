import axios from "axios";

const SERVER_URI =  import.meta.env.VITE_SERVER_URI

const repoPostApi  =  axios.create({
    baseURL: `${SERVER_URI}/repo-posts` || `http://localhost:3000/repo-posts`,
    withCredentials:true
})

export default repoPostApi