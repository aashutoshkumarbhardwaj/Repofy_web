# Design Document

## Project Overview

**Project Name:** Explain My Codebase (RepoFy)  
**Architecture:** Full-stack web application with React frontend and Express backend  
**Purpose:** AI-powered GitHub repository analyzer with intelligent code explanations

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite + TypeScript)                       │  │
│  │  - Landing Page                                       │  │
│  │  - Analysis Interface                                 │  │
│  │  - Component Library (shadcn/ui)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                        Server Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API Server                               │  │
│  │  - REST Endpoints                                     │  │
│  │  - CORS Middleware                                    │  │
│  │  - Request Validation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                 │  │
│  │  - Analyzer (orchestration)                          │  │
│  │  - GitHub Client (data fetching)                     │  │
│  │  - LLM Client (AI generation)                        │  │
│  │  - Caching Layer (in-memory)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────────┐         ┌──────────────────────────┐     │
│  │  GitHub API  │         │  OpenRouter API          │     │
│  │  (REST v3)   │         │  (LLM Provider)          │     │
│  └──────────────┘         └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Interaction Flow

```
User Input (Repository URL)
    ↓
Landing Page (HeroInput)
    ↓
Navigate to /app?repo=<url>
    ↓
AppPage Component
    ↓
POST /api/analyze
    ↓
Analyzer.analyzeRepo()
    ├─→ GitHub.fetchRepoMeta()
    ├─→ GitHub.fetchRepoTree()
    ├─→ GitHub.fetchReadme()
    ├─→ GitHub.fetchFileContent(package.json)
    └─→ LLM.generateText(overview prompt)
    └─→ LLM.generateText(folder prompts) × N
    ↓
Return: { repoName, tree, overview, folders }
    ↓
Display in UI (FileTree + ExplanationPanel)
    ↓
User Interaction (click file/folder or ask question)
    ↓
POST /api/file or /api/folder or /api/question
    ↓
Generate explanation
    ↓
Update ExplanationPanel
```

---

## 2. Frontend Design

### 2.1 Application Structure

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component with routing
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── AppPage.tsx         # Main analysis interface
│   └── NotFound.tsx        # 404 page
├── components/
│   ├── landing/            # Landing page components
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TerminalDemo.tsx
│   │   └── Footer.tsx
│   ├── FileTree.tsx        # Repository file tree
│   ├── ExplanationPanel.tsx # Explanation display
│   ├── QuestionInput.tsx   # Question input field
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx      # Mobile detection
│   └── use-toast.ts        # Toast notifications
└── lib/
    └── utils.ts            # Utility functions
```

### 2.2 Key Components

#### 2.2.1 AppPage Component

**Purpose:** Main application interface for repository analysis

**State Management:**
```typescript
- selectedPath: string | null          // Currently selected file/folder
- isLoading: boolean                   // Initial analysis loading
- loadingMessage: string               // Progress message
- analysis: AnalysisResponse | null    // Repository analysis data
- explanations: Record<string, Explanation> // Cached explanations
- activeExplanation: Explanation | null // Currently displayed
- pathIndex: Record<string, "file" | "folder"> // Path type lookup
- error: string | null                 // Error message
- isAsking: boolean                    // Question processing state
```

**Key Functions:**
- `handleSelect(path)`: Handle file/folder selection
- `handleQuestion(question)`: Process user questions
- `buildPathIndex(nodes)`: Build path-to-type mapping

**Data Flow:**
1. Extract repo URL from query params
2. Fetch analysis on mount
3. Display file tree and overview
4. Handle user interactions (select, question)
5. Update explanation panel

#### 2.2.2 FileTree Component

**Purpose:** Display hierarchical repository structure

**Props:**
```typescript
interface FileTreeProps {
  files: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}
