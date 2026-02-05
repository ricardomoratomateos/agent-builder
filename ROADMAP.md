# Agent Builder - Roadmap

## Vision

Build a visual workflow builder for AI agents that makes testing easy, keeps costs under control, and enables fast iteration through step-by-step debugging.

## Core Value Propositions

1. **Test with Confidence** - Golden conversations + LLM-as-Judge validation
2. **Optimize Automatically** - AI-powered cost reduction suggestions
3. **Debug Efficiently** - Step-by-step execution with caching to save money

## Development Phases

---

## Phase 0: Foundation ✅ COMPLETE

**Timeline**: Completed
**Goal**: Complete project scaffolding with Turborepo monorepo

### Completed Items
- ✅ Turborepo monorepo setup
- ✅ NestJS backend with Fastify
- ✅ React frontend with Vite + Tailwind
- ✅ Docker development environment
- ✅ Docker production environment
- ✅ MongoDB, Redis, Qdrant integration
- ✅ Module scaffolding (Agents, Workflows, Nodes, Testing, Optimizer, Execution)
- ✅ API client setup
- ✅ TypeScript types
- ✅ Code quality tools (ESLint, Prettier, Husky)

---

## Phase 1: Core Agent Execution 🔄 CURRENT

**Timeline**: Week 1-2
**Goal**: Enable basic agent execution with conversation storage

### Backend Tasks

#### 1.1 Authentication System
- [ ] JWT token generation and validation
- [ ] User registration endpoint
- [ ] Login endpoint
- [ ] Auth guard for protected routes
- [ ] User schema and service
- [ ] Password hashing with bcrypt

**Files to create/modify:**
- `src/modules/auth/auth.module.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/jwt.strategy.ts`
- `src/modules/users/users.module.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/schemas/user.schema.ts`

**Dependencies to add:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### 1.2 Conversation Storage
- [ ] Conversation schema (messages, metadata, cost tracking)
- [ ] Conversation service (CRUD operations)
- [ ] Conversation controller (API endpoints)
- [ ] Link conversations to agents

**Files to create:**
- `src/modules/conversations/conversations.module.ts`
- `src/modules/conversations/conversations.service.ts`
- `src/modules/conversations/conversations.controller.ts`
- `src/modules/conversations/schemas/conversation.schema.ts`
- `src/modules/conversations/dto/create-conversation.dto.ts`

#### 1.3 Basic Workflow Execution with LangGraph
- [ ] Install LangGraph.js dependencies
- [ ] Implement workflow-executor.ts (from TODO)
- [ ] Implement node-executor.ts for basic LLM node
- [ ] Create simple graph from workflow definition
- [ ] Execute graph and return results
- [ ] Track token usage and costs

**Files to modify:**
- `src/modules/execution/engine/workflow-executor.ts`
- `src/modules/execution/engine/node-executor.ts`
- `src/modules/execution/execution.service.ts`

**Dependencies to add:**
```bash
npm install @langchain/langgraph @langchain/core @langchain/anthropic @langchain/openai
```

**Acceptance Criteria:**
- User can register and login
- User can create an agent
- User can send a message to an agent
- Agent responds using LangGraph workflow
- Conversation is saved to MongoDB
- Token usage and cost are tracked

---

## Phase 2: Visual Builder 🔜 NEXT

**Timeline**: Week 2-3
**Goal**: Visual workflow editor with React Flow

### Frontend Tasks

#### 2.1 React Flow Integration
- [ ] Install React Flow dependencies
- [ ] Create FlowCanvas component
- [ ] Create custom node components (LLM, RAG, Condition, Tool, End)
- [ ] Node configuration sidebar
- [ ] Save/load workflow from backend
- [ ] Zoom, pan, minimap controls

**Files to create:**
- `src/components/flow/FlowCanvas.tsx`
- `src/components/flow/nodes/LLMNode.tsx`
- `src/components/flow/nodes/RAGNode.tsx`
- `src/components/flow/nodes/ConditionNode.tsx`
- `src/components/flow/nodes/ToolNode.tsx`
- `src/components/flow/nodes/EndNode.tsx`
- `src/components/flow/NodeConfigPanel.tsx`
- `src/hooks/useFlow.ts`

