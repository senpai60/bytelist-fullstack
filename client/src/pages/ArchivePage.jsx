import { useEffect, useState } from "react";
import RepoCard from "@/components/cards/RepoCard";
import card_InteractionApi from "../api/card_InteractionApi";
import PrimaryLoader from "../components/loaders/PrimaryLoader";

function ArchivePage({ user }) {
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const res = await card_InteractionApi.get("/archived", { withCredentials: true });

        // Unwrap the nested structure
        const posts = res?.data?.archivedPosts?.map(a => a.archivedPost[0]) || [];
        setArchivedPosts(posts);
      } catch (err) {
        console.error("Failed to fetch archived posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchArchived();
  }, [user]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <PrimaryLoader/>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Saved Repositories
      </h1>

      {archivedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {archivedPosts.map((repo, idx) => (
            <RepoCard key={repo._id || idx} repoPost={repo} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-center mt-10">
          You haven’t saved any repositories yet.
        </p>
      )}
    </section>
  );
}

export default ArchivePage;