```

**Features:**
- Recursive rendering of file/folder hierarchy
- Expand/collapse folder nodes
- Visual distinction between files and folders
- Selection highlighting
- Icon indicators (folder, file)

#### 2.2.3 ExplanationPanel Component

**Purpose:** Display AI-generated explanations

**Props:**
```typescript
interface ExplanationPanelProps {
  selectedPath: string | null;
  repoName: string;
  explanation: Explanation | null;
}
```

**Features:**
- Markdown rendering support
- Loading states
- Error states
- Responsive layout
- Scrollable content

#### 2.2.4 QuestionInput Component

**Purpose:** Natural language question input

**Props:**
```typescript
interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}
```

**Features:**
- Text input with submit button
- Loading state during processing
- Enter key submission
- Input validation

### 2.3 Routing Strategy

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/app" element={<AppPage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**URL Parameters:**
- `/app?repo=<encoded-url>`: Analysis page with repository

### 2.4 State Management Strategy

**Local State (useState):**
- Component-specific UI state
- Form inputs
- Loading flags

**URL State (useSearchParams):**
- Repository URL (shareable)
- Enables deep linking

**Server State (React Query):**
- Not currently used but available
- Future: Optimistic updates, cache management

**Derived State:**
- Path index (computed from file tree)
- Active explanation (selected from cache)

### 2.5 Styling Architecture

**Approach:** Utility-first with Tailwind CSS

**Theme System:**
```css
CSS Variables (defined in index.css):
- --background, --foreground
- --card, --card-foreground
- --primary, --primary-foreground
- --secondary, --secondary-foreground
- --muted, --muted-foreground
- --accent, --accent-foreground
- --border, --ring
```

**Component Styling:**
- shadcn/ui components with Radix UI primitives
- Tailwind utility classes
- Custom CSS for special effects (grid, gradients)
- Responsive breakpoints (sm, md, lg, xl)

**Visual Effects:**
- Grid background pattern
- Radial gradient overlays
- Noise texture
- Glass morphism effects
- Smooth transitions

---

## 3. Backend Design

### 3.1 Server Architecture

```
server/
├── index.js              # Express server setup
└── lib/
    ├── analyzer.js       # Business logic orchestration
    ├── github.js         # GitHub API client
    └── llm.js           # LLM API client
```

### 3.2 API Layer (index.js)

**Responsibilities:**
- HTTP server setup
- CORS configuration
- Request routing
- Error handling
- Response formatting

**Middleware Stack:**
```javascript
1. CORS (dynamic origin validation)
2. express.json (body parsing, 2MB limit)
3. Route handlers
4. Error handlers
```

**CORS Strategy:**
```javascript
Allowed Origins:
- Environment variable CORS_ORIGIN (comma-separated)
- Wildcard "*" support
- Pattern matching (*.vercel.app, *repofy*)
- Credentials support (when not wildcard)
```

### 3.3 Business Logic Layer (analyzer.js)

**Core Functions:**

#### analyzeRepo(repoUrl)
```javascript
Purpose: Generate complete repository analysis
Process:
1. Parse repository URL
2. Check cache (repoKey = owner/repo)
3. Fetch repository metadata
4. Fetch file tree (recursive)
5. Build hierarchical file structure
6. Extract folder paths
7. Fetch README and package.json
8. Generate overview with LLM
9. Generate folder summaries (up to 25)
10. Cache results
11. Return analysis object
```

#### explainFile(repoUrl, path)
```javascript
Purpose: Generate file-specific explanation
Process:
1. Parse repository URL
2. Check file cache
3. Fetch file content from GitHub
4. Truncate if > 12,000 characters
5. Generate explanation with LLM
6. Cache result
7. Return explanation
```

#### explainFolder(repoUrl, path)
```javascript
Purpose: Generate folder-specific explanation
Process:
1. Parse repository URL
2. Get file list (from cache or fetch)
3. Filter files in folder
4. Generate explanation with LLM
5. Return explanation
```

#### answerQuestion(repoUrl, question, context)
```javascript
Purpose: Answer natural language questions
Process:
1. Parse repository URL
2. Get file list and README (from cache or fetch)
3. Extract keywords from question
4. Find relevant files by keyword matching
5. Build context with overview, files, README
6. Generate answer with LLM
7. Return answer
```

**Data Structures:**

```javascript
// File tree node
{
  name: string,
  type: "file" | "folder",
  path: string,
  children?: FileNode[]
}

// Explanation
{
  title: string,
  content: string
}

// Analysis result
{
  repoName: string,
  tree: FileNode[],
  overview: Explanation,
  folders: Record<string, Explanation>
}
```

**Caching Strategy:**

```javascript
analysisCache: Map<repoKey, {
  result: AnalysisResponse,
  filePaths: string[],
  readme: string,
  repoMeta: object
}>

