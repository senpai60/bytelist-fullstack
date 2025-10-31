import { Routes, Route } from "react-router-dom";

import NavBar from "./components/layout/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import RepoPostCreate from "./pages/RepoPostCreate";
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";

import { verifyUser,logoutUser } from "./context/useAuth";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("")
  useEffect(() => {
    const getAuthVerification = async () => {
      try {
        const response = await verifyUser();
        console.log(response);
         
        setUserId(response.userId)
        setUser(response.userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getAuthVerification();
  }, []);
  return (
    <main className="w-full h-screen bg-zinc-950">
      <NavBar isLoggedIn={isLoggedIn} />
      {/* Other components, pages, or routes go here */}
      {/* <Routes> ... </Routes> OR <PlaylistView /> */}
      <div className="all-pages pt-20 md:pt-10">
        <Routes>
          <Route path="/" element={<HomePage user={user}/>} />
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
