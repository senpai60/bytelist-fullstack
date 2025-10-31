import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RepoCard from "@/components/cards/RepoCard";

import { logoutUser,verifyUser } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function ProfilePage({ user }) {
  const navigate = useNavigate()
  const repoPosts = [
    {
      title: "ByteList UI Kit",
      description: "A modern UI component library built with React and Shadcn.",
      tags: ["react", "ui", "tailwind"],
      githubUrl: "https://github.com/example/bytelist-ui",
      liveUrl: "https://bytelist.vercel.app",
      user: user?.username,
    },
    {
      title: "Minimal Blog Platform",
      description: "A lightweight blogging system with markdown support.",
      tags: ["nextjs", "markdown"],
      githubUrl: "https://github.com/example/blog",
      liveUrl: "",
      user: user?.username,
    },
  ];

  const handleLogout = async(e) => {
    e.preventDefault()
    await logoutUser()
    await verifyUser()
    navigate("/")
    // 🧠 Later: clear tokens, redirect to /auth/login
  };

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
          <h2 className="text-xl text-white font-semibold">{user?.id}</h2>
          <p className="text-sm text-zinc-400">{user?.bio}</p>

          <div className="flex justify-center gap-8 mt-3 text-zinc-400 text-sm">
            <div>
              <span className="font-semibold text-zinc-100">{user?.stats?.posts}</span>{" "}
              Posts
            </div>
            <div>
              <span className="font-semibold text-zinc-100">{user?.stats?.likes}</span>{" "}
              Likes
            </div>
            <div>
              <span className="font-semibold text-zinc-100">{user?.stats?.saved}</span>{" "}
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
              onClick={(e)=>{handleLogout(e)}}
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
        {repoPosts.map((repo, idx) => (
          <RepoCard key={idx} repoPost={repo} />
        ))}
      </div>
    </section>
  );
}

export default ProfilePage;
