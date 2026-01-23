import { Link } from "react-router-dom";
import { Github, Terminal } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="glass-container-subtle px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent
                            flex items-center justify-center
                            group-hover:shadow-[0_0_30px_-5px_hsl(185_100%_50%/0.5)] transition-all duration-500">
                <Terminal className="w-5 h-5 text-primary-foreground" />
                <div className="absolute -inset-1 bg-primary/30 rounded-xl blur-lg opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">
                Repofy
              </span>
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                         text-muted-foreground hover:text-foreground
                         hover:bg-foreground/5 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm hidden sm:inline font-medium">GitHub</span>
              </a>
              <Link 
                to="/app" 
                className="px-5 py-2.5 rounded-xl text-sm font-medium
                         bg-gradient-to-r from-primary/10 to-accent/10 
                         hover:from-primary/20 hover:to-accent/20 
                         border border-primary/20 hover:border-primary/40
                         text-foreground transition-all duration-300
                         hover:shadow-[0_0_20px_-5px_hsl(185_100%_50%/0.3)]"
              >
                Launch App
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}