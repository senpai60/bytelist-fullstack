import authApi from "../api/authApi";

// ===============================
// SEND OTP FUNCTION
export const sendOtp = async (email) => {
  try {
    const response = await authApi.post("/send-otp", { email });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "OTP send failed" };
  }
};

// ===============================
// Modified Register User Function (now with OTP)
export const registerUser = async (username, email, password, otp) => {
  try {
    const response = await authApi.post("/create-user", {
      username,
      email,
      password,
      otp, // Add the OTP here!
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Signup failed" };
  }
};

// ===============================
// Login, Logout, Verify remain as it is
export const loginUser = async (email, password) => {
  try {
    const response = await authApi.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    await authApi.post("/logout");
    return { message: "Logged out" };
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};

export const verifyUser = async () => {
  try {
    const response = await authApi.get("/verify");
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Verification failed" };
  }
};
