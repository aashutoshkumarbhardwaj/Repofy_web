import { useState } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  path: string;
}

interface FileTreeProps {
  files: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

function FileTreeNode({ node, depth, selectedPath, onSelect }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isSelected = selectedPath === node.path;
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
    onSelect(node.path);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-sm rounded-md transition-colors",
          isSelected 
            ? "bg-secondary text-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            <ChevronRight 
              className={cn(
                "w-3.5 h-3.5 transition-transform flex-shrink-0",
                isOpen && "rotate-90"
              )} 
            />
            <Folder className="w-4 h-4 flex-shrink-0" />
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File className="w-4 h-4 flex-shrink-0" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ files, selectedPath, onSelect }: FileTreeProps) {
  return (
    <div className="py-2">
      {files.map((file) => (
        <FileTreeNode
          key={file.path}
          node={file}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// Mock data for demo
export const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file", path: "src/components/Button.tsx" },
          { name: "Card.tsx", type: "file", path: "src/components/Card.tsx" },
          { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "src/hooks",
        children: [
          { name: "useAuth.ts", type: "file", path: "src/hooks/useAuth.ts" },
          { name: "useApi.ts", type: "file", path: "src/hooks/useApi.ts" },
        ],
      },
      {
        name: "lib",
        type: "folder",
        path: "src/lib",
        children: [
          { name: "utils.ts", type: "file", path: "src/lib/utils.ts" },
          { name: "api.ts", type: "file", path: "src/lib/api.ts" },
        ],
      },
      { name: "App.tsx", type: "file", path: "src/App.tsx" },
      { name: "main.tsx", type: "file", path: "src/main.tsx" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json" },
  { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
  { name: "README.md", type: "file", path: "README.md" },
];
