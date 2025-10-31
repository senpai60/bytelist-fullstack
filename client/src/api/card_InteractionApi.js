import axios from "axios";
const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const card_InteractionApi = axios.create({
  baseURL:
    `${SERVER_URI}/post-interaction` ||
    `http://localhost:3000/post-interaction`,
  withCredentials: true,
});

export default card_InteractionApi;
