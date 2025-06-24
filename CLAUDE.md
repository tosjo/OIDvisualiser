# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OID Visualizer is a React-based web application for visualizing Object Identifier (OID) hierarchical structures. The project follows professional development practices with comprehensive testing, security measures, and Docker deployment.

## Development Commands

Since the project is not yet initialized, here are the planned commands based on the project plan:

### Initial Setup
```bash
# Initialize the project (when starting implementation)
git init
npm create vite@latest . -- --template react-ts
npm install

# Install core dependencies (as per project plan)
npm install react-d3-tree tailwindcss zustand axios zod
npm install -D vitest @testing-library/react @testing-library/jest-dom playwright @vitest/coverage-c8
npm install -D eslint prettier husky lint-staged @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D @storybook/react-vite typedoc
```

### Development
```bash
npm run dev          # Start development server with Vite
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report (target: 95%)
npm run test:e2e     # Run Playwright E2E tests
npm run storybook    # Start Storybook for component development
```

### Code Quality
```bash
npm run lint         # Run ESLint with security plugins
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
npm audit            # Check for security vulnerabilities
```

### Docker
```bash
docker build -t oid-visualizer .                    # Build Docker image
docker-compose up -d                                # Run locally with docker-compose
docker-compose -f docker-compose.prod.yml up -d     # Run production config
```

## Architecture

### Directory Structure
```
src/
├── components/         # React components with tests and stories
│   ├── OIDTree/       # Main visualization component
│   ├── SearchBar/     # Search functionality
│   ├── NodeDetails/   # Node detail panel
│   └── common/        # Shared components
├── hooks/             # Custom React hooks
├── services/          # API and data services
├── stores/            # Zustand state management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── constants/         # Application constants
```

### Key Technologies
- **Frontend Framework**: React 18 with TypeScript 5 (strict mode)
- **Build Tool**: Vite 5 for fast development
- **State Management**: Zustand for lightweight state handling
- **Visualization**: react-d3-tree for OID tree rendering
- **Styling**: Tailwind CSS 3
- **Validation**: Zod for runtime type validation
- **HTTP Client**: Axios with interceptors

### Testing Strategy
- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright for cross-browser testing
- **Coverage Target**: 95% minimum
- **Component Testing**: Storybook for visual testing

### Security Considerations
- Content Security Policy (CSP) headers configured
- Input validation using Zod schemas
- No hardcoded secrets (use environment variables)
- Docker container runs as non-root user
- Regular dependency audits via npm audit

## Git Workflow

The project follows GitFlow:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes

### Git Best Practices
- **Commit frequently**: Make atomic commits for each logical change
- **Push regularly**: Push commits to remote after completing each feature or fix
- **Never commit directly to main**: Always work in feature branches
- **Test before committing**: Ensure all tests pass before committing changes

Commit messages follow Conventional Commits:
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, perf, test, chore

## CI/CD Pipeline

GitHub Actions workflows handle:
- Running tests and linting on all PRs
- Security vulnerability scanning
- Docker image building and publishing
- Automated releases with semantic versioning

## Important Notes

1. The project is currently in planning phase - no code has been implemented yet
2. All components should include `.test.tsx` and `.stories.tsx` files
3. Maintain 95% test coverage minimum
4. Use TypeScript strict mode for all files
5. Follow the established directory structure when implementing features
6. Security is a priority - always validate inputs and follow OWASP guidelines
7. Version numbering follows semantic versioning (MAJOR.MINOR.PATCH)
8. Always commit and push changes regularly to maintain version control history