**Dependencies to add:**
```bash
cd apps/frontend
npm install @xyflow/react
```

#### 2.2 Node Configuration
- [ ] Node property editor (prompts, models, settings)
- [ ] Model selector (Sonnet, Haiku, GPT-4, etc.)
- [ ] Temperature, max tokens controls
- [ ] System prompt editor
- [ ] User prompt template editor

**Files to create:**
- `src/components/flow/config/LLMConfig.tsx`
- `src/components/flow/config/RAGConfig.tsx`
- `src/components/flow/config/ConditionConfig.tsx`

#### 2.3 Draft/Production Versioning
- [ ] Draft mode indicator
- [ ] Publish workflow button
- [ ] Version history list
- [ ] Rollback to previous version
- [ ] Compare versions (diff view)

**Files to create:**
- `src/components/workflow/VersionHistory.tsx`
- `src/components/workflow/VersionDiff.tsx`

#### 2.4 Step-by-Step Execution UI ⭐
- [ ] Debug mode toggle
- [ ] Step button (execute next node)
- [ ] Continue button (run to end)
- [ ] Node execution state visualization (pending, running, complete)
- [ ] Input/output panel per node
- [ ] Cost and duration display per node
- [ ] Cache hit indicator

**Files to create:**
- `src/components/execution/DebugPanel.tsx`
- `src/components/execution/NodeExecutionState.tsx`
- `src/components/execution/ExecutionSummary.tsx`
- `src/hooks/useDebugExecution.ts`

**Acceptance Criteria:**
- User can drag and drop nodes in editor
- User can connect nodes with edges
- User can configure each node type
- User can save workflow as draft
- User can publish workflow to production
- User can start debug mode and step through nodes
- Each node shows input, output, cost, and duration
- Cached nodes show cache hit indicator

---

## Phase 3: Testing System ⭐ MVP FEATURE

**Timeline**: Week 3-4
**Goal**: Implement Catalyst-inspired testing system

### Backend Tasks

#### 3.1 Test Suite CRUD
- [ ] Implement test suite creation (manual + from conversation)
- [ ] Implement test suite listing
- [ ] Implement test suite execution
- [ ] Store test results with pass/fail status

**Files to modify:**
- `src/modules/testing/testing.service.ts` (remove TODOs)
- `src/modules/testing/testing.controller.ts`

#### 3.2 LLM-as-Judge Validator
- [ ] Implement LLM judge validation logic
- [ ] Create prompt templates for evaluation
- [ ] Parse LLM response (pass/fail + reasoning)
- [ ] Support custom evaluation criteria
- [ ] Calculate semantic similarity score

**Files to modify:**
- `src/modules/testing/validators/llm-judge.validator.ts`

#### 3.3 Custom Validators
- [ ] Implement contains validator
- [ ] Implement not-contains validator
- [ ] Implement JSON parseable validator
- [ ] Implement regex match validator
- [ ] Support TypeScript function execution (sandboxed)

**Files to modify:**
- `src/modules/testing/validators/custom.validator.ts`

#### 3.4 Cost Tracking
- [ ] Track token usage per test
- [ ] Calculate cost per test
- [ ] Calculate total suite cost
- [ ] Show cost trends over time

### Frontend Tasks

#### 3.5 Test Suite Management UI
- [ ] Create test suite page
- [ ] List all test suites
- [ ] Create new test suite (manual)
- [ ] "Save as Test" button in conversation UI
- [ ] Edit test suite (add/remove tests)
- [ ] Delete test suite

**Files to create:**
- `src/pages/Testing.tsx`
- `src/components/testing/TestSuiteList.tsx`
- `src/components/testing/CreateTestSuite.tsx`
- `src/components/testing/TestEditor.tsx`

#### 3.6 Test Execution Dashboard
- [ ] Run all tests button
- [ ] Test results table (test name, status, cost, duration)
- [ ] Pass/fail indicators
- [ ] Assertion results per test
- [ ] Total cost display
- [ ] Comparison with previous runs

**Files to create:**
- `src/components/testing/TestResults.tsx`
- `src/components/testing/TestRunHistory.tsx`
- `src/components/testing/AssertionDetails.tsx`

