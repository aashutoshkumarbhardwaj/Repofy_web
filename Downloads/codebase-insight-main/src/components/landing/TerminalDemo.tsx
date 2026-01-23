import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface TerminalLine {
  type: "command" | "info" | "success" | "header" | "text" | "output" | "highlight" | "npm";
  content: string;
  delay?: number;
}

const lines: TerminalLine[] = [
  { type: "npm", content: "npm install -g repofy", delay: 800 },
  { type: "success", content: "✓ repofy@1.0.0 installed globally", delay: 400 },
  { type: "output", content: "", delay: 200 },
  { type: "command", content: "repofy https://github.com/facebook/react", delay: 600 },
  { type: "output", content: "", delay: 200 },
  { type: "info", content: "Cloning repository...", delay: 400 },
  { type: "success", content: "✓ Fetched 2,847 files in 1.8s", delay: 300 },
  { type: "output", content: "", delay: 100 },
  { type: "info", content: "Analyzing architecture...", delay: 500 },
  { type: "success", content: "✓ Identified 156 React components", delay: 300 },
  { type: "success", content: "✓ Mapped 42 hooks and utilities", delay: 250 },
  { type: "output", content: "", delay: 100 },
  { type: "info", content: "Generating insights...", delay: 400 },
  { type: "success", content: "✓ Analysis complete", delay: 300 },
  { type: "output", content: "", delay: 200 },
  { type: "header", content: "─── Overview ───────────────────────", delay: 150 },
  { type: "output", content: "", delay: 50 },
  { type: "highlight", content: "React is a declarative JavaScript library", delay: 80 },
  { type: "text", content: "for building component-based user interfaces.", delay: 80 },
  { type: "output", content: "", delay: 50 },
  { type: "text", content: "Key architectural patterns:", delay: 100 },
  { type: "text", content: "  → Virtual DOM reconciliation", delay: 80 },
  { type: "text", content: "  → Fiber architecture for async rendering", delay: 80 },
  { type: "text", content: "  → Hooks for stateful logic composition", delay: 80 },
];

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentDelay, setCurrentDelay] = useState(800);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const nextLine = lines[visibleLines];
      const timeout = setTimeout(() => {
        setVisibleLines(v => v + 1);
        setCurrentDelay(nextLine.delay || 200);
      }, currentDelay);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, currentDelay]);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g repofy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-window animate-float relative">
      {/* Terminal header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground/60 font-mono">
            repofy — zsh
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg 
                   bg-primary/10 hover:bg-primary/20 text-primary text-xs 
                   transition-all duration-200"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Terminal content */}
      <div className="p-5 font-mono text-[13px] leading-relaxed space-y-0.5 min-h-[400px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (
          <TerminalLine key={i} line={line} index={i} />
        ))}
        {visibleLines < lines.length && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-primary">❯</span>
            <span className="w-2 h-5 bg-primary cursor-blink" />
          </div>
        )}
      </div>

      {/* Subtle reflection effect */}
      <div 
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-t-2xl"
        aria-hidden="true"
      />
      
      {/* Bottom glow */}
      <div 
        className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function TerminalLine({ line, index }: { line: TerminalLine; index: number }) {
  const getLineContent = () => {
    switch (line.type) {
      case "npm":
        return (
          <div className="flex items-center gap-2 py-1">
            <span className="text-primary font-semibold">$</span>
            <span className="text-foreground">{line.content}</span>
          </div>
        );
      case "command":
        return (
          <div className="flex items-center gap-2">
            <span className="text-primary">❯</span>
            <span className="text-foreground">{line.content}</span>
          </div>
        );
      case "info":
        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">◦</span>
            <span className="text-muted-foreground">{line.content}</span>
          </div>
        );
      case "success":
        return (
          <span className="text-emerald-400">{line.content}</span>
        );
      case "header":
        return (
          <span className="text-primary/70">{line.content}</span>
        );
      case "highlight":
        return (
          <span className="text-foreground font-medium">{line.content}</span>
        );
      case "text":
        return (
          <span className="text-muted-foreground">{line.content}</span>
        );
      case "output":
        return <div className="h-2" />;
      default:
        return <span className="text-foreground">{line.content}</span>;
    }
  };

  return (
    <div 
      className="animate-fade-in-up"
      style={{ 
        animationDuration: '0.3s',
        animationDelay: '0ms'
      }}
    >
      {getLineContent()}
    </div>
  );
}