import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Folder, Bookmark, Play, Plus } from "lucide-react";
import CreatePlaylist from "@/components/playlist/CreatePlaylist";

import { playlistsApi } from "../api/playlistsApi";

const PlaylistPage = () => {
  const [activeTab, setActiveTab] = useState("public");
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const [myPlaylists, setMyPlaylists] = useState([]);

  const publicPlaylists = [
    {
      id: 1,
      title: "Frontend Mastery",
      description: "Learn React, Tailwind, and modern UI design.",
      tags: ["react", "tailwind", "ui"],
      creator: "mahima-dev",
    },
    {
      id: 2,
      title: "Backend Bootcamp",
      description: "All Node.js and Express projects from the community.",
      tags: ["node", "express", "api"],
      creator: "vivek-byte",
    },
  ];

const fetchMyPlaylists = async () => {
  try {
    const response = await playlistsApi.get("/my");
    if (response.data) {
      const myPlaylistsList = response.data?.myPlaylists.map((playlist) => ({
        ...playlist,
        id: playlist._id,
      }));
      setMyPlaylists(myPlaylistsList); // ✅ overwrite instead of append
    }
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {fetchMyPlaylists()}, []);

  const handleViewPlaylist = (id) => {
    navigate(`/view-playlist/${id}`);
  };

  const handleCreatePlaylist = async (newPlaylist) => {
    try {
      const response = await playlistsApi.post("/create", {
        playlistName: newPlaylist.title,
        description: newPlaylist.description,
        tags: newPlaylist.tags,
      });
      if (response.data) fetchMyPlaylists()
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-zinc-100">🎧 Playlists</h1>
          <Button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium"
          >
            <Plus size={18} /> Create Playlist
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex gap-4 mb-6 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
            <TabsTrigger
              value="public"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black transition-all"
            >
              <Globe size={18} /> Public Playlists
            </TabsTrigger>
            <TabsTrigger
              value="my"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 data-[state=active]:bg-white data-[state=active]:text-black transition-all"
            >
              <Folder size={18} /> My Playlists
            </TabsTrigger>
          </TabsList>

          {/* PUBLIC PLAYLISTS */}
          <TabsContent value="public">
            <div className="grid sm:grid-cols-2 gap-6">
              {publicPlaylists.map((p, i) => (
                <Card
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-zinc-100">
                      <span>{p.title}</span>
                      <Badge className="bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {p.creator}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      {p.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map((t, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="border-zinc-700 text-zinc-400"
                        >
                          #{t}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleViewPlaylist(p.id)}
                      className="flex items-center gap-2 w-full bg-white text-black hover:bg-zinc-200 font-medium"
                    >
                      <Play size={16} /> View Playlist
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* MY PLAYLISTS */}
          <TabsContent value="my">
            <div className="grid sm:grid-cols-2 gap-6">
              {myPlaylists.map((p, i) => (
                <Card
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-zinc-100">
                      <span className="capitalize text-[greenyellow]">{p.playlistName}</span>
                      <Badge className="bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Mine
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      {p.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map((t, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="border-zinc-700 text-zinc-400"
                        >
                          #{t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewPlaylist(p.id)}
                        className="flex-1 flex items-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium"
                      >
                        <Play size={16} /> Open
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      >
                        <Bookmark size={16} /> Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 🔥 Create Playlist Modal */}
        {showCreate && (
          <CreatePlaylist
            onClose={() => setShowCreate(false)}
            onCreate={handleCreatePlaylist}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