**Acceptance Criteria:**
- User can record a conversation and save as test
- User can create test manually with assertions
- User can run test suite and see pass/fail results
- LLM-as-Judge validates semantic correctness
- Custom validators work (contains, regex, etc.)
- Cost per test is displayed
- User can see test history and trends

---

## Phase 4: Cost Optimizer ⭐ MVP FEATURE

**Timeline**: Week 4-5
**Goal**: Implement Distill-inspired cost optimizer

### Backend Tasks

#### 4.1 Conversation Analyzer
- [ ] Detect repeated queries (using embeddings)
- [ ] Classify conversation complexity (simple/medium/complex)
- [ ] Identify cacheable responses
- [ ] Calculate conversation frequency patterns

**Files to modify:**
- `src/modules/optimizer/analyzers/conversation-analyzer.ts`

#### 4.2 Cost Analyzer
- [ ] Calculate cost per conversation
- [ ] Calculate average cost metrics
- [ ] Project monthly/annual costs
- [ ] Identify expensive operations

**Files to modify:**
- `src/modules/optimizer/analyzers/cost-analyzer.ts`

#### 4.3 Model Downgrade Suggester
- [ ] Detect simple conversations using expensive models
- [ ] Test cheaper model on sample conversations
- [ ] Calculate savings (Sonnet → Haiku)
- [ ] Generate suggestion with confidence score

**Files to modify:**
- `src/modules/optimizer/suggestions/model-downgrade.suggester.ts`

#### 4.4 Cache Suggester
- [ ] Detect repeated queries
- [ ] Determine if response is cacheable
- [ ] Calculate cache hit savings
- [ ] Generate cache configuration

**Files to modify:**
- `src/modules/optimizer/suggestions/cache-suggester.ts`

#### 4.5 Other Suggesters
- [ ] Prompt optimization suggester (reduce verbosity)
- [ ] RAG tuning suggester (optimize top_k, chunk size)

**Files to modify:**
- `src/modules/optimizer/suggestions/prompt-optimization.suggester.ts`
- `src/modules/optimizer/suggestions/rag-tuning.suggester.ts`

### Frontend Tasks

#### 4.6 Optimization Dashboard
- [ ] Show current monthly cost
- [ ] Display detected patterns
- [ ] List optimization suggestions
- [ ] Show potential savings per suggestion
- [ ] "Test" button (compare model outputs side-by-side)
- [ ] "Implement" button (apply suggestion)
- [ ] "Ignore" button (dismiss suggestion)

**Files to create:**
- `src/pages/Optimizer.tsx`
- `src/components/optimizer/CostOverview.tsx`
- `src/components/optimizer/PatternList.tsx`
- `src/components/optimizer/SuggestionCard.tsx`
- `src/components/optimizer/ModelComparison.tsx`

#### 4.7 Savings Tracker
- [ ] Show implemented suggestions
- [ ] Show actual savings vs projected
- [ ] Monthly/annual savings chart
- [ ] Optimization history timeline

**Files to create:**
- `src/components/optimizer/SavingsTracker.tsx`
- `src/components/optimizer/OptimizationHistory.tsx`

**Acceptance Criteria:**
- System analyzes conversations and detects patterns
- System generates optimization suggestions
- User can see potential savings for each suggestion
- User can test model downgrade side-by-side
- User can implement or ignore suggestions
- Dashboard shows actual savings after implementation

---

## Phase 5: RAG & Tools

**Timeline**: Week 5-6
**Goal**: Document upload and tool integration

### Backend Tasks

#### 5.1 Document Management
- [ ] File upload endpoint (PDF, TXT, MD)
- [ ] Document schema and storage
- [ ] Document chunking service
- [ ] Embedding generation (OpenAI/Anthropic)
- [ ] Store vectors in Qdrant

**Files to create:**
- `src/modules/documents/documents.module.ts`
- `src/modules/documents/documents.service.ts`
- `src/modules/documents/documents.controller.ts`
- `src/modules/documents/schemas/document.schema.ts`
- `src/modules/documents/chunking.service.ts`

**Dependencies to add:**
```bash
npm install pdf-parse mammoth # For PDF and DOCX parsing
```

#### 5.2 RAG Implementation
- [ ] Implement RAG node executor
- [ ] Query Qdrant for relevant chunks
- [ ] Inject context into LLM prompt
- [ ] Track RAG-specific costs

