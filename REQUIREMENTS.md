# Requirements Document

## Project Overview

**Project Name:** Explain My Codebase (RepoFy)

**Version:** 1.0.0

**Purpose:** An AI-powered web application that analyzes GitHub repositories and provides intelligent explanations of codebases, helping developers quickly understand unfamiliar projects through natural language descriptions and interactive exploration.

---

## 1. Business Requirements

### 1.1 Problem Statement
Developers frequently need to understand unfamiliar codebases when:
- Onboarding to new projects
- Contributing to open-source repositories
- Reviewing code from other teams
- Evaluating third-party libraries

Traditional approaches (reading documentation, exploring files manually) are time-consuming and often incomplete.

### 1.2 Solution
An intelligent codebase analyzer that:
- Automatically generates human-readable explanations of repositories
- Provides context-aware descriptions of files and folders
- Answers specific questions about the codebase
- Presents information through an intuitive visual interface

### 1.3 Target Users
- Software developers (all experience levels)
- Technical leads and architects
- Open-source contributors
- Code reviewers
- Engineering managers

### 1.4 Success Criteria
- Users can understand a new codebase's purpose within 2 minutes
- 80% reduction in time spent navigating unfamiliar code
- Accurate, relevant explanations for files and folders
- Responsive, intuitive user interface

---

## 2. Functional Requirements

### 2.1 Repository Analysis

**FR-1: Repository Input**
- System shall accept GitHub repository URLs in multiple formats:
  - HTTPS: `https://github.com/owner/repo`
  - Short form: `github.com/owner/repo`
  - SSH: `git@github.com:owner/repo.git`
- System shall validate repository URLs before processing
- System shall display clear error messages for invalid URLs

**FR-2: Repository Overview Generation**
- System shall generate a comprehensive overview containing:
  - What the project does
  - Who the project is for
  - Main technologies used
  - High-level architecture
- System shall analyze README, package.json, and repository metadata
- System shall complete analysis within 30 seconds for typical repositories

**FR-3: File Tree Visualization**
- System shall display complete repository file structure
- System shall organize files hierarchically with folders and files
- System shall support expanding/collapsing folder nodes
- System shall highlight selected files/folders

### 2.2 File and Folder Explanations

**FR-4: File Analysis**
- System shall generate explanations for individual files containing:
  - What the file does
  - Important logic
  - How data flows
- System shall handle files up to 12,000 characters
- System shall cache file explanations to improve performance

**FR-5: Folder Analysis**
- System shall generate explanations for folders containing:
  - What the folder is responsible for
  - Why it exists
  - What kind of files live there
- System shall analyze up to 25 top-level folders automatically
- System shall generate on-demand explanations for additional folders

**FR-6: Interactive Exploration**
- Users shall click on any file or folder to view its explanation
- System shall display loading states during analysis
- System shall maintain explanation history during session

### 2.3 Question Answering

**FR-7: Natural Language Questions**
- Users shall ask questions about the codebase in natural language
- System shall provide context-aware answers based on:
  - Repository overview
  - Currently selected file/folder
  - README content
  - Relevant file paths
- System shall display "thinking" state while processing questions

**FR-8: Intelligent Context**
- System shall identify relevant files based on question keywords
- System shall reference specific files/folders in answers
- System shall admit uncertainty when information is insufficient

### 2.4 User Interface

**FR-9: Landing Page**
- System shall display a marketing landing page at root URL
- Landing page shall include:
  - Hero section with repository input
  - Features section
  - Visual demonstrations
  - Navigation to app

**FR-10: Analysis Interface**
- System shall provide three-panel layout:
  - Left sidebar: File tree navigation
  - Center panel: Explanation display
  - Bottom panel: Question input
- System shall display repository name in header
- System shall provide navigation back to landing page

**FR-11: Responsive Design**
- Interface shall be usable on desktop screens (1024px+)
- Interface shall adapt to different screen sizes
- Interface shall maintain readability at all viewport sizes

---

