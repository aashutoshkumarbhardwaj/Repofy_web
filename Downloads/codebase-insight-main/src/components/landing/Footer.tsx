import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 px-6 relative">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-5xl mx-auto">
        {/* CTA Section */}
        <div className="glass-container p-10 md:p-14 text-center space-y-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight relative">
            Ready to understand code faster?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg relative">
            Join thousands of developers who save hours every week.
          </p>
          
          {/* NPM Install Command */}
          <div className="glass-container-subtle inline-flex items-center gap-3 px-5 py-3 font-mono text-sm relative">
            <span className="text-primary">$</span>
            <code className="text-foreground">npm install -g repofy</code>
            <button 
              onClick={() => navigator.clipboard.writeText('npm install -g repofy')}
              className="ml-2 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 
                       text-primary text-xs transition-colors"
            >
              Copy
            </button>
          </div>
          
          <div className="relative">
            <Link 
              to="/app" 
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Started — It's Free
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-10 border-t border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Repofy
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground/60">
            Built for developers who ship fast. © 2024
          </p>
        </div>
      </div>
    </footer>
  );
}