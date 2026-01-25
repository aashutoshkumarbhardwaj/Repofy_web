import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Explain My Codebase
        </span>
        <Link 
          to="/app" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Open App
        </Link>
      </div>
    </header>
  );
}
