import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/users/github";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-zinc-800 via-zinc-900 to-black opacity-70"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Floating light particles (subtle animation) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full blur-sm"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[90%] sm:w-[400px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-lg text-center"
      >
        <motion.h2
          className="text-3xl font-bold text-white mb-4"
          animate={{
            textShadow: [
              "0 0 8px #ffffff55",
              "0 0 16px #ffffff22",
              "0 0 8px #ffffff55",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Welcome to ByteList
        </motion.h2>

        <p className="text-zinc-400 mb-8">
          Connect with GitHub to explore, post, and share repositories.
        </p>

        <Button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <Github className="w-5 h-5" /> Login with GitHub
        </Button>

        {/* Loading ring animation below button */}
        <motion.div
          className="mt-8 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
