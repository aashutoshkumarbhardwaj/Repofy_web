# Repofy 🤖

> AI-powered repository intelligence — understand any codebase in minutes, not days.

[![NPM Downloads](https://img.shields.io/npm/dt/repofy)](https://www.npmjs.com/package/repofy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Repofy analyzes GitHub/GitLab repositories and auto-generates documentation, onboarding guides, and health reports using AI — so you can focus on building, not exploring.

---

## ✨ Features

- **AI-Powered Analysis** — Understands code context via OpenRouter LLM and generates human-readable docs
- **README & Doc Generation** — Creates comprehensive documentation from your codebase automatically
- **Tech Stack Detection** — Identifies languages, frameworks, and tools at a glance
- **Repository Health Scores** — Quantified metrics for documentation quality and maintainability
- **Onboarding Guides** — Auto-generated setup instructions and contribution workflows
- **Contributor Analytics** — Activity trends, top contributors, and engagement metrics

---

## 🚀 Quick Start

**Via npx (no install needed):**
```bash
npx repofy analyze https://github.com/username/repo
```

**Global install:**
```bash
npm install -g repofy
repofy analyze https://github.com/username/repo
```

---

## 🛠️ Usage

### CLI
```bash
# Analyze a repository
repofy analyze <repository-url>

# Generate a README
repofy docs <repository-url>

# Get health score
repofy health <repository-url>
```

### API
```js
const repofy = require('repofy');

const report = await repofy.analyze('https://github.com/username/repo');
console.log(report.summary);
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI/ML | OpenRouter LLM, Archestra AI |
| Backend | Node.js, Express |
| Frontend | React |
| CLI | Commander.js, Inquirer |
| APIs | GitHub API, GitLab API |

---

## 🗺️ Roadmap

- [x] CLI tool with basic analysis
- [x] Web platform MVP
- [x] OpenRouter LLM integration
- [ ] GitHub App integration
- [ ] VS Code extension
- [ ] Automated documentation updates
- [ ] Team collaboration features
- [ ] Enterprise analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 📬 Connect

- **NPM:** [npmjs.com/package/repofy](https://npmjs.com/package/repofy)
- **Website:** [your-website-url]
- **LinkedIn:** [your-linkedin]
- **Twitter:** [your-twitter]

Built with ❤️ for the developer community · #2FAST2MCP Hackathon participant