fileCache: Map<"repoKey:path", Explanation>

Cache Lifetime: Server session (in-memory)
Cache Invalidation: Server restart
```

### 3.4 GitHub Integration Layer (github.js)

**Functions:**

#### parseRepoUrl(repoUrl)
```javascript
Supported Formats:
- https://github.com/owner/repo
- github.com/owner/repo
- git@github.com:owner/repo.git

Returns: { owner, repo }
```

#### fetchRepoMeta(owner, repo)
```javascript
Endpoint: GET /repos/:owner/:repo
Returns: Repository metadata (name, description, language, etc.)
```

#### fetchRepoTree(owner, repo, branch)
```javascript
Endpoint: GET /repos/:owner/:repo/git/trees/:branch?recursive=1
Returns: Array of tree entries (files and folders)
Handles: Truncation warning
```

#### fetchFileContent(owner, repo, path)
```javascript
Endpoint: GET /repos/:owner/:repo/contents/:path
Returns: Base64-decoded file content
Handles: Missing files, directories
```

#### fetchReadme(owner, repo)
```javascript
Endpoint: GET /repos/:owner/:repo/readme
Returns: Base64-decoded README content
```

**Authentication:**
```javascript
Headers:
- Accept: application/vnd.github+json
- X-GitHub-Api-Version: 2022-11-28
- Authorization: Bearer ${GITHUB_TOKEN} (if provided)

Rate Limits:
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
```

### 3.5 LLM Integration Layer (llm.js)

**Configuration:**
```javascript
{
  apiKey: OPENROUTER_API_KEY (required),
  model: OPENROUTER_MODEL (default: openai/gpt-4o-mini),
  siteUrl: OPENROUTER_SITE_URL (optional),
  appName: OPENROUTER_APP_NAME (optional)
}
```

**Function: generateText(prompt)**
```javascript
Endpoint: POST https://openrouter.ai/api/v1/chat/completions
Request:
{
  model: string,
  messages: [{ role: "user", content: prompt }],
  temperature: 0.2
}

Response: Generated text content
Error Handling: Returns null on failure
```

**Prompt Templates:**

1. **Overview Prompt:**
```
Sections:
- What this project does
- Who this project is for
- Main technologies used
- High-level architecture

Inputs: repoMeta, readme, packageJson, folderPaths
```

2. **Folder Prompt:**
```
Sections:
- What this folder is responsible for
- Why it exists
- What kind of files live here

Inputs: folderPath, folderFiles (sample)
```

3. **File Prompt:**
```
Sections:
- What this file does
- Important logic
- How data flows

Inputs: filePath, fileContent (truncated to 12K chars)
```

4. **Question Prompt:**
```
Context:
- Repository overview
- Relevant file paths
- README excerpt

Inputs: question, overview, relevantFiles, readme
```

---

## 4. Data Flow Diagrams

### 4.1 Repository Analysis Flow

```
User submits URL
    ↓
Frontend validates URL
    ↓
POST /api/analyze { repoUrl }
    ↓
Backend: parseRepoUrl()
    ↓
Backend: Check analysisCache
    ├─ Hit → Return cached result
    └─ Miss ↓
Backend: fetchRepoMeta()
    ↓
Backend: fetchRepoTree()
    ↓
Backend: buildFileTree()
    ↓
Backend: listFolderPaths()
    ↓
Backend: fetchReadme() + fetchFileContent(package.json)
    ↓
Backend: generateText(overview prompt)
    ↓
Backend: For each folder (up to 25):
    └─ generateText(folder prompt)
    ↓
Backend: Cache result
    ↓
Backend: Return { repoName, tree, overview, folders }
    ↓
Frontend: Update state
    ↓
Frontend: Render FileTree + ExplanationPanel
```

### 4.2 File Selection Flow

```
User clicks file in tree
    ↓
Frontend: handleSelect(path)
    ↓
Frontend: Check explanations cache
    ├─ Hit → Display cached explanation
    └─ Miss ↓
Frontend: POST /api/file { repoUrl, path }
    ↓
Backend: Check fileCache
    ├─ Hit → Return cached explanation
    └─ Miss ↓
Backend: fetchFileContent(path)
    ↓
