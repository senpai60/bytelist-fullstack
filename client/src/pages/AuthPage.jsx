import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { loginUser, registerUser, verifyUser, sendOtp } from "../context/useAuth";

export default function AuthPage() {
  const { mode } = useParams();
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(form.email, form.password);
        const verified = await verifyUser();
        if (verified?.userId) navigate("/profile");
      } else {
        await sendOtp(form.email);
        setOtpSent(true);
        alert("OTP sent to your email!");
      }
    } catch (err) {
      console.error("❌ Auth Error:", err.message || err);
      alert(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP!");
    try {
      await registerUser(form.username, form.email, form.password, otp);
      const verified = await verifyUser();
      if (verified?.userId) {
        alert("Signup successful!");
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "OTP verification failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <Card className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-lg backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-white">
            {isLogin ? "Welcome Back 👋" : otpSent ? "Verify Your Email ✉️" : "Create Account 🚀"}
          </CardTitle>
          {!otpSent && (
            <p className="text-sm text-zinc-400 mt-1">
              {isLogin
                ? "Log in to continue exploring projects."
                : "Sign up to share your work and connect with devs."}
            </p>
          )}
        </CardHeader>

        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Username</label>
                  <Input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-all"
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Send OTP"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-center text-zinc-400">
                Enter the OTP sent to <strong>{form.email}</strong>
              </p>
              <Input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 text-center tracking-widest placeholder:text-zinc-500"
                required
              />
              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                Verify OTP & Register
              </Button>
            </div>
          )}

          {!otpSent && (
            <p className="text-sm text-center mt-4 text-zinc-500">
              {isLogin ? "Don’t have an account? " : "Already have an account? "}
              <Link
                to={isLogin ? "/auth/signup" : "/auth/login"}
                className="text-zinc-300 hover:text-white font-medium"
              >
                {isLogin ? "Sign up" : "Login"}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
