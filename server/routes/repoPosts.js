import express from "express"
const router = express.Router()

import RepoPost from "../models/RepoPost"

router.get("/repo-posts",async(req,res)=>{
    try {
        const repoPosts = await RepoPost.find({})
        res.status(201).json({repoPosts})
    } catch (err) {
        console.error(err)
        res.status(501).json({message:"something went wrong please refresh the page or try again later!"})
    }
})

export default router
