import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeRepo, explainFile, explainFolder, answerQuestion } from "./lib/analyzer.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  const { repoUrl } = req.body || {};
  if (!repoUrl) {
    return res.status(400).json({ error: "repoUrl is required" });
  }

  try {
    const result = await analyzeRepo(repoUrl);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return res.status(500).json({ error: message });
  }
});

app.post("/api/file", async (req, res) => {
  const { repoUrl, path } = req.body || {};
  if (!repoUrl || !path) {
    return res.status(400).json({ error: "repoUrl and path are required" });
  }

  try {
    const explanation = await explainFile(repoUrl, path);
    return res.json({ explanation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "File analysis failed";
    return res.status(500).json({ error: message });
  }
});

app.post("/api/folder", async (req, res) => {
  const { repoUrl, path } = req.body || {};
  if (!repoUrl || !path) {
    return res.status(400).json({ error: "repoUrl and path are required" });
  }

  try {
    const explanation = await explainFolder(repoUrl, path);
    return res.json({ explanation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Folder analysis failed";
    return res.status(500).json({ error: message });
  }
});

app.post("/api/question", async (req, res) => {
  const { repoUrl, question, context } = req.body || {};
  if (!repoUrl || !question) {
    return res.status(400).json({ error: "repoUrl and question are required" });
  }

  try {
    const answer = await answerQuestion(repoUrl, question, context || {});
    return res.json({ answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Question failed";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`RepoFy API listening on port ${port}`);
});
