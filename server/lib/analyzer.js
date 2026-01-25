import {
  parseRepoUrl,
  fetchRepoMeta,
  fetchRepoTree,
  fetchFileContent,
  fetchReadme,
} from "./github.js";
import { generateText } from "./llm.js";

const analysisCache = new Map();
const fileCache = new Map();

const MAX_FOLDER_SUMMARIES = 25;
const MAX_FILE_CHARS = 12000;

const buildFileTree = (paths) => {
  const root = [];
  const nodeMap = new Map();

  const getOrCreateFolder = (path, name) => {
    if (nodeMap.has(path)) return nodeMap.get(path);
    const node = { name, type: "folder", path, children: [] };
    nodeMap.set(path, node);
    return node;
  };

  paths.forEach((filePath) => {
    const parts = filePath.split("/");
    let currentPath = "";
    let parent = null;

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLeaf = index === parts.length - 1;
      if (isLeaf) {
        const fileNode = { name: part, type: "file", path: currentPath };
        if (parent) {
          parent.children.push(fileNode);
        } else {
          root.push(fileNode);
        }
      } else {
        const folderNode = getOrCreateFolder(currentPath, part);
        if (parent && !parent.children.find((child) => child.path === folderNode.path)) {
          parent.children.push(folderNode);
        } else if (!parent && !root.find((child) => child.path === folderNode.path)) {
          root.push(folderNode);
        }
        parent = folderNode;
      }
    });
  });

  return root;
};

const listFolderPaths = (nodes, folders = []) => {
  nodes.forEach((node) => {
    if (node.type === "folder") {
      folders.push(node.path);
      if (node.children && node.children.length) {
        listFolderPaths(node.children, folders);
      }
    }
  });
  return folders;
};

const truncate = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}\n...` : text;
};

const getRepoKey = (owner, repo) => `${owner}/${repo}`;

const formatOverviewPrompt = ({ repoMeta, readme, packageJson, folderPaths }) => `
You are explaining a codebase to a developer new to the repo.
Write in plain English with no marketing.
Return exactly four sections with these headings:

**What this project does**
**Who this project is for**
**Main technologies used**
**High-level architecture**

Keep each section short and concrete. If uncertain, say so.

Repository metadata:
Name: ${repoMeta.full_name}
Description: ${repoMeta.description || "No description"}
Default branch: ${repoMeta.default_branch}
Primary language: ${repoMeta.language || "Unknown"}

Folder list (top-level + notable):
${folderPaths.slice(0, 20).join(", ")}

README excerpt:
${truncate(readme, 4000)}

package.json excerpt:
${truncate(packageJson, 4000)}
`;

const formatFolderPrompt = ({ folderPath, folderFiles }) => `
You are explaining a folder in a codebase. Write in plain English.
Return exactly three sections with these headings:

**What this folder is responsible for**
**Why it exists**
**What kind of files live here**

Folder: ${folderPath}
Files (samples):
${folderFiles.slice(0, 30).join("\n")}
`;

const formatFilePrompt = ({ filePath, fileContent }) => `
You are explaining a file in a codebase. Write in plain English.
Return exactly three sections with these headings:

**What this file does**
**Important logic**
**How data flows**

File: ${filePath}
Content (truncated):
${truncate(fileContent, MAX_FILE_CHARS)}
`;

const formatQuestionPrompt = ({ question, overview, relevantFiles, readme }) => `
Answer the user's question based on the repository context.
Be direct and honest. If unsure, say so.
Prefer pointing to specific files or folders.

Question:
${question}

Repository overview:
${truncate(overview, 2000)}

Relevant file paths:
${relevantFiles.slice(0, 30).join("\n")}

