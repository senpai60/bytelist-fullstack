import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react"; // 🔥 Added
import { useNavigate } from "react-router-dom";

import repoPostApi from "../api/repoPostApi";

function RepoPostCreate({ user }) {
  const navigate = useNavigate();
  const [githubRepos, setGithubRepos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    tags: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 Added loader state

  // Fetch GitHub repos
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrMessage("");
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setFilePreview("");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage("");
    if (!formData.title || !formData.githubUrl) {
      setErrMessage("Title and GitHub URL are required!");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("tags", formData.tags);
    submitData.append("githubUrl", formData.githubUrl);
    submitData.append("liveUrl", formData.liveUrl);
    if (selectedFile) submitData.append("image", selectedFile);

    try {
      setLoading(true); // 🔥 Show loader
      const response = await repoPostApi.post("/create-repo-post", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Repo post created:", response.data);
      setFormData({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        tags: "",
        image: "",
      });
      setSelectedFile(null);
      setFilePreview("");
      navigate("/");
    } catch (err) {
      console.error("Error posting repo:", err);
      setErrMessage(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false); // 🔥 Hide loader
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-semibold text-white">Create Repo Post</h1>
          <Separator className="bg-zinc-700" />
          {errMessage && (
            <p className="text-red-500 text-center">{errMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Repository */}
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

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-white">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter project title"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Write a short description..."
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label className="text-white">GitHub URL</Label>
              <Input
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
                placeholder="https://github.com/username/repo"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Live URL */}
            <div className="space-y-2">
              <Label className="text-white">Live Link</Label>
              <Input
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                }
                placeholder="https://your-live-site.com"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-white">Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="react, tailwind, node"
                className="bg-zinc-800 text-white border-zinc-700 placeholder:text-zinc-500"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <Label className="text-white">Select Cover Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-zinc-800 text-white border-zinc-700 file:bg-zinc-700 file:text-white file:border-0 file:rounded file:mr-2 cursor-pointer"
              />
              {filePreview && (
                <div className="relative">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded border border-zinc-700"
                  />
                  <p className="text-sm text-zinc-400 mt-1">
                    ✅ Selected: {selectedFile?.name}
                  </p>
                </div>
              )}
              {!selectedFile && (
                <p className="text-sm text-zinc-500">
                  No image selected (optional for post).
                </p>
              )}
            </div>

            {/* 🔥 Loader integrated button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Post Repository"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RepoPostCreate;