**Files to modify:**
- `src/modules/execution/engine/node-executor.ts` (RAG node)

#### 5.3 Built-in Tools
- [ ] Web search tool (SerpAPI or similar)
- [ ] Web scraper tool (Puppeteer/Playwright)
- [ ] HTTP request tool
- [ ] Calculator tool
- [ ] Tool execution framework

**Files to create:**
- `src/modules/tools/tools.module.ts`
- `src/modules/tools/tools.service.ts`
- `src/modules/tools/web-search.tool.ts`
- `src/modules/tools/web-scraper.tool.ts`
- `src/modules/tools/http-request.tool.ts`

### Frontend Tasks

#### 5.4 Document Upload UI
- [ ] Document upload component
- [ ] Document list view
- [ ] Document preview
- [ ] Delete document
- [ ] Link documents to agents

**Files to create:**
- `src/pages/Documents.tsx`
- `src/components/documents/DocumentUpload.tsx`
- `src/components/documents/DocumentList.tsx`
- `src/components/documents/DocumentPreview.tsx`

#### 5.5 RAG Node Configuration
- [ ] Document selector (which docs to search)
- [ ] Top-k slider
- [ ] Similarity threshold slider
- [ ] Chunk size configuration

**Files to modify:**
- `src/components/flow/config/RAGConfig.tsx`

#### 5.6 Tool Node Configuration
- [ ] Tool selector dropdown
- [ ] Tool-specific parameters
- [ ] API key management
- [ ] Tool output preview

**Files to create:**
- `src/components/flow/config/ToolConfig.tsx`

**Acceptance Criteria:**
- User can upload documents (PDF, TXT, MD)
- Documents are chunked and embedded
- RAG node retrieves relevant chunks
- User can configure RAG parameters (top_k, threshold)
- Built-in tools work (search, scrape, HTTP)
- Tool calls are tracked in execution logs

---

## Phase 6: Polish & Production-Ready

**Timeline**: Week 6-7
**Goal**: Production readiness and user experience improvements

### 6.1 Widget Generation
- [ ] Embeddable chat widget code generator
- [ ] Widget customization (colors, position, avatar)
- [ ] Widget API endpoints
- [ ] Widget script hosting

**Files to create:**
- `src/modules/widgets/widgets.module.ts`
- `src/modules/widgets/widgets.service.ts`
- `src/modules/widgets/widgets.controller.ts`
- `apps/frontend/src/components/widget/ChatWidget.tsx`

### 6.2 Analytics Dashboard
- [ ] Conversation volume chart
- [ ] Cost over time chart
- [ ] Average response time
- [ ] User satisfaction score (thumbs up/down)
- [ ] Most common queries
- [ ] Agent performance comparison

**Files to create:**
- `src/pages/Analytics.tsx`
- `src/components/analytics/ConversationVolume.tsx`
- `src/components/analytics/CostChart.tsx`
- `src/components/analytics/PerformanceMetrics.tsx`

### 6.3 User Feedback
- [ ] Thumbs up/down in conversation UI
- [ ] Feedback storage schema
- [ ] Feedback analytics
- [ ] Flag conversations for review

**Files to create:**
- `src/modules/feedback/feedback.module.ts`
- `src/modules/feedback/feedback.service.ts`
- `src/modules/feedback/schemas/feedback.schema.ts`

### 6.4 Export/Import Flows
- [ ] Export workflow as JSON
- [ ] Import workflow from JSON
- [ ] Workflow templates library
- [ ] Share workflow with others

**Files to create:**
- `src/components/workflow/ExportImport.tsx`
- `src/components/workflow/TemplateLibrary.tsx`

### 6.5 Production Hardening
- [ ] Error handling and logging (Winston)
- [ ] Rate limiting (per user, per agent)
- [ ] API documentation (Swagger)
- [ ] Database indexes
- [ ] Performance monitoring (Prometheus/Grafana)
- [ ] Security audit
- [ ] Load testing

**Acceptance Criteria:**
- Widget can be embedded in any website
- Analytics dashboard shows key metrics
- Users can provide feedback on conversations
- Workflows can be exported and imported
- API is documented with Swagger
- Error handling is comprehensive
- Rate limiting prevents abuse

