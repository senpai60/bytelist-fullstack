import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookmarkIcon,
  ExternalLink,
  Globe,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

function RepoCard({ repoPost}) {
  return (
    <Card className="overflow-hidden w-90 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-md transition-all hover:shadow-zinc-800/40 hover:-translate-y-1">
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden bg-zinc-900">
        <img
          src={repoPost?.image || "images/default-male.jpg"}
          alt={repoPost?.title || "Project image"}
          className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* CONTENT */}
      <CardHeader>
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-2">
          <img
            src={repoPost?.user?.avatar || "/images/default-avatar.png"}
            alt={repoPost?.user?.username || "User"}
            className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
          />
          <span className="text-sm text-zinc-300 font-medium">
            {repoPost?.username || "Anonymous"}
          </span>
        </div>

        {/* TITLE + DESCRIPTION */}
        <CardTitle className="text-lg font-semibold text-zinc-100 line-clamp-1">
          {repoPost?.title || "Untitled Project"}
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400 line-clamp-2">
          {repoPost?.description || "No description provided."}
        </CardDescription>
      </CardHeader>

      {/* TAGS */}
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {repoPost?.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-3">
          {/* GITHUB LINK */}
          {repoPost?.githubUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={repoPost?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  View GitHub Repo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* LIVE LINK */}
          {repoPost?.liveUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={repoPost?.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  Visit Live Website
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* LIKE / DISLIKE */}
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>

        {/* SAVE */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <BookmarkIcon className="h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RepoCard;
