import authApi from "../api/authApi";

export const registerUser = async (username,email,password) => {
    try {
        const response = await authApi.post("/create-user",{
            username,
            email,
            password
        }
            
        )
        return response.data;
    } catch (err) {
        throw err.response.data
    }
} 

export const loginUser = async (email,password) => {
    try {
        const response = await authApi.post("/login",{
            email,
            password,
        })
        return response.data

    } catch (err) {
        throw err.response.data
    }
}

export const logoutUser =  async () => {
    try {
        await authApi.post("/logout")
        return { message: "Logged out" };
    } catch (err) {
        throw err.response.data
    }
}

export const verifyUser = async () => {
    try {
        const response  =  await authApi.get("/verify")
        return response.data;
    } catch (err) {
        throw err.response.data
    }
}
