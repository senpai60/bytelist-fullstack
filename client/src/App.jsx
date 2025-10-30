import { Routes, Route } from "react-router-dom";

import NavBar from "./components/layout/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import RepoPostCreate from "./pages/RepoPostCreate";
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";

import { verifyUser } from "./context/useAuth";

const user = {
  username: "@akhil",
  bio: "Full-stack developer passionate about building minimal UIs.",
  avatar:
    "https://images.unsplash.com/photo-1602471615287-d733c59b79c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
  stats: {
    posts: 12,
    likes: 340,
    saved: 27,
  },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    verifyUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);
  return (
    <main className="w-full h-screen bg-zinc-950">
      <NavBar isLoggedIn={isLoggedIn} />
      {/* Other components, pages, or routes go here */}
      {/* <Routes> ... </Routes> OR <PlaylistView /> */}
      <div className="all-pages pt-20 md:pt-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route
            path="/add-repo-post"
            element={<RepoPostCreate user={user} />}
          />
          <Route path="/auth/:mode" element={<AuthPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
