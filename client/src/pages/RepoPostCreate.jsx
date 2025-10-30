import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Plus, Github, Globe } from "lucide-react";

export default function RepoPostCreate({user}) {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-5">
      <Card className="w-full max-w-2xl bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-md">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt="User Avatar" />
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-semibold text-white">Create New Repo</CardTitle>
          </div>
          <p className="text-sm text-zinc-400">
            Share your latest project or post — include title, description, and tags.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Title</label>
            <Input
              type="text"
              placeholder="e.g. My Portfolio Website"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <Textarea
              placeholder="Describe your project..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[120px]"
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
            <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
            <Input
              type="text"
              placeholder="https://your-image-link.com"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">GitHub Link</label>
              <div className="relative">
                <Github className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <Input
                  type="url"
                  placeholder="https://github.com/your-repo"
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Live Link</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <Input
                  type="url"
                  placeholder="https://your-live-site.com"
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-transform hover:-translate-y-[1px]"
          >
            Submit Post
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
