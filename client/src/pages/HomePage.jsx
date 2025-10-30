import { useEffect, useState } from "react";
import RepoCard from "../components/cards/RepoCard";
import repoPostApi from "../api/repoPostApi";

// const repos = [
//   {
//     title: "ByteList",
//     description: "A minimal project-sharing app built with React, Vite, Tailwind, and Shadcn UI.",
//     image: "https://images.unsplash.com/photo-1643180109978-8b88bd13f568?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
//     githubUrl: "https://github.com/riyab/ByteList",
//     liveUrl: "https://bytelist.vercel.app",
//     tags: ["React", "Vite", "Tailwind", "ShadcnUI"],
//   },
//   {
//     title: "Portfolio Website",
//     description: "A personal developer portfolio showcasing skills and projects.",
//     image: "https://placehold.co/600x400?text=Portfolio",
//     githubUrl: "https://github.com/riyab/portfolio",
//     liveUrl: "https://portfolio.riyab.dev",
//     tags: ["Next.js", "Framer Motion", "TailwindCSS"],
//   },
//   {
//     title: "Weather App",
//     description: "A simple weather forecast app powered by OpenWeather API.",
//     image: "https://placehold.co/600x400?text=Weather+App",
//     githubUrl: "https://github.com/riyab/weather-app",
//     liveUrl: "https://weather.riyab.dev",
//     tags: ["React", "API", "CSS"],
//   },
// ];

function HomePage() {
  const [repoPosts, setRepoPosts] = useState([]);
  useEffect(() => {
    const fetchAllRepos = async () => {
      try {
        const response = await repoPostApi.get("/all-repo-posts");
        if (response?.data?.repoPosts) {
          setRepoPosts(response.data.repoPosts);
          
        }
        console.log(response.data.repoPosts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllRepos();
  }, []);
  return (
    <section className="main w-full min-h-screen bg-zinc-950 p-6 flex flex-col items-center gap-6">
      {repoPosts.map((repoPost) => (
        <RepoCard key={repoPost._id} repoPost={repoPost} />
      ))}
    </section>
  );
}

export default HomePage;
