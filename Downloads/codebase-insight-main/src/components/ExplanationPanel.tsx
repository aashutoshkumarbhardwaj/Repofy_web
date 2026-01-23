export interface Explanation {
  title: string;
  content: string;
}

interface ExplanationPanelProps {
  selectedPath: string | null;
  repoName: string;
  explanation?: Explanation | null;
}

const explanations: Record<string, { title: string; content: string }> = {
  "": {
    title: "Repository Overview",
    content: `This is a modern React application built with TypeScript and Vite. The codebase follows a clean, modular architecture with clear separation of concerns.

**Tech Stack**
- React 18 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Custom hooks for state management

**Architecture**
The application uses a component-based architecture with reusable UI components, custom hooks for business logic, and utility functions in the lib folder.

**Entry Point**
The app starts at \`main.tsx\`, which renders the root \`App.tsx\` component.`,
  },
  "src": {
    title: "Source Directory",
    content: `The \`src\` folder contains all application source code.

**Structure**
- \`components/\` — Reusable UI components
- \`hooks/\` — Custom React hooks
- \`lib/\` — Utility functions and API clients
- \`App.tsx\` — Root component with routing
- \`main.tsx\` — Application entry point

This organization keeps the codebase maintainable as it scales.`,
  },
  "src/components": {
    title: "Components",
    content: `UI components used throughout the application.

**Button.tsx**
A customizable button component with variants for primary, secondary, and ghost styles. Uses CVA for variant management.

**Card.tsx**
A container component for grouping related content. Supports header, body, and footer sections.

**Header.tsx**
The main navigation header. Contains the logo, navigation links, and user menu.`,
  },
  "src/components/Button.tsx": {
    title: "Button Component",
    content: `A flexible button component built with class-variance-authority.

\`\`\`tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
\`\`\`

**Usage**
Used for all interactive button elements. The primary variant is the main CTA, secondary for less prominent actions.

**Accessibility**
Includes proper focus states, disabled styling, and ARIA attributes.`,
  },
  "src/hooks": {
    title: "Custom Hooks",
    content: `Reusable React hooks that encapsulate business logic.

**useAuth.ts**
Handles authentication state, login/logout functions, and session management. Returns the current user and auth methods.

**useApi.ts**
A wrapper around fetch with automatic error handling, loading states, and response typing.`,
  },
  "src/hooks/useAuth.ts": {
    title: "useAuth Hook",
    content: `Manages authentication state throughout the application.

\`\`\`tsx
const { user, login, logout, isLoading } = useAuth();
\`\`\`

**Returns**
- \`user\` — Current authenticated user or null
- \`login(credentials)\` — Authenticate a user
- \`logout()\` — Clear session and redirect
- \`isLoading\` — Auth state loading indicator

**Implementation**
Uses React Context internally to provide auth state to all components without prop drilling.`,
  },
  "src/lib": {
    title: "Library Utilities",
    content: `Shared utility functions and API configuration.

**utils.ts**
Common helper functions like \`cn()\` for className merging, date formatters, and validation helpers.

**api.ts**
API client configuration with base URL, headers, and interceptors for authentication tokens.`,
  },
  "src/App.tsx": {
    title: "App Component",
    content: `The root component that sets up routing and providers.

**Structure**
\`\`\`tsx
<QueryClientProvider>
  <AuthProvider>
    <Router>
      <Routes />
    </Router>
  </AuthProvider>
</QueryClientProvider>
\`\`\`

**Responsibilities**
- Sets up React Query for data fetching
- Provides authentication context
- Defines application routes
- Wraps app in necessary providers`,
  },
  "package.json": {
    title: "Package Configuration",
    content: `Defines project dependencies and scripts.

**Key Dependencies**
- \`react\` & \`react-dom\` — UI library
- \`typescript\` — Type safety
- \`vite\` — Build tool
- \`tailwindcss\` — Styling

**Scripts**
- \`dev\` — Start development server
- \`build\` — Production build
- \`test\` — Run test suite`,
  },
  "README.md": {
    title: "README",
    content: `Project documentation and getting started guide.

**Quick Start**
\`\`\`bash
npm install
npm run dev
\`\`\`

The README typically includes setup instructions, environment variables, and contribution guidelines.`,
  },
};

const fallbackExplanation: Explanation = {
  title: "Repository Overview",
  content: "Run an analysis to see the repository overview.",
};

export function ExplanationPanel({ selectedPath, repoName, explanation }: ExplanationPanelProps) {
  const path = selectedPath || "";
  const selectedExplanation = explanation || explanations[path] || explanations[""] || fallbackExplanation;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl p-8">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{repoName}</span>
            {selectedPath && (
              <>
                <span>/</span>
                <span className="text-foreground">{selectedPath}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-medium text-foreground">
            {selectedExplanation.title}
          </h1>

          {/* Content */}
          <div className="prose prose-neutral prose-sm max-w-none">
            {selectedExplanation.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```\w*\n?/g, '');
                return (
                  <pre key={i} className="bg-secondary/50 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{code}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={i} className="text-sm font-medium text-foreground mt-6 mb-2">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('**')) {
                const [title, ...rest] = paragraph.split('\n');
                return (
                  <div key={i}>
                    <h3 className="text-sm font-medium text-foreground mt-6 mb-2">
                      {title.replace(/\*\*/g, '')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rest.join('\n')}
                    </p>
                  </div>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={i} className="space-y-1 text-sm text-muted-foreground">
                    {paragraph.split('\n').map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-muted-foreground/50 mt-1.5">•</span>
                        <span>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
