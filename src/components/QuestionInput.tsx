import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSubmit(question);
    setQuestion("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass-container p-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this codebase..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-transparent text-sm text-foreground 
                       placeholder:text-muted-foreground/50
                       focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:bg-primary/90 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
