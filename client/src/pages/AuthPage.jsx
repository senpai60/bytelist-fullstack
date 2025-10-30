import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Github, Mail } from "lucide-react";

import { loginUser, registerUser,verifyUser } from "../context/useAuth";

export default function AuthPage({ isLoggedIn }) {
  const { mode } = useParams(); // "login" or "signup"
  const isLogin = mode === "login";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${isLogin ? "Logging in" : "Signing up"} with:`, form);
    // 🧠 Add your API call here (e.g. axios.post(`/api/auth/${mode}`, form))

    try {
      let response;
      if(isLogin) {
        response =  await loginUser(form.email,form.password)
      }
      else{
        response = await registerUser(form.username,form.email,form.password)
      }
      const verified =  await verifyUser()
      if(verified?.userId)
        navigate("/profile")
    } catch (err) {
      console.error(err);
    }
  };

  const handleOAuth = (provider) => {
    console.log(`Continue with ${provider}`);
    // 🧠 Replace with actual redirect to backend OAuth route, e.g. window.location.href = `/api/auth/${provider}`
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <Card className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
          </CardTitle>
          <p className="text-sm text-zinc-400 mt-1">
            {isLogin
              ? "Log in to continue posting and exploring awesome projects."
              : "Sign up to share your work and connect with developers."}
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="flex flex-col gap-4"
          >
            {!isLogin && (
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
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
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-transform hover:-translate-y-[1px]"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800"></span>
            </div>
            <span className="relative px-3 text-sm text-zinc-500 bg-zinc-900/60">
              or continue with
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuth("google")}
              className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuth("github")}
              className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </Button>
          </div>

          {/* Switch Auth Mode */}
          <p className="text-center text-sm text-zinc-400 mt-6">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-zinc-300 hover:text-white transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-zinc-300 hover:text-white transition"
                >
                  Log in
                </Link>
              </>
            )}
          </p>

          {/* Terms and Conditions */}
          <p className="text-center text-xs text-zinc-500 mt-6 leading-relaxed">
            By continuing, you agree to ByteList’s{" "}
            <Link
              to="/terms"
              className="text-zinc-300 hover:text-white underline underline-offset-2"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-zinc-300 hover:text-white underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
