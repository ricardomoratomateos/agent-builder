# Agent Builder

**Visual workflow builder for AI agents** with testing, cost optimization, and step-by-step debugging.

> Build, test, and optimize AI agents without breaking the bank.

---

## Features

### 🧪 Testing System (Catalyst-inspired)
Record real conversations as tests, validate with LLM-as-Judge, and catch regressions early.

### 💰 Cost Optimizer (Distill-inspired)
Automatically detect optimization opportunities. Get suggestions to reduce costs by 20-50%.

### 🐛 Step-by-Step Debug (N8N-style)
Execute workflows node-by-node with caching. Only pay for what you change.

---

## Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR **Node.js 20+** and **npm 10+** (for local development)
- **Git**

### 1. Clone the Repository

```bash
cd /Users/ricardo/Projects
git clone [repository-url] agent-builder
cd agent-builder
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

**Required environment variables:**
```env
# Database (default values work with Docker)
MONGODB_URI=mongodb://mongodb:27017/agent-builder
REDIS_URL=redis://:changeme@redis:6379
REDIS_PASSWORD=changeme
QDRANT_URL=http://qdrant:6333

# LLM API Keys (required for testing and optimizer modules)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here

# Frontend
VITE_API_URL=http://localhost:3000
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
npm run docker:dev

# This will start:
# - Backend API (http://localhost:3000)
# - Frontend (http://localhost:3001)
# - MongoDB (localhost:27017)
# - Redis (localhost:6379)
# - Qdrant (http://localhost:6333)
```

**First time setup takes 2-3 minutes** while Docker downloads images and installs dependencies.

### 4. Verify Everything Works

Open a new terminal and run:

```bash
# Check backend health
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z","uptime":123.45}

# Open frontend in browser
open http://localhost:3001
```

You should see the Agent Builder dashboard!

---

## Alternative: Run Locally (Without Docker)

If you prefer to run services locally instead of Docker:

### 1. Start External Services

You'll need to run MongoDB, Redis, and Qdrant separately:

```bash
# MongoDB (using Homebrew on macOS)
brew install mongodb-community
brew services start mongodb-community

# Redis
brew install redis
brew services start redis

# Qdrant (Docker)
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest
```

### 2. Update Environment

Edit `.env` to use localhost instead of Docker service names:

```env
MONGODB_URI=mongodb://localhost:27017/agent-builder
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ../..
```

### 4. Start Development Servers

Open **three terminals**:

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

**Terminal 3 - Check services:**
```bash
# Backend
curl http://localhost:3000/health

# Frontend (open browser)
open http://localhost:3001
```

---

## Using Turborepo

Turborepo orchestrates tasks across both apps with intelligent caching:

```bash
# Build both apps (parallelized)
npm run build

# Run linting (cached)
npm run lint

# Type checking (cached)
npm run type-check

# Format code
npm run format
```

**Caching in action:**
```bash
# First run - everything executes
npm run build
# >>> backend:build: cache miss, executing (20s)
# >>> frontend:build: cache miss, executing (12s)

# Second run - instant cache hits
npm run build
# >>> backend:build: cache hit, replaying output (<1s)
# >>> frontend:build: cache hit, replaying output (<1s)
```

---

## Common Tasks

### View Logs

```bash
# All services
npm run docker:logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services

```bash
# Restart all
npm run docker:down
npm run docker:dev

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Access Database

```bash
# MongoDB shell
docker-compose exec mongodb mongosh agent-builder

# List collections
db.getCollectionNames()

# Query agents
db.agents.find().pretty()

# Redis CLI
docker-compose exec redis redis-cli -a changeme

# Test Redis
ping  # Should return PONG
```

### Stop Services

```bash
# Stop all services
npm run docker:down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

---

## Project Structure

```
agent-builder/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── main.ts       # Entry point
│   │   │   ├── app.module.ts # Root module
│   │   │   └── modules/
│   │   │       ├── agents/   # Agent CRUD
│   │   │       ├── workflows/ # Workflow CRUD
│   │   │       ├── testing/  # Test system
│   │   │       ├── optimizer/ # Cost optimizer
│   │   │       └── execution/ # Step-by-step debug
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/             # React SPA
│       ├── src/
│       │   ├── main.tsx      # Entry point
│       │   ├── App.tsx       # Root component
│       │   ├── components/   # React components
│       │   ├── pages/        # Page components
│       │   └── lib/          # API client
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml        # Development environment
├── docker-compose.prod.yml   # Production environment
├── turbo.json                # Turborepo config
├── package.json              # Root workspace
├── README.md                 # This file
└── ROADMAP.md                # Development roadmap
```

---

## API Endpoints

### Health Check
```bash
GET /health
```

### Agents
```bash
GET    /agents       # List all agents
POST   /agents       # Create agent
GET    /agents/:id   # Get agent
PUT    /agents/:id   # Update agent
DELETE /agents/:id   # Delete agent
```

### Workflows
```bash
GET    /workflows       # List all workflows
POST   /workflows       # Create workflow
GET    /workflows/:id   # Get workflow
PUT    /workflows/:id   # Update workflow
DELETE /workflows/:id   # Delete workflow
```

### Testing (Not yet implemented - see ROADMAP.md)
```bash
POST /testing/suites           # Create test suite
GET  /testing/suites           # List test suites
POST /testing/suites/:id/run   # Run test suite
GET  /testing/results          # Get test results
```

### Optimizer (Not yet implemented - see ROADMAP.md)
```bash
POST /optimizer/analyze                    # Analyze agent for optimizations
GET  /optimizer/suggestions/:agentId       # Get suggestions
POST /optimizer/suggestions/:id/implement  # Implement suggestion
POST /optimizer/suggestions/:id/ignore     # Ignore suggestion
```

