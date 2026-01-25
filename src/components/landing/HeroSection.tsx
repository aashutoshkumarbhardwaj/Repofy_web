import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Copy, Check, Terminal } from "lucide-react";
import { TerminalDemo } from "./TerminalDemo";

export function HeroSection() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    const encodedUrl = encodeURIComponent(repoUrl);
    navigate(`/app?repo=${encodedUrl}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g repofy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-44 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left side - Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full 
                       glass-container-subtle animate-fade-in-up border border-primary/20"
            >
              <div className="relative">
                <Sparkles className="w-4 h-4 text-primary" />
                <div className="absolute inset-0 text-primary blur-md opacity-60">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground/90 tracking-wide uppercase">
                AI-Powered Analysis
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6 animate-fade-in-up animation-delay-100">
              <h1 className="text-balance">
                <span className="block text-foreground">Understand</span>
                <span className="block text-foreground">any codebase.</span>
                <span className="block gradient-text">Instantly.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
                Paste a GitHub repository and get a clear, intelligent explanation 
                of its architecture, files, and logic. No more reading every line.
              </p>
            </div>

            {/* NPM Install Command */}
            <div className="animate-fade-in-up animation-delay-150">
              <div className="glass-container inline-flex items-center gap-4 px-5 py-3.5 group hover:border-primary/30 transition-all duration-300">
                <Terminal className="w-4 h-4 text-primary" />
                <code className="font-mono text-sm text-foreground">
                  <span className="text-primary">$</span> npm install -g repofy
                </code>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                           bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium
                           transition-all duration-200 hover:scale-105"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Input form */}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 animate-fade-in-up animation-delay-200"
            >
              <div 
                className={`
                  glass-container p-2 transition-all duration-500
                  ${isFocused ? 'ring-2 ring-primary/30 border-primary/40' : ''}
                `}
                style={{
                  boxShadow: isFocused 
                    ? '0 0 80px -20px hsl(185 100% 50% / 0.4), 0 24px 48px -12px hsl(0 0% 0% / 0.5)' 
                    : undefined
                }}
              >
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="https://github.com/owner/repository"
                    className="flex-1 px-5 py-4 input-premium text-base font-mono"
                  />
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-3 whitespace-nowrap"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/60 pl-2">
                Works with public repositories · TypeScript, Python, Go, Rust & more
              </p>
            </form>

            {/* Stats or social proof */}
            <div className="flex items-center gap-8 pt-4 animate-fade-in-up animation-delay-300">
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-xs text-muted-foreground font-medium">Repos analyzed</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="space-y-1.5">
                <div className="text-2xl font-bold text-foreground">10M+</div>
                <div className="text-xs text-muted-foreground font-medium">Files explained</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="space-y-1.5">
                <div className="text-2xl font-bold gradient-text">4.9★</div>
                <div className="text-xs text-muted-foreground font-medium">Developer rating</div>
              </div>
            </div>
             <span className="text-xs font-semibold text-foreground/90 tracking-wide uppercase">
               
              </span>
          </div>

          {/* Right side - Terminal */}
          <div className="lg:pl-8 animate-fade-in-up animation-delay-400">
            <div className="relative">
              {/* Ambient glow behind terminal */}
              <div 
                className="absolute -inset-10 bg-primary/15 rounded-full blur-3xl animate-pulse-glow"
                aria-hidden="true" 
              />
              <div 
                className="absolute -inset-20 bg-purple-500/10 rounded-full blur-3xl"
                style={{ transform: 'translate(20%, 10%)' }}
                aria-hidden="true" 
              />
              <TerminalDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}