const GITHUB_API = "https://api.github.com";

const getHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

export const parseRepoUrl = (repoUrl) => {
  const trimmed = repoUrl.trim();

  if (trimmed.startsWith("git@")) {
    const match = trimmed.match(/git@github\.com:(.+?)\/(.+?)(\.git)?$/);
    if (!match) throw new Error("Unsupported GitHub SSH URL");
    return { owner: match[1], repo: match[2] };
  }

  let normalized = trimmed;
  if (normalized.startsWith("github.com/")) {
    normalized = `https://${normalized}`;
  }

  let url;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error("Invalid repository URL");
  }

  if (!url.hostname.includes("github.com")) {
    throw new Error("Only GitHub URLs are supported right now");
  }

  const parts = url.pathname.replace(/^\/+/, "").split("/");
  if (parts.length < 2) {
    throw new Error("Repository URL must include owner and repo");
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");
  return { owner, repo };
};

export const fetchRepoMeta = async (owner, repo) => {
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`GitHub repo fetch failed: ${response.status}`);
  }
  return response.json();
};

export const fetchRepoTree = async (owner, repo, branch) => {
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders() }
  );
  if (!response.ok) {
    throw new Error(`GitHub tree fetch failed: ${response.status}`);
  }
  const data = await response.json();
  if (data.truncated) {
    console.warn("GitHub tree response truncated. Results may be incomplete.");
  }
  return data.tree || [];
};

export const fetchFileContent = async (owner, repo, path) => {
  const safePath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${safePath}`,
    { headers: getHeaders() }
  );
  if (!response.ok) {
    return "";
  }
  const data = await response.json();
  if (Array.isArray(data)) return "";
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return "";
};

export const fetchReadme = async (owner, repo) => {
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
    headers: getHeaders(),
  });
  if (!response.ok) return "";
  const data = await response.json();
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return "";
};
