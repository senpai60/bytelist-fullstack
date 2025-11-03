import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, Link, User, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVER_URI = import.meta.env.SERVER_URI || "http://localhost:3000";

export default function ChallengeCard({ challenge }) {
  const navigate = useNavigate();
  const expireDate = new Date(challenge.expireAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const handleStartChallenge = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${SERVER_URI}/tasks/create/${challenge?._id}`,
      {},  // Empty body (or omit this)
      { withCredentials: true }  // Add this config object
    );
    if (response.data) {
      navigate("/tasks");
    }
    console.log(`The Start Challenge Response is: ${response.data.message}`);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <CardHeader className="p-0 relative">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {Array.isArray(challenge.experienceLevel) &&
            challenge.experienceLevel.map((level, idx) => (
              <Badge
                key={idx}
                className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 text-zinc-200 text-xs"
              >
                {level}
              </Badge>
            ))}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <CardTitle className="text-lg font-semibold">
          {challenge.title}
        </CardTitle>
        <p className="text-sm text-zinc-400 line-clamp-3">
          {challenge.description}
        </p>

        {/* Info row */}
        <div className="flex justify-between text-sm text-zinc-400 pt-2">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {challenge.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Target size={14} /> {challenge.attempts} attempts
          </span>
        </div>

        {/* Sources */}
        {Array.isArray(challenge.sources) && challenge.sources.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs text-zinc-500 mb-1">Resources:</h4>
            <div className="flex flex-wrap gap-2">
              {challenge.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                >
                  <Link size={12} /> Resource {idx + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Expiry */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <CalendarClock size={12} /> Expires: {expireDate}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} /> Creator:{" "}
            {challenge.creator?.username || "Unknown"}
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          onClick={() => navigate(`/challenge-details/${challenge?._id}`)}
          variant="secondary"
          size="sm"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
        >
          View Details
        </Button>
        <Button
          onClick={(e) => handleStartChallenge(e)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          Start Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}