Backend: truncate(content, 12000)
    ↓
Backend: generateText(file prompt)
    ↓
Backend: Cache explanation
    ↓
Backend: Return { explanation }
    ↓
Frontend: Update explanations cache
    ↓
Frontend: Display explanation
```

### 4.3 Question Answering Flow

```
User types question
    ↓
User submits (Enter or button)
    ↓
Frontend: handleQuestion(question)
    ↓
Frontend: POST /api/question { repoUrl, question, context }
    ↓
Backend: Get filePaths and readme (cache or fetch)
    ↓
Backend: Extract keywords from question
    ↓
Backend: Filter relevant files by keyword matching
    ↓
Backend: Build prompt with context
    ↓
Backend: generateText(question prompt)
    ↓
Backend: Return { answer }
    ↓
Frontend: Display answer in ExplanationPanel
```

---

## 5. Security Design

### 5.1 API Security

**Input Validation:**
- Validate repository URL format
- Sanitize file paths
- Limit request body size (2MB)
- Validate required fields

**Authentication:**
- GitHub token stored server-side only
- OpenRouter API key stored server-side only
- No client-side secrets

**CORS Protection:**
- Whitelist allowed origins
- Pattern-based origin validation
- Credentials support for trusted origins

### 5.2 Data Security

**Sensitive Data:**
- API keys in environment variables
- No persistent storage of repository content
- No logging of sensitive information

**Rate Limiting:**
- Rely on GitHub API rate limits
- Rely on OpenRouter API rate limits
- Future: Implement application-level rate limiting

### 5.3 Error Handling

**Strategy:**
- Catch all errors at API boundary
- Return generic error messages to client
- Log detailed errors server-side
- Never expose stack traces to client

---

## 6. Performance Optimization

### 6.1 Caching Strategy

**Repository Analysis Cache:**
- Key: `${owner}/${repo}`
- Value: Complete analysis result + metadata
- Lifetime: Server session
- Benefit: Avoid redundant GitHub/LLM calls

**File Explanation Cache:**
- Key: `${owner}/${repo}:${path}`
- Value: File explanation
- Lifetime: Server session
- Benefit: Instant response for revisited files

**Frontend Cache:**
- Explanations stored in component state
- Persists during session
- Cleared on navigation away

### 6.2 Optimization Techniques

**Backend:**
- Truncate large files before LLM processing
- Limit folder summaries to 25
- Batch folder analysis during initial load
- Reuse cached file lists for questions

**Frontend:**
- Lazy load components
- Debounce question input (future)
- Virtual scrolling for large file trees (future)
- Code splitting by route

**Network:**
- Compress responses (future)
- Minimize payload size
- Parallel API calls where possible

### 6.3 Performance Targets

| Operation | Target | Current |
|-----------|--------|---------|
| Initial analysis | < 30s | ~20-25s |
| File explanation | < 5s | ~3-4s |
| Folder explanation | < 5s | ~3-4s |
| Question answer | < 10s | ~5-8s |
| UI interaction | < 100ms | ~50ms |

---

## 7. Error Handling Design

### 7.1 Error Categories

**Client Errors (4xx):**
- 400 Bad Request: Invalid input
- 404 Not Found: Repository not found

**Server Errors (5xx):**
- 500 Internal Server Error: GitHub API failure
- 500 Internal Server Error: LLM API failure
- 500 Internal Server Error: Unexpected errors

### 7.2 Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

### 7.3 Frontend Error Handling

**Display Strategy:**
- Show error in ExplanationPanel
- Maintain UI structure
- Provide actionable guidance
- Allow retry

**Error States:**
```typescript
{
  title: "Error Title",
  content: "Error message with guidance"
}
```

### 7.4 Backend Error Handling

**Try-Catch Blocks:**
- Wrap all async operations
- Log errors with context
- Return appropriate HTTP status
- Provide user-friendly messages

**Graceful Degradation:**
- LLM unavailable → Show message about configuration
- GitHub API failure → Show specific error
- Partial data → Display what's available

---

## 8. Testing Strategy

### 8.1 Unit Testing

**Frontend:**
- Component rendering tests
- Hook behavior tests
- Utility function tests
- Framework: Vitest + Testing Library

**Backend:**
- Function logic tests
- URL parsing tests
- Data transformation tests
- Framework: Vitest

### 8.2 Integration Testing

**API Endpoints:**
- Request/response validation
- Error handling
- Authentication
- CORS behavior

**External Services:**
- Mock GitHub API responses
- Mock LLM API responses
- Test error scenarios

### 8.3 End-to-End Testing

**User Flows:**
- Complete analysis workflow
- File selection workflow
- Question answering workflow
- Error recovery

### 8.4 Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Key API endpoints
- E2E tests: Critical user paths

---

## 9. Deployment Architecture

### 9.1 Deployment Configuration

**Platform:** Render (or similar)

**Services:**
- Web service (Express server)
- Static site (React frontend)

**Build Process:**
```bash
# Frontend
npm run build
# Output: dist/

