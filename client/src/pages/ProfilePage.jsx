import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RepoCard from "@/components/cards/RepoCard";
import EditProfileCard from "@/components/profile/EditProfileCard"; // ✅ Import the new component

import { logoutUser } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import repoPostApi from "../api/repoPostApi";
import { Github, Linkedin, Twitter, Edit2 } from "lucide-react"; // ✅ Import icons
import PrimaryLoader from "../components/loaders/PrimaryLoader";

function ProfilePage({ user: initialUser }) {
  // ✅ Use state for user, so it can be updated after editing
  const [user, setUser] = useState(initialUser);
  const [repoPosts, setRepoPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // ✅ State to control the modal
  const navigate = useNavigate();

  // ✅ Update user state if the prop changes (e.g., on app load)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();
      setRepoPosts([]);
      setUser(null); // Clear user state
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 200);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    // Only fetch posts if we have a user
    if (!user?._id) return;

    const fetchUserPosts = async () => {
      try {
        const response = await repoPostApi.get("/user-posts", {
          withCredentials: true,
        });
        if (response?.data?.repoPosts) {
          setRepoPosts(response.data.repoPosts);
        }
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      }
    };

    fetchUserPosts();
  }, [user?._id]); // ✅ Re-fetch if user ID changes (though it shouldn't here)

  // ✅ Callback function for the modal to update the profile
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser); // Update the state with the new user data from the server
  };

  if (!user) {
    // Handle loading or user-not-found state, maybe redirect
    return (
      <section className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6 flex items-center justify-center">
        <PrimaryLoader/>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center">
      {/* PROFILE HEADER */}
      <Card className="w-full max-w-3xl bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* ✅ Cover Photo */}
        <div className="h-40 md:h-56 w-full bg-zinc-800 relative">
          <img
            src={user.coverPhoto || "https://i.imgur.com/MABM84w.png"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* ✅ Avatar positioned over cover */}
          <img
            src={user.avatar || "images/default-male.jpg"}
            alt={user.username}
            className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-zinc-900 object-cover absolute -bottom-12 md:-bottom-16 left-6"
          />
        </div>

        {/* --- Card Content --- */}
        <CardContent className="pt-16 md:pt-20 px-6 pb-6">
          {/* Top section with Edit button */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl text-white font-bold">
                {user.username}
              </h2>
              <p className="text-sm text-zinc-400 mt-2 max-w-lg">
                {user.bio}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)} // ✅ Open the modal
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* ✅ Social Links */}
          <div className="flex gap-4 mt-4">
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
              >
                <Twitter className="w-4 h-4" />
                Twitter/X
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-start gap-8 mt-6 text-zinc-400 text-sm border-t border-zinc-800 pt-4">
            <div>
              <span className="font-semibold text-zinc-100 text-base">
                {user.stats?.posts || repoPosts.length}
              </span>{" "}
              Posts
            </div>
            <div>
              <span className="font-semibold text-zinc-100 text-base">
                {user.stats?.likes || 0}
              </span>{" "}
              Likes
            </div>
            <div>
              <span className="font-semibold text-zinc-100 text-base">
                {user.stats?.saved || 0}
              </span>{" "}
              Saved
            </div>
          </div>

          {/* Logout Button (moved here for better placement) */}
          <Button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors mt-6 w-full md:w-auto"
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-8 w-full max-w-3xl bg-zinc-800" />

      {/* USER'S PROJECTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {repoPosts.length > 0 ? (
          repoPosts.map((repo, idx) => (
            <RepoCard key={repo._id || idx} user={user} repoPost={repo} />
          ))
        ) : (
          <p className="text-zinc-500 text-center col-span-full">
            No repositories posted yet.
          </p>
        )}
      </div>

      {/* ✅ The Edit Profile Modal/Dialog */}
      {isEditing && (
        <EditProfileCard
          user={user}
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </section>
  );
}

export default ProfilePage;
