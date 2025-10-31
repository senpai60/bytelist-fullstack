import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// 🎨 GitHub Official Language Colors
const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  CSharp: "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Swift: "#ffac45",
  Rust: "#dea584",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
};

export default function RepoInfo() {
  const { owner, repo } = useParams();
  const [repoData, setRepoData] = useState(null);
  const [readme, setReadme] = useState("");
  const [languages, setLanguages] = useState({});
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 📦 Repo Info + Languages + Contributors
        const [repoRes, langRes, contributorsRes] = await Promise.all([
          axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers,
          }),
          axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
            headers,
          }),
          axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contributors`,
            { headers }
          ),
        ]);

        setRepoData(repoRes.data);
        setLanguages(langRes.data || {});
        setContributors(contributorsRes.data?.slice(0, 8) || []);

        // 🧾 Try README from both main and master
        let readmeData = "";
        try {
          const resMain = await axios.get(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
          );
          readmeData = resMain.data;
        } catch {
          try {
            const resMaster = await axios.get(
              `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
            );
            readmeData = resMaster.data;
          } catch {
            readmeData = "No README file found in this repository.";
          }
        }

        setReadme(readmeData);
      } catch (err) {
        console.error("Error fetching repo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo]);

  const handleCopy = () => {
    if (repoData?.clone_url) {
      navigator.clipboard.writeText(`git clone ${repoData.clone_url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-zinc-400">
        Loading repository details...
      </div>
    );

  if (!repoData)
    return (
      <div className="text-center text-red-500 mt-20">
        Failed to load repository info.
      </div>
    );

  // 🧠 Calculate language percentages
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languagePercentages = Object.entries(languages).map(
    ([lang, bytes]) => ({
      lang,
      percent: ((bytes / totalBytes) * 100).toFixed(1),
      color: languageColors[lang] || "#8884d8",
    })
  );

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* 🔙 Back */}
        <Link
          to="/"
          className="flex items-center gap-2 mb-6 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft size={18} /> Back
        </Link>

        <Card className="bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-teal-700">
                  {repoData.full_name}
                </h1>
                <p className="text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                  {repoData.description || "No description available."}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button
                  asChild
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                  <a
                    href={repoData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-1" /> GitHub
                  </a>
                </Button>
                {repoData.homepage && (
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <a
                      href={repoData.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* 📊 Repo Stats */}
            <div className="flex flex-wrap gap-5 mt-8 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <Star size={14} /> {repoData.stargazers_count} Stars
              </span>
              <span className="flex items-center gap-2">
                <GitFork size={14} /> {repoData.forks_count} Forks
              </span>
              <span className="flex items-center gap-2">
                <Users size={14} /> {repoData.watchers_count} Watchers
              </span>
              <span className="flex items-center gap-2">
                <GitBranch size={14} /> {repoData.default_branch}
              </span>
              <span>🧠 {repoData.language || "Unknown"}</span>
              {repoData.license && <span>📜 {repoData.license.name}</span>}
              <span>📅 {new Date(repoData.updated_at).toLocaleString()}</span>
            </div>

            {/* 💻 Clone Command */}
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center">
              <div className="px-4 py-3 text-emerald-400 font-mono text-sm flex-1 overflow-x-auto">
                <span className="text-zinc-500 select-none">$</span>{" "}
                <span>git clone {repoData.clone_url}</span>
              </div>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none px-4 py-2"
              >
                {copied ? "Copied!" : <Copy size={14} />}
              </Button>
            </div>

            {languagePercentages.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-2 text-white">
                  Languages Breakdown
                </h2>
                <div className="h-3 w-full flex rounded-full overflow-hidden border border-zinc-800">
                  {languagePercentages.map(({ lang, percent, color }) => (
                    <div
                      key={lang}
                      title={`${lang}: ${percent}%`}
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {languagePercentages.map(({ lang, percent, color }) => (
                    <div key={lang} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-white font-medium">{lang}</span>
                      <span className="text-zinc-500">{percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🧑‍💻 Contributors */}
            {contributors.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-3 text-white">
                  Top Contributors
                </h2>
                <div className="flex flex-wrap gap-5">
                  {contributors.map((user) => (
                    <a
                      key={user.id}
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center hover:scale-105 transition-transform"
                    >
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-14 h-14 rounded-full border border-zinc-700 shadow-sm"
                      />
                      <span className="text-xs mt-1 text-zinc-300">
                        {user.login}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 🧾 README Section */}
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-3 text-white">
                📘 README
              </h2>
              <article className="prose prose-invert max-w-none bg-zinc-900/80 p-6 rounded-lg border border-zinc-800 shadow-inner leading-relaxed text-zinc-200">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {readme || "No README file found in this repository."}
                </ReactMarkdown>
              </article>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
