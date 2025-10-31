import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RepoCard from "@/components/cards/RepoCard";

import { logoutUser, verifyUser } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import repoPostApi from "../api/repoPostApi";

function ProfilePage({ user }) {
  const [repoPosts, setRepoPosts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();

      // Clear user state locally too
      setRepoPosts([]); // optional
      // Give React a tick before navigating
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 200);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <section className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center">
      {/* PROFILE HEADER */}
      <Card className="w-full max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
        <CardContent className="flex flex-col items-center gap-3">
          <img
            src={user?.avatar || "images/default-male.jpg"}
            alt={user?.username}
            className="h-20 w-20 rounded-full border border-zinc-700 object-cover"
          />
          <h2 className="text-xl text-white font-semibold">
            {user?.username || user?.id}
          </h2>
          <p className="text-sm text-zinc-400">{user?.bio}</p>

          <div className="flex justify-center gap-8 mt-3 text-zinc-400 text-sm">
            <div>
              <span className="font-semibold text-zinc-100">
                {user?.stats?.posts || repoPosts.length}
              </span>{" "}
              Posts
            </div>
            <div>
              <span className="font-semibold text-zinc-100">
                {user?.stats?.likes || 0}
              </span>{" "}
              Likes
            </div>
            <div>
              <span className="font-semibold text-zinc-100">
                {user?.stats?.saved || 0}
              </span>{" "}
              Saved
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 mt-4 w-full max-w-[200px]">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Edit Profile
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8 w-full max-w-3xl bg-zinc-800" />

      {/* USER'S PROJECTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {repoPosts.length > 0 ? (
          repoPosts.map((repo, idx) => (
            // ✅ Pass user={user} here (FIXED)
            <RepoCard key={repo._id || idx} user={user} repoPost={repo} />
          ))
        ) : (
          <p className="text-zinc-500 text-center col-span-full">
            No repositories posted yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
