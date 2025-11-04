import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCheckTaskExpiry } from "../context/useCheckTaskExpiry";
import repoPostApi from "../api/repoPostApi";

function RepoPostCreate({ user }) {
  const location = useLocation();
  const taskId = location.state?.taskId || null;
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
  const [loading, setLoading] = useState(false);
  const [isTaskExpired, setIsTaskExpired] = useState(false);

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
    if (taskId) submitData.append("taskId", taskId);

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-10">
      <Card className="w-full max-w-6xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-lg rounded-3xl p-8">
        <CardContent className="space-y-8">
          {taskId && (
            <p className="text-sm text-[#ADFF2F] bg-zinc-800/60 border border-[#ADFF2F]/30 rounded-md px-3 py-1 inline-block">
              🧠 Linked to your challenge task
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-[#ADFF2F] tracking-tight">
              Create Repository Post
            </h1>
            {errMessage && (
              <p className="text-red-400 font-medium text-sm mt-2 md:mt-0">
                {errMessage}
              </p>
            )}
          </div>

          <Separator className="bg-[#ADFF2F]/40" />

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Grid Section */}
            <div className="space-y-6">
              {/* Select Repository */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Select Repository</Label>
                <select
                  className="w-full bg-zinc-800/60 text-zinc-100 rounded-xl px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#ADFF2F]/40"
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
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter project title"
                  className="bg-zinc-800/60 text-white border-zinc-700 placeholder:text-zinc-500 rounded-xl focus:ring-2 focus:ring-[#ADFF2F]/40"
                  required
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <Label className="text-zinc-300">GitHub URL</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/username/repo"
                  className="bg-zinc-800/60 text-white border-zinc-700 placeholder:text-zinc-500 rounded-xl focus:ring-2 focus:ring-[#ADFF2F]/40"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Tags (comma separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="react, tailwind, node"
                  className="bg-zinc-800/60 text-white border-zinc-700 placeholder:text-zinc-500 rounded-xl focus:ring-2 focus:ring-[#ADFF2F]/40"
                />
              </div>
            </div>

            {/* Right Grid Section */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write a short description..."
                  className="bg-zinc-800/60 text-white border-zinc-700 placeholder:text-zinc-500 rounded-xl focus:ring-2 focus:ring-[#ADFF2F]/40 min-h-[130px]"
                />
              </div>

              {/* Live URL */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Live Link</Label>
                <Input
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                  }
                  placeholder="https://your-live-site.com"
                  className="bg-zinc-800/60 text-white border-zinc-700 placeholder:text-zinc-500 rounded-xl focus:ring-2 focus:ring-[#ADFF2F]/40"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <Label className="text-zinc-300">Select Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-zinc-800/60 text-white border-zinc-700 file:bg-[#ADFF2F]/20 file:px-4 file:text-[#ADFF2F] file:border-0 file:rounded-md file:mr-2 cursor-pointer focus:ring-2 focus:ring-[#ADFF2F]/40"
                />
                {filePreview && (
                  <div className="relative">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full max-h-40 object-cover rounded-xl border border-zinc-700"
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
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-[#ADFF2F]/20 hover:bg-[#ADFF2F]/30 text-[#ADFF2F] font-semibold border border-[#ADFF2F]/40 transition-all rounded-xl"
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RepoPostCreate;