# Backend
# No build needed (Node.js runtime)
```

### 9.2 Environment Configuration

**Development:**
```
VITE_API_URL=http://localhost:3001
PORT=3001
GITHUB_TOKEN=<optional>
OPENROUTER_API_KEY=<required>
```

**Production:**
```
VITE_API_URL=https://api.example.com
PORT=3001
CORS_ORIGIN=https://example.com
GITHUB_TOKEN=<optional>
OPENROUTER_API_KEY=<required>
```

### 9.3 Health Monitoring

**Endpoint:** `GET /health`
**Response:** `{ "ok": true }`
**Purpose:** Service availability check

---

## 10. Future Enhancements

### 10.1 Technical Improvements

**Performance:**
- Implement Redis for distributed caching
- Add request queuing for rate limiting
- Stream LLM responses for faster perceived performance
- Implement progressive analysis (show results as available)

**Features:**
- WebSocket support for real-time updates
- Support for GitLab/Bitbucket
- Code search within repository
- Dependency graph visualization
- Architecture diagram generation
- Export to Markdown/PDF

**User Experience:**
- Dark/light theme toggle
- Keyboard shortcuts
- Mobile-responsive design
- Accessibility improvements (ARIA labels, keyboard navigation)
- Syntax highlighting in code snippets

### 10.2 Scalability Improvements

**Backend:**
- Horizontal scaling with load balancer
- Database for persistent storage
- Background job processing
- CDN for static assets

**Frontend:**
- Service worker for offline support
- Progressive Web App (PWA)
- Optimistic UI updates
- Virtual scrolling for large trees

---

## 11. Design Decisions and Rationale

### 11.1 Technology Choices

**React + TypeScript:**
- Strong typing reduces bugs
- Large ecosystem and community
- Excellent developer experience
- Component reusability

**Express.js:**
- Lightweight and flexible
- Mature ecosystem
- Easy to understand and maintain
- Good performance for API server

**shadcn/ui + Tailwind:**
- Modern, accessible components
- Customizable and themeable
- Utility-first styling
- Consistent design system

**OpenRouter:**
- Access to multiple LLM providers
- Flexible model selection
- Cost-effective
- Simple API

### 11.2 Architectural Decisions

**In-Memory Caching:**
- Pros: Simple, fast, no external dependencies
- Cons: Lost on restart, not distributed
- Rationale: Sufficient for MVP, easy to replace later

**REST API:**
- Pros: Simple, well-understood, cacheable
- Cons: Multiple round trips, no real-time updates
- Rationale: Adequate for current use case

**Client-Side Routing:**
- Pros: Fast navigation, better UX
- Cons: SEO challenges (mitigated with SSR in future)
- Rationale: SPA provides smooth experience

**No Authentication:**
- Pros: Simpler implementation, lower barrier to entry
- Cons: No user-specific features, rate limiting challenges
- Rationale: MVP focuses on core functionality

---

## 12. Glossary

**SPA:** Single Page Application  
**REST:** Representational State Transfer  
**CORS:** Cross-Origin Resource Sharing  
**LLM:** Large Language Model  
**API:** Application Programming Interface  
**UI:** User Interface  
**UX:** User Experience  
**MVP:** Minimum Viable Product  
**SSR:** Server-Side Rendering  
**CDN:** Content Delivery Network  
**PWA:** Progressive Web App

---

## Document Control

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Status:** Active  
**Owner:** Development Team  
**Related Documents:** REQUIREMENTS.md, README.md