## 3. Non-Functional Requirements

### 3.1 Performance

**NFR-1: Response Times**
- Initial repository analysis: < 30 seconds
- File explanation generation: < 5 seconds
- Folder explanation generation: < 5 seconds
- Question answering: < 10 seconds
- UI interactions: < 100ms

**NFR-2: Caching**
- System shall cache repository analyses in memory
- System shall cache file explanations to avoid redundant API calls
- Cache shall persist for duration of server session

### 3.2 Scalability

**NFR-3: Concurrent Users**
- System shall support multiple concurrent repository analyses
- System shall handle at least 10 simultaneous users
- System shall implement request queuing if needed

**NFR-4: Repository Size**
- System shall handle repositories with up to 10,000 files
- System shall gracefully handle GitHub API truncation
- System shall display warnings for incomplete results

### 3.3 Reliability

**NFR-5: Error Handling**
- System shall handle GitHub API failures gracefully
- System shall handle LLM API failures gracefully
- System shall display user-friendly error messages
- System shall log errors for debugging

**NFR-6: Availability**
- System shall have 99% uptime during business hours
- System shall recover automatically from transient failures
- System shall provide health check endpoint

### 3.4 Security

**NFR-7: API Security**
- System shall support GitHub personal access tokens
- System shall not expose API keys to client
- System shall implement CORS protection
- System shall validate all user inputs

**NFR-8: Data Privacy**
- System shall not store repository content permanently
- System shall not log sensitive information
- System shall respect GitHub repository permissions

### 3.5 Usability

**NFR-9: User Experience**
- Interface shall follow modern design principles
- Interface shall provide clear visual feedback
- Interface shall use consistent terminology
- Interface shall be accessible (WCAG 2.1 guidelines)

**NFR-10: Documentation**
- System shall provide clear setup instructions
- System shall document environment variables
- System shall include API documentation

### 3.6 Maintainability

**NFR-11: Code Quality**
- Code shall follow consistent style guidelines
- Code shall include appropriate comments
- Code shall be modular and reusable
- Code shall use TypeScript for type safety (frontend)

**NFR-12: Testing**
- System shall include unit tests for critical functions
- System shall include integration tests for API endpoints
- System shall maintain test coverage above 70%

---

## 4. Technical Requirements

### 4.1 Frontend Stack

**TR-1: Core Technologies**
- React 18.3+ for UI framework
- TypeScript 5.8+ for type safety
- Vite 5.4+ for build tooling
- React Router 6.30+ for navigation

**TR-2: UI Components**
- shadcn/ui component library
- Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons

**TR-3: State Management**
- React Query (TanStack Query) for server state
- React hooks for local state
- URL search params for shareable state

### 4.2 Backend Stack

**TR-4: Server Technologies**
- Node.js 20+ runtime
- Express.js for API server
- ES modules (type: "module")
- dotenv for configuration

**TR-5: External APIs**
- GitHub REST API v3 for repository data
- OpenRouter API for LLM capabilities
- Support for multiple LLM models

### 4.3 Development Tools

**TR-6: Development Environment**
- ESLint for code linting
- Vitest for testing
- npm/bun for package management
- Git for version control

### 4.4 Deployment

**TR-7: Hosting Requirements**
- Support for Render.yaml deployment
- Environment variable configuration
- Health check endpoint
- CORS configuration for production

---

## 5. API Requirements

### 5.1 REST Endpoints

**API-1: Health Check**
- Endpoint: `GET /health`
- Response: `{ "ok": true }`
- Purpose: Service health monitoring

**API-2: Analyze Repository**
- Endpoint: `POST /api/analyze`
- Request: `{ "repoUrl": string }`
- Response: `{ "repoName": string, "tree": FileNode[], "overview": Explanation, "folders": Record<string, Explanation> }`
- Purpose: Generate complete repository analysis

**API-3: Explain File**
- Endpoint: `POST /api/file`
- Request: `{ "repoUrl": string, "path": string }`
- Response: `{ "explanation": Explanation }`
- Purpose: Generate file-specific explanation

