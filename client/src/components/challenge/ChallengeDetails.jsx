import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Target, Link, User, CalendarClock, ArrowLeft } from "lucide-react"

const SERVER_URI = import.meta.env.VITE_SERVER_URI || `http://localhost:3000`

export default function ChallengeDetails({ }) {
  const { challengeId } = useParams()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch single challenge
  async function fetchChallenge() {
    try {
      setLoading(true)
      const res = await axios.get(`${SERVER_URI}/challenges/${challengeId}`)
      setChallenge(res.data.challenge)
    } catch (err) {
      console.error("Error fetching challenge:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (challengeId) {
      fetchChallenge()
    }
  }, [challengeId])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-200">
        Loading challenge...
      </div>
    )

  if (!challenge)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-200">
        <p>Challenge not found.</p>
        <Button
          variant="secondary"
          className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )

  const expireDate = challenge.expireAt
    ? new Date(challenge.expireAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A"

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100">
      {/* Full-width image */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-zinc-900/70 backdrop-blur-sm hover:bg-zinc-800 text-zinc-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <div className="flex flex-wrap gap-2 pt-1">
            {Array.isArray(challenge.experienceLevel) &&
              challenge.experienceLevel.map((level, idx) => (
                <Badge
                  key={idx}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300"
                >
                  {level}
                </Badge>
              ))}
          </div>
        </div>

        <p className="text-zinc-300 text-base leading-relaxed">
          {challenge.description}
        </p>

        {/* Quick Info */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock size={16} /> Duration: {challenge.duration} minutes
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Target size={16} /> Attempts: {challenge.attempts}
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CalendarClock size={16} /> Expires on: {expireDate}
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <User size={16} /> Creator: {challenge.creator?.username || "Unknown"}
          </div>
        </div>

        {/* Resources */}
        {Array.isArray(challenge.sources) && challenge.sources.length > 0 && (
          <div className="pt-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Resources</h2>
            <div className="flex flex-col gap-2">
              {challenge.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <Link size={14} /> {src}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex justify-end pt-8 gap-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          >
            Save for Later
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
            Start Challenge
          </Button>
        </div>
      </div>
    </div>
  )
}
