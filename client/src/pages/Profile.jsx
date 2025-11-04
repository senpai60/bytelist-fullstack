import "./updates/profile.css";

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

import Header from "../components/layout/updates/Header";
import ProfileAchievementCard from "../components/profile/ProfileAchievementCard";

const achievementBorders = {
  "Bug Hunter": "border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]",
  "50 Likes": "border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]",
  "Top Poster": "border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]",
  "Code Explorer": "border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
  "Loved Creator":
    "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-borderFlow",
};

function Profile({ user: initialUser }) {
  // ✅ Use state for user, so it can be updated after editing
  const [user, setUser] = useState(initialUser);
  const [repoPosts, setRepoPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // ✅ State to control the modal

  const navigate = useNavigate();

  const topAchievement = user.achievements?.[user.achievements.length - 1];
 
  // const avatarBorder = borderColors[topAchievement?.id] || "border-zinc-700";

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
        <PrimaryLoader />
      </section>
    );
  }

  const returnAvatarBorder = (user) => {
    if (!user.achievements || user.achievements.length === 0)
      return "border-zinc-700";

    // Gradient achievements take priority
    const gradientAch = user.achievements.find((a) =>
      ["Loved Creator"].includes(a.title)
    );
    if (gradientAch) return achievementBorders[gradientAch.title];

    // Otherwise, fallback to the latest or most valuable one
    const latestAch = user.achievements[user.achievements.length - 1];
    return achievementBorders[latestAch.title] || "border-zinc-700";
  };

  return (
    <section className="profile-update bg-zinc-950 h-screen">
      {/* <Header/> */}
      {/* <section className="top"></section> */}

      {/* className = "main" */}

      <section className="main">
        <div className="upper">
          <div className="left">
            {[1,2,3,4].map((classNum)=>
              <ProfileAchievementCard key={classNum} classIndex={classNum} />
            )}
            
          </div>
          <div className="right">
            <Card className="w-full p-0 bg-transparent border-none rounded-2xl overflow-hidden">
              {/* Cover */}
              <div className="relative h-52 w-full">
                <img
                  src={user.coverPhoto || "https://i.imgur.com/MABM84w.png"}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-10 left-6">
                  <img
                    src={user.avatar || "/images/default-male.jpg"}
                    alt={user.username}
                    className="h-20 w-20 rounded-full border-4 border-zinc-900 object-cover"
                  />
                </div>
              </div>

              <CardContent className="pt-1 pb-6 px-6 text-center">
                {/* Username + Bio */}
                <h2 className="text-xl font-semibold text-white">
                  {user.username}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {user.bio || "No bio available"}
                </p>

                {/* Stats */}
                <div className="flex justify-around mt-4 border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                  <div className="flex flex-col items-center">
                    <span className="text-base font-semibold text-white">
                      {user.stats?.posts || repoPosts.length}
                    </span>
                    <p>Posts</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-base font-semibold text-white">
                      {user.stats?.likes || 0}
                    </span>
                    <p>Likes</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-base font-semibold text-white">
                      {user.stats?.saved || 0}
                    </span>
                    <p>Saved</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lower">
          <div className="left"></div>
          <div className="mid"></div>
          <div className="right"></div>
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
    </section>
  );
}

export default Profile;
