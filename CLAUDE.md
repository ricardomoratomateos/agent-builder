# Claude Code Context - Agent Builder

> Essential context for AI assistants working on this project.

---

## Project Overview

Visual workflow builder for AI agents with:
1. **Testing System** (Catalyst-inspired) - LLM-as-Judge validation
2. **Cost Optimizer** (Distill-inspired) - Automatic cost reduction
3. **Step-by-Step Execution** (N8N-style) - Debug with caching

**Current**: Phase 0 Complete → Phase 1 In Progress

---

## Tech Stack

- **Monorepo**: Turborepo
- **Backend**: NestJS, Fastify, MongoDB, Redis, Qdrant
- **Frontend**: React 18, Vite, Tailwind CSS
- **LLM**: LangChain, LangGraph (to be added in Phase 1)

---

## Structure

```
apps/
├── backend/src/modules/
│   ├── agents/         # CRUD (✓)
│   ├── workflows/      # CRUD (✓)
│   ├── testing/        # TODO Phase 3
│   ├── optimizer/      # TODO Phase 4
│   └── execution/      # TODO Phase 1
└── frontend/src/
    ├── pages/          # Dashboard, FlowEditor
    ├── components/     # Layout done, flow TODO
    └── lib/api.ts      # API client (✓)
```

---

## Code Conventions

### Backend
- Module pattern: `module.module.ts`, `module.controller.ts`, `module.service.ts`
- DTOs with `class-validator`: `@IsString()`, `@IsNotEmpty()`
- Errors: `throw new NotFoundException()`
- Schemas: `@Schema({ timestamps: true })`

### Frontend
- Functional components: `export const MyComponent: FC<Props>`
- Tailwind CSS only (no custom CSS)
- File naming: `PascalCase.tsx` for components, `camelCase.ts` for utils

---

## Current Phase: Phase 1

**Goals:**
- [ ] Authentication (JWT)
- [ ] Conversation storage
- [ ] Workflow execution with LangGraph
- [ ] Token usage tracking

**Files to create:**
- `apps/backend/src/modules/auth/` (new)
- `apps/backend/src/modules/users/` (new)
- `apps/backend/src/modules/conversations/` (new)

**Files to modify:**
- `apps/backend/src/modules/execution/engine/workflow-executor.ts`
- `apps/backend/src/modules/execution/engine/node-executor.ts`

**Dependencies to add:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @langchain/langgraph @langchain/anthropic @langchain/openai
```

---

## Essential Commands

```bash
# Start dev
npm run docker:dev

# View logs
npm run docker:logs

# Access DB
docker-compose exec mongodb mongosh agent-builder
docker-compose exec redis redis-cli -a changeme

# Fresh start
docker-compose down -v && npm run docker:dev
```

---

## Key Files

- `apps/backend/src/main.ts` - Backend entry
- `apps/backend/src/app.module.ts` - Root module
- `apps/frontend/src/App.tsx` - Frontend routing
- `turbo.json` - Monorepo config
- `ROADMAP.md` - Development plan

---

## Environment Variables

Required:
```env
MONGODB_URI=mongodb://mongodb:27017/agent-builder
REDIS_URL=redis://:changeme@redis:6379
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
JWT_SECRET=your-secret-key
```

---

## Common Issues

- **Port in use**: `lsof -i :3000 && kill -9 <PID>`
- **Hot reload broken**: Check `vite.config.ts` has `watch: { usePolling: true }`
- **MongoDB error**: `docker-compose ps mongodb` and check `MONGODB_URI`

---

## How to Prompt Claude

**Good**: "Implement auth module following agents module pattern. Add JWT strategy and protect /agents endpoints."

**Bad**: "Add authentication"

**Include**: Current phase, related files, existing patterns, constraints.

---

## Git Commits

```
<type>: <subject>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

**Status**: Phase 0 Complete | **Next**: Authentication + LangGraph Execution