README excerpt:
${truncate(readme, 2000)}
`;

export const analyzeRepo = async (repoUrl) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoKey = getRepoKey(owner, repo);

  if (analysisCache.has(repoKey)) {
    return analysisCache.get(repoKey).result;
  }

  const repoMeta = await fetchRepoMeta(owner, repo);
  const treeEntries = await fetchRepoTree(owner, repo, repoMeta.default_branch);
  const filePaths = treeEntries
    .filter((item) => item.type === "blob")
    .map((item) => item.path);
  const tree = buildFileTree(filePaths);
  const folderPaths = listFolderPaths(tree);

  const readme = await fetchReadme(owner, repo);
  const packageJson = await fetchFileContent(owner, repo, "package.json");

  const overviewContent =
    (await generateText(formatOverviewPrompt({ repoMeta, readme, packageJson, folderPaths }))) ||
    "LLM is not configured. Set OPENROUTER_API_KEY to enable repository analysis.";

  const overview = {
    title: "Repository Overview",
    content: overviewContent.trim(),
  };

  const folders = {};
  const limitedFolders = folderPaths.slice(0, MAX_FOLDER_SUMMARIES);
  for (const folderPath of limitedFolders) {
    const sampleFiles = filePaths.filter((path) => path.startsWith(`${folderPath}/`)).slice(0, 40);
    const content =
      (await generateText(formatFolderPrompt({ folderPath, folderFiles: sampleFiles }))) ||
      "LLM is not configured. Set OPENROUTER_API_KEY to enable folder summaries.";
    folders[folderPath] = {
      title: `Folder: ${folderPath}`,
      content: content.trim(),
    };
  }

  const result = {
    repoName: repoMeta.full_name,
    tree,
    overview,
    folders,
  };

  analysisCache.set(repoKey, {
    result,
    filePaths,
    readme,
    repoMeta,
  });
  return result;
};

export const explainFolder = async (repoUrl, folderPath) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoKey = getRepoKey(owner, repo);
  let filePaths = [];

  if (analysisCache.has(repoKey)) {
    filePaths = analysisCache.get(repoKey).filePaths || [];
  } else {
    const repoMeta = await fetchRepoMeta(owner, repo);
    const treeEntries = await fetchRepoTree(owner, repo, repoMeta.default_branch);
    filePaths = treeEntries.filter((item) => item.type === "blob").map((item) => item.path);
  }

  const folderFiles = filePaths.filter((path) => path.startsWith(`${folderPath}/`)).slice(0, 40);
  const content =
    (await generateText(formatFolderPrompt({ folderPath, folderFiles }))) ||
    "LLM is not configured. Set OPENROUTER_API_KEY to enable folder summaries.";

  return {
    title: `Folder: ${folderPath}`,
    content: content.trim(),
  };
};

export const explainFile = async (repoUrl, path) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoKey = getRepoKey(owner, repo);
  const cacheKey = `${repoKey}:${path}`;
  if (fileCache.has(cacheKey)) {
    return fileCache.get(cacheKey);
  }

  const fileContent = await fetchFileContent(owner, repo, path);
  const content =
    (await generateText(formatFilePrompt({ filePath: path, fileContent }))) ||
    "LLM is not configured. Set OPENROUTER_API_KEY to enable file explanations.";

  const explanation = {
    title: `File: ${path}`,
    content: content.trim(),
  };

  fileCache.set(cacheKey, explanation);
  return explanation;
};

export const answerQuestion = async (repoUrl, question, context) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoKey = getRepoKey(owner, repo);
  let filePaths = [];
  let readme = "";

  if (analysisCache.has(repoKey)) {
    const cached = analysisCache.get(repoKey);
    filePaths = cached.filePaths || [];
    readme = cached.readme || "";
  } else {
    const repoMeta = await fetchRepoMeta(owner, repo);
    const treeEntries = await fetchRepoTree(owner, repo, repoMeta.default_branch);
    filePaths = treeEntries
      .filter((item) => item.type === "blob")
      .map((item) => item.path);
    readme = await fetchReadme(owner, repo);
  }

  const tokens = question
    .toLowerCase()
    .split(/[^a-z0-9_/.-]+/g)
    .filter((token) => token.length > 3);
  const relevantFiles = filePaths.filter((path) =>
    tokens.some((token) => path.toLowerCase().includes(token))
  );

  const prompt = formatQuestionPrompt({
    question,
    overview: context?.overview || "",
    relevantFiles,
    readme,
  });

  const answerText =
    (await generateText(prompt)) ||
    "LLM is not configured. Set OPENROUTER_API_KEY to enable question answering.";

  return {
    title: "Answer",
    content: answerText.trim(),
  };
};
