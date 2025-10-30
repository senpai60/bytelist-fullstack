import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Plus, Github, Globe } from "lucide-react";
// Import useNavigate if you want to redirect after success
// import { useNavigate } from "react-router-dom";

import repoPostApi from "../api/repoPostApi";

export default function RepoPostCreate({ user }) {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = { ...formData, tags };

    try {
      const response = await repoPostApi.post("/create-repo-post", {
        user:user?._id,
        title:formData.title,
        description:formData.description,
        imageUrl:formData.imageUrl,
        githubUrl:formData.githubUrl,
        liveUrl:formData.liveUrl,
      })
        

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit post.");
      }

      const result = await response.json();
      console.log("Success:", result);
      // On success, you could redirect: navigate(`/post/${result.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-5">
      <Card className="w-full max-w-2xl bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} alt="User Avatar" />
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-semibold text-white">
              Create New Repo
            </CardTitle>
          </div>
          <p className="text-sm text-zinc-400">
            Share your latest project or post — include title, description, and
            tags.
          </p>
        </CardHeader>

        {/* Use a form element and add the onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. My Portfolio Website"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project..."
                className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[120px]"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add a tag (e.g. React)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="secondary"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    onClick={() => removeTag(tag)}
                    className="cursor-pointer bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  >
                    {tag} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Image URL
              </label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                type="url"
                placeholder="https://your-image-link.com"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  GitHub Link
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <Input
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    type="url"
                    placeholder="https://github.com/your-repo"
                    className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Live Link
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <Input
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    type="url"
                    placeholder="https://your-live-site.com"
                    className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>
            </div>

            {/* Display error message if it exists */}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-transform hover:-translate-y-[1px] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Post"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}
