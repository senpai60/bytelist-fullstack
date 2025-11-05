import express from "express";
const router = express.Router();

import verifyUser from "../middleware/verifyUser.js";

import Playlist from "../models/Playlist.js";

router.post("/create", verifyUser, async (req, res) => {
  const { playlistName, description,tags } = req.body;
  if (!playlistName)
    return res.status(400).json({ message: "playlist name can't be empty" });

  try {
    const userId = req.user;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Please login to create playlist :)" });
    const existingPlaylist = await Playlist.findOne({
      playlistName: playlistName,
      user: userId,
    });
    if (existingPlaylist)
      return res.status(409).json({
        message: "Playlist name already exist please try different one :) ",
      });

    const newPlaylist = await Playlist.create({
      user: userId,
      playlistName: playlistName,
      description: description,
      tags:tags
    });

    res.status(201).json({
      message:
        "Playlist created successfully, please try some posts to save in there :) ",
      playlist: newPlaylist,
    });
  } catch (err) {
    console.error(err);
    res
      .status(502)
      .json({ message: "too many requests please try again later :(" });
  }
});

router.get('/my',verifyUser,async(req,res)=>{
    const userId = req.user
    if(!userId) return res.status(401).json({message:"please login to get your playlists"});
    try {
        const myPlaylists = await Playlist.find({user:userId}).lean()
        res.status(200).json({myPlaylists:myPlaylists})
    } catch (err) {
        console.error(err)
        res.status(500).json({message:"something went wrong please refresh the page"})
    }
})

export default router;
// Afk hu aata hu 10 min me