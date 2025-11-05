// src/components/playlist/CreatePlaylist.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const CreatePlaylist = ({ onClose, onCreate }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return alert("Playlist name is required");

    const newPlaylist = {
      title: playlistName,
      description,
      tags,
       
    };

    onCreate(newPlaylist);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Create New Playlist</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Playlist Name */}
            <div>
              <label className="text-sm mb-1 block text-zinc-400">Playlist Name</label>
              <Input
                placeholder="e.g. My Coding Journey"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm mb-1 block text-zinc-400">Description</label>
              <Textarea
                placeholder="Describe your playlist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm mb-1 block text-zinc-400">Tags</label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-zinc-700 px-3 py-1 rounded-full text-sm text-zinc-100"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type tag and press Enter..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white text-black hover:bg-zinc-200 font-medium"
              >
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePlaylist;