---

## Post-MVP Features (Backlog)

### Advanced Testing
- [ ] A/B testing for prompts
- [ ] Performance regression testing
- [ ] Test data generation with LLM

### Advanced Optimization
- [ ] Automatic prompt engineering
- [ ] Model routing (route to cheapest capable model)
- [ ] Response caching with TTL
- [ ] Batch processing for cost reduction

### Collaboration
- [ ] Team workspaces
- [ ] Role-based access control
- [ ] Workflow sharing and templates
- [ ] Comments and annotations on workflows

### Integrations
- [ ] Slack integration
- [ ] Discord integration
- [ ] Zapier integration
- [ ] Webhook triggers

### Enterprise Features
- [ ] SSO (SAML, OAuth)
- [ ] Audit logs
- [ ] Custom deployment options
- [ ] SLA monitoring
- [ ] Multi-region deployment

---

## Success Metrics

### Phase 1 Metrics
- User can create and execute an agent: **Yes/No**
- Conversation is saved: **Yes/No**
- Response time: **< 5 seconds** for simple queries

### Phase 2 Metrics
- User can build workflow visually: **Yes/No**
- Debug mode works: **Yes/No**
- Cache saves costs: **> 30%** savings during iteration

### Phase 3 Metrics (Testing)
- Test suite creation time: **< 2 minutes**
- Test execution time: **< 30 seconds** for 10 tests
- User satisfaction with testing: **8+/10**

### Phase 4 Metrics (Optimizer)
- Optimization suggestions generated: **> 3** per agent
- Cost reduction achieved: **> 20%** on average
- User adoption rate: **> 50%** implement at least one suggestion

### Phase 5 Metrics (RAG)
- Document processing time: **< 1 minute** for 50-page PDF
- RAG response relevance: **> 80%** based on user feedback
- Tool execution success rate: **> 95%**

---

## Technical Debt & Maintenance

### Code Quality
- [ ] Increase test coverage to > 80%
- [ ] Add E2E tests with Playwright
- [ ] Document all public APIs
- [ ] Add code comments for complex logic

### Performance
- [ ] Optimize database queries (add indexes)
- [ ] Implement query result caching
- [ ] Optimize bundle size (< 500KB)
- [ ] Lazy load routes and components

### Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use Mongoose properly)
- [ ] XSS prevention (sanitize user input)
- [ ] Rate limiting on expensive operations
- [ ] API key rotation mechanism

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in CI
- [ ] Staging environment
- [ ] Blue-green deployment
- [ ] Database backup strategy

---

## Resources & References

### Inspiration
- **Catalyst**: Testing system with golden conversations and LLM-as-Judge
- **Distill**: Cost optimization through pattern detection and model downgrading
- **N8N**: Step-by-step workflow execution and debugging
- **LangFlow**: Visual workflow builder for LLM applications

### Technologies
- **LangChain**: LLM orchestration framework
- **LangGraph**: State machine for multi-step agents
- **Turborepo**: Monorepo build system
- **NestJS**: Backend framework
- **React Flow**: Visual workflow editor
- **Qdrant**: Vector database for RAG

### Documentation
- [LangChain Docs](https://js.langchain.com)
- [LangGraph Docs](https://langchain-ai.github.io/langgraphjs/)
- [React Flow Docs](https://reactflow.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

## Questions & Decisions

### Open Questions
1. Should we support multi-agent workflows (agent-to-agent communication)?
2. Which LLM providers to prioritize (Anthropic, OpenAI, others)?
3. Self-hosted vs cloud-based deployment strategy?
4. Pricing model (free tier, usage-based, seat-based)?

### Decisions Made
- ✅ Use Turborepo for monorepo management
- ✅ Use NestJS + Fastify for backend
- ✅ Use React + Vite for frontend
- ✅ Use MongoDB for primary database
- ✅ Use Redis for caching
- ✅ Use Qdrant for vector storage
- ✅ Implement step-by-step debugging (differentiator)
- ✅ Focus on cost optimization (market need)

---

## Contact & Collaboration

For questions or suggestions about this roadmap, create an issue in the repository or reach out to the team.

**Last Updated**: 2026-02-05
