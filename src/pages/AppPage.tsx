import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FileTree, mockFileTree, FileNode } from "@/components/FileTree";
import { ExplanationPanel, Explanation } from "@/components/ExplanationPanel";
import { QuestionInput } from "@/components/QuestionInput";
import { ArrowLeft, FileCode } from "lucide-react";

interface AnalysisResponse {
  repoName: string;
  tree: FileNode[];
  overview: Explanation;
  folders: Record<string, Explanation>;
}

interface FileExplanationResponse {
  explanation: Explanation;
}

interface FolderExplanationResponse {
  explanation: Explanation;
}

interface QuestionResponse {
  answer: Explanation;
}

const buildPathIndex = (nodes: FileNode[], index: Record<string, "file" | "folder"> = {}) => {
  nodes.forEach((node) => {
    index[node.path] = node.type;
    if (node.children && node.children.length > 0) {
      buildPathIndex(node.children, index);
    }
  });
  return index;
};

const AppPage = () => {
  const [searchParams] = useSearchParams();
  const repo = searchParams.get("repo");
  const repoUrl = repo ? decodeURIComponent(repo) : null;
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to repository...");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [explanations, setExplanations] = useState<Record<string, Explanation>>({});
  const [activeExplanation, setActiveExplanation] = useState<Explanation | null>(null);
  const [pathIndex, setPathIndex] = useState<Record<string, "file" | "folder">>({});
  const [error, setError] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const repoName = repo 
    ? decodeURIComponent(repo).split('/').slice(-2).join('/')
    : "example/repository";
  const displayRepoName = analysis?.repoName || repoName;

  useEffect(() => {
    if (!repoUrl) {
      setIsLoading(false);
      setAnalysis(null);
      setActiveExplanation(null);
      setExplanations({});
      setSelectedPath(null);
      setError("No repository URL provided.");
      return;
    }

    let cancelled = false;
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const runAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingMessage("Connecting to repository...");

      try {
        setLoadingMessage("Fetching file structure...");
        const response = await fetch(`${apiBase}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl }),
        });

        if (!response.ok) {
          throw new Error(`Analyze failed: ${response.status}`);
        }

        setLoadingMessage("Analyzing codebase...");
        const data = (await response.json()) as AnalysisResponse;
        if (cancelled) return;

        const nextIndex = buildPathIndex(data.tree);
        setAnalysis(data);
        setPathIndex(nextIndex);
        setExplanations({ "": data.overview, ...data.folders });
        setActiveExplanation(data.overview);
        setSelectedPath(null);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to analyze repository.";
        setError(message);
        setActiveExplanation({
          title: "Analysis failed",
          content: message,
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    runAnalysis();
    return () => {
      cancelled = true;
    };
  }, [repoUrl]);

  const handleSelect = async (path: string) => {
    setSelectedPath(path);
    if (!analysis || !repoUrl) return;

    const existing = explanations[path];
    if (existing) {
      setActiveExplanation(existing);
      return;
    }

    const type = pathIndex[path];
    if (type === "folder") {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
      setActiveExplanation({
        title: `Folder: ${path}`,
        content: "Analyzing this folder...",
      });

      try {
        const response = await fetch(`${apiBase}/api/folder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, path }),
        });
        if (!response.ok) {
          throw new Error(`Folder analysis failed: ${response.status}`);
        }
        const data = (await response.json()) as FolderExplanationResponse;
        setExplanations((prev) => ({ ...prev, [path]: data.explanation }));
        setActiveExplanation(data.explanation);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to analyze folder.";
        setActiveExplanation({
          title: `Folder: ${path}`,
          content: message,
        });
      }
      return;
    }

    if (type === "file") {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
      setActiveExplanation({
        title: `File: ${path}`,
        content: "Analyzing this file...",
      });

      try {
        const response = await fetch(`${apiBase}/api/file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, path }),
        });
        if (!response.ok) {
          throw new Error(`File analysis failed: ${response.status}`);
        }
        const data = (await response.json()) as FileExplanationResponse;
        setExplanations((prev) => ({ ...prev, [path]: data.explanation }));
        setActiveExplanation(data.explanation);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to analyze file.";
        setActiveExplanation({
          title: `File: ${path}`,
          content: message,
        });
      }
    }
  };

  const handleQuestion = async (question: string) => {
    if (!repoUrl) return;
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
    setIsAsking(true);
    setActiveExplanation({
      title: "Answer",
      content: "Thinking...",
    });

    try {
      const response = await fetch(`${apiBase}/api/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          question,
          context: {
            overview: analysis?.overview?.content,
            selectedPath,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`Question failed: ${response.status}`);
      }
      const data = (await response.json()) as QuestionResponse;
      setActiveExplanation(data.answer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to answer question.";
      setActiveExplanation({
        title: "Answer",
        content: message,
      });
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <FileCode className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="text-sm text-muted-foreground">
            {loadingMessage}
          </div>
          <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-primary/50 rounded-full transition-all duration-300" 
              style={{ width: loadingMessage.includes("Analyzing") ? "80%" : loadingMessage.includes("Fetching") ? "50%" : "20%" }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{displayRepoName}</span>
          </div>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>Explain My Codebase</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-border overflow-auto bg-card/50">
          <div className="px-3 py-3 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Files
            </span>
          </div>
          <FileTree 
            files={analysis?.tree || mockFileTree} 
            selectedPath={selectedPath} 
            onSelect={handleSelect} 
          />
        </aside>

        {/* Main panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ExplanationPanel
              selectedPath={selectedPath}
              repoName={displayRepoName}
              explanation={activeExplanation}
            />
          </div>

          <div className="flex-shrink-0 p-4 border-t border-border bg-background">
            <div className="max-w-2xl">
              <QuestionInput onSubmit={handleQuestion} isLoading={isAsking} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppPage;
