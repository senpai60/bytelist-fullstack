import axios from "axios";

const SERVER_URI = import.meta.env.SERVER_URI || "http://localhost:3000";

export const useCheckTaskExpiry = async (taskId,setErrMessage) => {
  try {
    const response = await axios.get(`${SERVER_URI}/tasks/verify/${taskId}`, {
      withCredentials: true,
    });
    return response.data?.isExpired
  } catch (err) {
    console.error(err);
    setErrMessage(err)
  }
};
