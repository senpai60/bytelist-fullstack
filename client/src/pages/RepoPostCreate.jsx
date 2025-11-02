import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {useNavigate} from "react-router-dom"

import repoPostApi from "../api/repoPostApi";


// === Cover Image Options ===
const COVER_LIST = [
  "https://images.unsplash.com/photo-1743003902336-8a11c244e28f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWxsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1638521476152-d0a01eaa1207?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFsbHxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaHxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHRlY2h8ZW58MHwwfDB8fHwy&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHRlY2h8ZW58MHwwfDB8fHwy&auto=format&fit=crop&q=60&w=600"
];

function RepoPostCreate({ user }) {
  const navigate = useNavigate()
  const [githubRepos, setGithubRepos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    tags: "",
    image: "",
  });
  const [errMessage, setErrMessage] = useState('')

  // === Fet
  // ch GitHub Repos ===

  

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${user.username}/repos`
        );
        setGithubRepos(res.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };
    if (user?.username) fetchRepos();
  }, [user]);

  // === Submit Form ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await repoPostApi.post("/create-repo-post", {
        user: user?._id,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        image: formData.image,
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
      });
      console.log("✅ Repo post created:", response.data);
      navigate('/')
    } catch (err) {
      console.error("Error posting repo:", err);
      setErrMessage(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-semibold text-white">
            Create Repo Post
          </h1>
          <Separator className="bg-zinc-700" />
          {errMessage && <p className="text-red-500 text-center">{errMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* === Select Repository === */}
            <div className="space-y-2">
              <Label className="text-white">Select Repository</Label>
              <select
                className="w-full bg-zinc-800 text-white rounded-md px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                onChange={(e) => {
                  const repo = githubRepos.find(
                    (r) => r.name === e.target.value
                  );
                  if (repo) {
                    let liveUrl = "";
                    if (repo.homepage) {
                      liveUrl = repo.homepage;
                    } else if (repo.has_pages) {
                      liveUrl = `https://${user.username}.github.io/${repo.name}/`;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      title: repo.name,
                      description: repo.description || "",
                      githubUrl: repo.html_url,
                      liveUrl: liveUrl,
                    }));
                  }
                }}
              >
                <option value="">-- Select a repository --</option>
                {githubRepos.map((repo) => (
                  <option key={repo.id} value={repo.name}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>

            {/* === Title === */}
            <div className="space-y-2">
              <Label className="text-white">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter project title"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* === Description === */}
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Write a short description..."
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* === GitHub URL === */}
            <div className="space-y-2">
              <Label className="text-white">GitHub URL</Label>
              <Input
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* === Live URL === */}
            <div className="space-y-2">
              <Label className="text-white">Live Link</Label>
              <Input
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                placeholder="https://your-live-site.com"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* === Tags === */}
            <div className="space-y-2">
              <Label className="text-white">Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="react, tailwind, node"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* === Cover Image Selection === */}
            <div className="space-y-3">
              <Label className="text-white">Select Cover Image</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COVER_LIST.map((img) => (
                  <div
                    key={img}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: img }))
                    }
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      formData.image === img
                        ? "border-yellow-400 scale-105 shadow-lg"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                    style={{ width: "100%", height: "112px" }} // fix height matching image h-28 (7*16=112px)
                  >
                    {/* No <img> here */}
                    <img src={img} alt="" srcset="" />
                  </div>
                ))}
              </div>
              {formData.image && (
                <p className="text-sm text-zinc-400">
                  ✅ Selected Image:
                  <span className="text-zinc-200"> {formData.image}</span>
                </p>
              )}
            </div>

            {/* === Submit === */}
            <Button
              type="submit"
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition-all"
            >
              Post Repository
            </Button>
          {errMessage && <p className="text-red-500 text-center">{errMessage}</p>}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RepoPostCreate;
