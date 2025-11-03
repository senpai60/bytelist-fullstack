import React, { useEffect, useState } from "react"
import axios from "axios"
import ChallengeCard from "../components/challenge/ChallengeCard"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"

// import challenges from "../components/challenge/dummyCardData"
import ChallengeForm from "../components/challenge/ChallengeForm"

const SERVER_URI = import.meta.env.VITE_SERVER_URI || `http://localhost:3000`


function ChallengePage({ user,setChallengeId }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true)
    }
  }, [user])

useEffect(() => {
  axios
    .get(`${SERVER_URI}/challenges`)
    .then((res) => {
      console.log("Fetched data:", res.data);

      // Safely handle both cases — array or object
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.challenges)
        ? res.data.challenges
        : [];

        console.log(data);
        

      setChallenges(data);
    })
    .catch((err) => console.error(err));
}, []);



  return (
    <div className="bg-zinc-950 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">All Challenges</h1>

        {isAdmin && (
          <Button
            className={`${
              showForm
                ? "bg-red-600 hover:bg-red-500"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white flex items-center gap-2 transition-colors`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <X size={18} /> Close Form
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Create Challenge
              </>
            )}
          </Button>
        )}
      </div>

      {/* Toggleable Challenge Form */}
      {showForm && (
        <div className="mb-10 bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-md animate-fadeIn">
          <ChallengeForm />
        </div>
      )}

      {/* Challenge Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard setChallengeId={setChallengeId} key={challenge._id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}

export default ChallengePage
