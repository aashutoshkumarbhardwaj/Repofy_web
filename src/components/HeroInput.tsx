import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "./GlassCard";

export function HeroInput() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate brief analysis state, then navigate
    setTimeout(() => {
      const encodedUrl = encodeURIComponent(repoUrl);
      navigate(`/app?repo=${encodedUrl}`);
    }, 1500);
  };

  return (
    <GlassCard className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repository"
          disabled={isAnalyzing}
          className="w-full px-4 py-3.5 bg-background/80 border border-border rounded-xl 
                     text-foreground placeholder:text-muted-foreground/60
                     focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/20
                     transition-all duration-200 text-sm md:text-base
                     disabled:opacity-60 disabled:cursor-not-allowed"
        />
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full px-6 py-3.5 rounded-xl font-medium text-sm md:text-base
                     focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                     transition-all duration-200 active:scale-[0.99]
                     ${repoUrl.trim() 
                       ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                       : 'bg-primary/70 text-primary-foreground/80 cursor-default'}
                     ${isAnalyzing ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isAnalyzing ? "Analyzing repository structure…" : "Analyze with Repofy"}
        </button>
        
        <p className="text-center text-xs text-muted-foreground pt-1">
          Works best with small to medium public repositories
        </p>
      </form>
    </GlassCard>
  );
}
