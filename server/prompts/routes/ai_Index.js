import express from 'express'
const router = express.Router()

import analyzeRepoRoute from "./analyzeRepo.js"

router.get('/',(req,res)=>{
    res.status(200).json({message:"route is working"})
})

router.use("/analyze-repo",analyzeRepoRoute)


export default router