**API-4: Explain Folder**
- Endpoint: `POST /api/folder`
- Request: `{ "repoUrl": string, "path": string }`
- Response: `{ "explanation": Explanation }`
- Purpose: Generate folder-specific explanation

**API-5: Answer Question**
- Endpoint: `POST /api/question`
- Request: `{ "repoUrl": string, "question": string, "context": object }`
- Response: `{ "answer": Explanation }`
- Purpose: Answer natural language questions

### 5.2 Data Models

**Explanation**
```typescript
{
  title: string;
  content: string;
}
```

**FileNode**
```typescript
{
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
}
```

---

## 6. Environment Configuration

### 6.1 Required Variables

**ENV-1: GitHub Integration**
- `GITHUB_TOKEN` (optional): GitHub personal access token for higher rate limits

**ENV-2: LLM Integration**
- `OPENROUTER_API_KEY` (required): OpenRouter API key for LLM access
- `OPENROUTER_MODEL` (optional): Model identifier (default: openai/gpt-4o-mini)
- `OPENROUTER_SITE_URL` (optional): Site URL for OpenRouter tracking
- `OPENROUTER_APP_NAME` (optional): App name for OpenRouter tracking

**ENV-3: Server Configuration**
- `PORT` (optional): Server port (default: 3001)
- `CORS_ORIGIN` (optional): Allowed CORS origins (comma-separated)
- `VITE_API_URL` (optional): API base URL for frontend

---

## 7. Constraints and Assumptions

### 7.1 Constraints
- GitHub API rate limits (60 requests/hour unauthenticated, 5000/hour authenticated)
- OpenRouter API rate limits and costs
- Browser memory limitations for large repositories
- LLM context window limitations

### 7.2 Assumptions
- Users have internet connectivity
- GitHub repositories are public or user has access
- Users understand basic Git/GitHub concepts
- Modern browser with JavaScript enabled

---

## 8. Future Enhancements

### 8.1 Planned Features
- Support for GitLab and Bitbucket repositories
- User authentication and saved analyses
- Comparison between repository versions
- Export explanations to documentation formats
- Integration with IDE extensions
- Support for private repositories
- Multi-language support
- Code search within explanations
- Dependency graph visualization
- Architecture diagram generation

### 8.2 Technical Improvements
- WebSocket support for real-time updates
- Progressive analysis (stream results)
- Offline mode with cached data
- Mobile-responsive design
- Dark/light theme toggle
- Keyboard shortcuts
- Accessibility improvements
- Performance monitoring
- Analytics integration

---

## 9. Acceptance Criteria

### 9.1 Core Functionality
- [ ] User can input GitHub repository URL
- [ ] System generates repository overview
- [ ] System displays interactive file tree
- [ ] User can click files to see explanations
- [ ] User can click folders to see explanations
- [ ] User can ask questions about codebase
- [ ] System provides relevant answers

### 9.2 Quality Standards
- [ ] All API endpoints return within specified time limits
- [ ] Error messages are clear and actionable
- [ ] UI is responsive and intuitive
- [ ] Code passes linting checks
- [ ] Tests achieve 70%+ coverage
- [ ] Documentation is complete and accurate

### 9.3 Deployment
- [ ] Application deploys successfully to production
- [ ] Environment variables are properly configured
- [ ] Health check endpoint responds correctly
- [ ] CORS is properly configured
- [ ] Application is accessible via public URL

---

## 10. Glossary

- **Repository**: A Git repository hosted on GitHub
- **Codebase**: The complete set of source code for a project
- **File Tree**: Hierarchical representation of files and folders
- **Explanation**: AI-generated natural language description
- **LLM**: Large Language Model (AI system for text generation)
- **OpenRouter**: API service providing access to multiple LLM providers
- **Analysis**: Process of examining and explaining code structure
- **Context**: Relevant information used to generate explanations

---

## Document Control

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Status:** Active  
**Owner:** Development Team
