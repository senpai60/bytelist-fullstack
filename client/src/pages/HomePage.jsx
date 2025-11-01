import { useEffect, useState } from "react";
import RepoCard from "../components/cards/RepoCard";
import repoPostApi from "../api/repoPostApi";
import { Loader2 } from "lucide-react";
import PrimaryLoader from "../components/loaders/PrimaryLoader";

function HomePage({ user }) {
  const [repoPosts, setRepoPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRepos = async () => {
      try {
        const response = await repoPostApi.get("/all-repo-posts");
        if (response?.data?.repoPosts) {
          setRepoPosts(response.data.repoPosts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRepos();
  }, []);

  return (
    <section className="w-full min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10 flex flex-col items-center">
      {/* Header Section */}
      <div className="max-w-6xl w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-white">
          Explore Awesome Projects 🚀
        </h1>
        <p className="text-zinc-400 text-sm md:text-base">
          Discover, share, and get inspired by the coolest developer creations.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <PrimaryLoader/>
        </div>
      ) : repoPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
          <p className="text-lg">No projects found 😕</p>
          <p className="text-sm mt-1">Be the first to share your amazing work!</p>
        </div>
      ) : (
        /* Repo Grid */
        <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {repoPosts.map((repoPost) => (
            <RepoCard key={repoPost._id} user={user} repoPost={repoPost} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
