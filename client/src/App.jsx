import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/layout/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import RepoPostCreate from "./pages/RepoPostCreate";
import AuthPage from "./pages/AuthPage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import RepoInfo from "./pages/RepoInfo";
import PlaylistPage from "./pages/PlaylistPage";
import ViewPlaylistPage from "./pages/ViewPlaylistPage";

import { useEffect, useState } from "react";
import { verifyUser, logoutUser } from "./context/useAuth";
import PrimaryLoader from "./components/loaders/PrimaryLoader";
import ChallengePage from "./pages/ChallengePage";
import ChallengeDetails from "./components/challenge/ChallengeDetails";
import { TaskPage } from "./pages/TaskPage";
import Profile from "./pages/updates/Profile";
import LeftMenu from "./components/layout/LeftMenu";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [loadingApp, setLoadingApp] = useState(true);
  const [currentChallengeId, setCurrentChallengeId] = useState("");

  useEffect(() => {
    const getAuthVerification = async () => {
      try {
        const response = await verifyUser();
        setUserId(response.userId);
        setUser(response.userData || response.user); // accept either field
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoadingApp(false);
      }
    };
    getAuthVerification();
  }, []);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (loadingApp) {
    return (
      <div className="w-full h-screen bg-zinc-950 flex items-center justify-center text-white">
        <PrimaryLoader />
      </div>
    );
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();

      setUser(null); // Clear user state
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 200);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <main className="w-screen h-screen bg-zinc-950 overflow-x-hidden">
      {/* <NavBar isLoggedIn={isLoggedIn} /> */}
      <LeftMenu handleLogout={handleLogout} isLoggedIn={isLoggedIn} />
      <div className="all-pages w-full h-full md:pl-20 pt-15 md:pt-0">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />

          {/* <Route
            path="/profile"
            element={
              user
                ? <ProfilePage user={user} />
                : <Navigate to="/auth/login" replace />
            }
          /> */}
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route
            path="/add-repo-post"
            element={
              user ? (
                <RepoPostCreate user={user} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route path="/auth/:mode" element={<AuthPage />} />
          <Route
            path="/archive"
            element={
              user ? (
                <ArchivePage user={user} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <SettingsPage user={user} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route path="/repo/:owner/:repo" element={<RepoInfo />} />
          <Route path="/playlists" element={<PlaylistPage />} />
          <Route path="/challenges" element={<ChallengePage user={user} />} />
          <Route
            path="/challenge-details/:challengeId"
            element={<ChallengeDetails />}
          />
          <Route path="/tasks" element={<TaskPage user={user} />} />

          <Route
            path="/view-playlist/:playlistId"
            element={<ViewPlaylistPage />}
          />
        </Routes>
      </div>
    </main>
  );
}

export default App;