### Execution (Not yet implemented - see ROADMAP.md)
```bash
POST /execution/run                  # Execute workflow (production)
POST /execution/debug/start          # Start debug session
POST /execution/debug/:id/step       # Execute next step
GET  /execution/debug/:id/state      # Get debug state
```

---

## Development Workflow

### Making Changes

**Backend changes** (hot reload enabled):
```bash
# Edit any file in apps/backend/src/
# Changes reflect automatically in Docker
# Check logs: npm run docker:logs
```

**Frontend changes** (hot reload enabled):
```bash
# Edit any file in apps/frontend/src/
# Browser auto-refreshes
# Check terminal for Vite output
```

### Adding Dependencies

**Backend:**
```bash
cd apps/backend
npm install <package>
docker-compose restart backend  # Restart to install
```

**Frontend:**
```bash
cd apps/frontend
npm install <package>
docker-compose restart frontend  # Restart to install
```

### Running Tests

```bash
# Backend tests (not implemented yet)
cd apps/backend
npm run test

# Frontend tests (not implemented yet)
cd apps/frontend
npm run test
```

### Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format

# Type check
npm run type-check
```

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000   # Backend
lsof -i :3001   # Frontend
lsof -i :27017  # MongoDB

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Docker Issues

```bash
# Remove all containers and volumes (fresh start)
docker-compose down -v

# Rebuild images
npm run docker:dev --build

# Check Docker disk space
docker system df

# Clean up old images
docker system prune -a
```

### Hot Reload Not Working

```bash
# For backend - check volume mounts
docker-compose config

# For frontend - verify Vite polling is enabled
# Check apps/frontend/vite.config.ts
# Should have: watch: { usePolling: true }
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check logs
docker-compose logs mongodb

# Connect manually
docker-compose exec mongodb mongosh agent-builder
```

### Redis Connection Issues

```bash
# Test Redis
docker-compose exec redis redis-cli -a changeme ping
# Should return: PONG

# Check password in .env matches docker-compose.yml
```

### Cannot Connect to Qdrant

```bash
# Check Qdrant is running
docker-compose ps qdrant

# Test connection
curl http://localhost:6333/healthz
# Should return success

# Check collections
curl http://localhost:6333/collections
```

### Dependencies Not Installing

```bash
# Clear node_modules and reinstall
cd apps/backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Production Deployment

### Build Production Images

```bash
# Build and start production services
npm run docker:prod
```

### Environment Configuration

**Update `.env` for production:**

```env
NODE_ENV=production

# Use production database URLs
MONGODB_URI=mongodb://your-production-db:27017/agent-builder
REDIS_URL=redis://:secure-password@your-production-redis:6379
QDRANT_URL=http://your-production-qdrant:6333

# Set secure passwords
REDIS_PASSWORD=super-secure-password
JWT_SECRET=super-secure-jwt-secret-change-this

# Frontend API URL
VITE_API_URL_PRODUCTION=https://api.yourdomain.com

# CORS for production domain
CORS_ORIGIN=https://yourdomain.com
```

### Production Checklist

- [ ] Environment variables are set securely
- [ ] MongoDB is not exposed externally
- [ ] Redis password is strong and secure
- [ ] JWT secret is randomly generated
- [ ] CORS is configured for your domain only
- [ ] SSL/TLS is configured (use reverse proxy like Nginx)
- [ ] Database backups are automated
- [ ] Monitoring is set up (logs, metrics, alerts)
- [ ] Rate limiting is enabled
- [ ] API documentation is up to date

### Production Services

```bash
# Start production
npm run docker:prod

# Services running:
# - Backend: http://localhost:3000
# - Frontend: http://localhost:8080 (Nginx)
# - MongoDB: Internal only (not exposed)
# - Redis: Internal only (not exposed)
# - Qdrant: http://localhost:6333

# Stop production
npm run docker:prod:down
```

---

## Tech Stack

### Backend
- **NestJS** - Backend framework
- **Fastify** - HTTP server (faster than Express)
- **MongoDB** - Primary database
- **Mongoose** - MongoDB ODM
- **Redis** - Caching layer
- **Qdrant** - Vector database for RAG
- **LangChain** - LLM orchestration
- **LangGraph** - Agent workflow graphs

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (fast!)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Flow** - Visual workflow editor
- **Axios** - HTTP client
- **Zustand** - State management

### Infrastructure
- **Turborepo** - Monorepo build system
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## What's Next?

See [ROADMAP.md](./ROADMAP.md) for the complete development plan.

**Current Phase**: Phase 1 - Core Agent Execution

**Next milestones:**
1. ✅ **Phase 0**: Scaffolding (COMPLETE)
2. 🔄 **Phase 1**: Authentication + Basic execution (CURRENT)
3. 🔜 **Phase 2**: Visual builder + Step-by-step debug
4. 📋 **Phase 3**: Testing system
5. 📋 **Phase 4**: Cost optimizer
6. 📋 **Phase 5**: RAG & Tools

---

## Contributing

1. Check [ROADMAP.md](./ROADMAP.md) for current phase
2. Pick a task from the current phase
3. Create a feature branch
4. Make your changes
5. Run `npm run lint` and `npm run type-check`
6. Submit a pull request

---

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [React Flow Documentation](https://reactflow.dev)
- [LangChain JS Documentation](https://js.langchain.com)
- [LangGraph JS Documentation](https://langchain-ai.github.io/langgraphjs/)

---

## License

MIT

---

## Support

**Issues?** Create an issue in the repository with:
- Steps to reproduce
- Expected vs actual behavior
- Logs from `npm run docker:logs`
- Environment (OS, Docker version, Node version)

**Questions?** Check [ROADMAP.md](./ROADMAP.md) for implementation details.

---

**Built with ❤️ using Claude Code**
