import axios from 'axios'

const SERVER_URI = import.meta.env.SERVER_URI || "http://localhost:3000"

export const playlistsApi = axios.create({
    baseURL:`${SERVER_URI}/playlists`,
    withCredentials:true,
})

