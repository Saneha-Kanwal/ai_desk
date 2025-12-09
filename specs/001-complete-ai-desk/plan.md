# Implementation Plan: Complete AI News Aggregator Platform

**Branch**: `001-complete-ai-desk` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-complete-ai-desk/spec.md`

## Summary

Build a complete full-stack AI news aggregator platform with Next.js frontend and FastAPI backend. The system fetches AI-related news from multiple sources, categorizes articles automatically, displays them as dynamic cards with client-side filtering, and generates comprehensive 800+ word articles using OpenAI Agents SDK when users click on news cards. Authentication uses JWT tokens stored in HttpOnly cookies with in-memory user storage (no database). The platform operates entirely without database dependencies, using only in-memory storage or temporary files.

**Technical Approach**: 
- Frontend: Next.js 14+ with TypeScript, Tailwind CSS, App Router
- Backend: FastAPI (Python 3.11+) with OpenAI Agents SDK integration
- Storage: In-memory dictionaries/lists for runtime data, optional JSON files for persistence
- Authentication: JWT tokens in HttpOnly cookies, password hashing with bcrypt
- News Fetching: RSS feed parsing with periodic updates (every 10 minutes)
- Article Generation: OpenAI Assistants API v2 with comprehensive research and synthesis

## Technical Context

**Language/Version**: 
- Backend: Python 3.11+
- Frontend: TypeScript 5.3+ (Next.js 14+)

**Primary Dependencies**: 
- Backend: FastAPI, Uvicorn, OpenAI SDK (Assistants API v2), APScheduler, python-jose, passlib[bcrypt], httpx, feedparser
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Axios, date-fns

**Storage**: 
- In-memory Python dictionaries for news articles and user accounts
- Optional temporary JSON files for user persistence across restarts
- No database systems (PostgreSQL, SQLite, MongoDB, etc.)

**Testing**: 
- Backend: pytest with async support
- Frontend: Playwright for E2E testing, Jest for unit tests (if needed)

**Target Platform**: 
- Backend: Linux server (Python 3.11+)
- Frontend: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

**Project Type**: Web application (frontend + backend)

**Performance Goals**: 
- Homepage loads news articles within 2 seconds
- Category filtering updates UI in under 100ms
- Article generation completes within 30 seconds
- System handles 100 concurrent users without degradation
- News feed updates every 10 minutes automatically

**Constraints**: 
- Zero database dependency (must use in-memory or temporary files only)
- Article generation minimum 800 words (no maximum)
- Client-side filtering must be instant (no server round-trips)
- JWT tokens stored in HttpOnly cookies (not localStorage)
- All code must be production-ready (no placeholders)
- Must work across mobile (320px+), tablet (768px+), desktop (1024px+) viewports

**Scale/Scope**: 
- Support 100 concurrent users
- Handle 1000+ news articles in memory
- Fetch from 3+ news sources
- Generate articles on-demand (no pre-generation)
- Category classification accuracy: 85%+

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Evaluation

✅ **Principle 1 (Complete Production-Ready Code)**: PASS - Plan requires all code to be functional and integrated  
✅ **Principle 2 (Zero Database Dependency)**: PASS - Explicitly using in-memory storage only  
✅ **Principle 3 (Automatic File Generation)**: PASS - Plan includes generating all required files  
✅ **Principle 4 (Strict Specification Adherence)**: PASS - Plan follows spec requirements exactly  
✅ **Principle 5 (Modern Responsive UI)**: PASS - Plan includes responsive design across all viewports  
✅ **Principle 6 (Complete Integration)**: PASS - Plan ensures frontend-backend integration  
✅ **Principle 7 (Real Working Logic)**: PASS - Plan excludes placeholders  
✅ **Principle 8 (Automatic Refactoring)**: PASS - Plan includes updating existing code  
✅ **Principle 9 (TypeScript/Python 3)**: PASS - Plan uses TypeScript and Python 3.11+  
✅ **Principle 10 (Database-Free Auth)**: PASS - Plan uses in-memory JWT auth  
✅ **Principle 11 (Expert-Level Articles)**: PASS - Plan enforces 800+ word minimum  
✅ **Principle 12 (Continuous Updates)**: PASS - Plan includes periodic news fetching  
✅ **Principle 13 (Instant Filtering)**: PASS - Plan uses client-side filtering  
✅ **Principle 14 (Automatic Agent Execution)**: PASS - Plan triggers agent on page load  
✅ **Principle 15 (Correctness/Completeness)**: PASS - Plan ensures all files are correct and integrated

**Gate Status**: ✅ ALL GATES PASSED - Proceeding to Phase 0

### Post-Phase 1 Evaluation

✅ **Principle 1 (Complete Production-Ready Code)**: PASS - Design includes all required components  
✅ **Principle 2 (Zero Database Dependency)**: PASS - Data model uses in-memory storage only  
✅ **Principle 3 (Automatic File Generation)**: PASS - Contracts define all required endpoints  
✅ **Principle 4 (Strict Specification Adherence)**: PASS - Design matches spec requirements  
✅ **Principle 5 (Modern Responsive UI)**: PASS - Frontend structure supports responsive design  
✅ **Principle 6 (Complete Integration)**: PASS - API contracts ensure frontend-backend integration  
✅ **Principle 7 (Real Working Logic)**: PASS - No placeholders in design  
✅ **Principle 8 (Automatic Refactoring)**: PASS - Design supports code updates  
✅ **Principle 9 (TypeScript/Python 3)**: PASS - Contracts use TypeScript, backend Python 3.11+  
✅ **Principle 10 (Database-Free Auth)**: PASS - Auth design uses in-memory storage  
✅ **Principle 11 (Expert-Level Articles)**: PASS - Article generation enforces 800+ words  
✅ **Principle 12 (Continuous Updates)**: PASS - Design includes periodic news fetching  
✅ **Principle 13 (Instant Filtering)**: PASS - Frontend design supports client-side filtering  
✅ **Principle 14 (Automatic Agent Execution)**: PASS - Article endpoint triggers agent automatically  
✅ **Principle 15 (Correctness/Completeness)**: PASS - All contracts and models are complete

**Gate Status**: ✅ ALL GATES PASSED - Ready for Phase 2 (Task Creation)

## Project Structure

### Documentation (this feature)

```text
specs/001-complete-ai-desk/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api.yaml         # OpenAPI 3.0 specification
│   └── types.ts         # TypeScript type definitions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Settings and environment variables
│   ├── storage.py                 # In-memory news storage
│   ├── auth_memory.py             # In-memory auth storage
│   ├── agents.py                  # OpenAI Agents SDK integration
│   ├── ingest.py                  # RSS feed fetching and parsing
│   ├── youtube.py                 # YouTube API integration (optional)
│   ├── schemas.py                 # Pydantic models
│   └── routers/
│       ├── __init__.py
│       ├── news.py                # News endpoints (GET /news/latest, GET /news/{id})
│       ├── auth_memory.py         # Auth endpoints (POST /auth/register, POST /auth/login, GET /auth/me)
│       └── health.py               # Health check endpoint
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_agents.py
│   └── test_ingest.py
├── requirements.txt
└── start_backend.sh

frontend/
├── app/
│   ├── layout.tsx                  # Root layout with Header
│   ├── page.tsx                    # Homepage with news cards
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx            # Dynamic article page
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── register/
│   │   └── page.tsx                # Registration page
│   └── globals.css                 # Global styles
├── components/
│   ├── Header.tsx                  # Navigation header with auth
│   ├── CategoryNavbar.tsx          # Sticky category filter tabs
│   ├── NewsCard.tsx                # News article card component
│   ├── SearchBar.tsx               # Search input component
│   ├── InlineArticle.tsx           # Article display component
│   ├── AnimatedLogo.tsx            # Animated logo component
│   ├── ParticleBackground.tsx     # Particle background effect
│   └── BackendStatus.tsx           # Backend connection status
├── lib/
│   ├── api.ts                      # API client for backend
│   └── auth.ts                     # Auth utilities and API
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

**Structure Decision**: Web application structure with separate `backend/` and `frontend/` directories. Backend uses FastAPI with modular routers. Frontend uses Next.js App Router with TypeScript. Both follow clean architecture principles with separation of concerns.

## Complexity Tracking

> **No violations - all principles complied with**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase Completion Summary

### Phase 0: Research ✅ COMPLETE

**Deliverables**:
- `research.md` - Comprehensive research on 10 key technical decisions
- All NEEDS CLARIFICATION markers resolved
- Technical choices documented with rationale and alternatives

**Key Decisions**:
- OpenAI Assistants API v2 with GPT-4-turbo-preview
- In-memory storage with OrderedDict
- JWT authentication with HttpOnly cookies
- RSS feed parsing with feedparser
- Client-side filtering with React useMemo
- Keyword-based categorization

### Phase 1: Design & Contracts ✅ COMPLETE

**Deliverables**:
- `data-model.md` - Complete entity definitions with validation rules
- `contracts/api.yaml` - OpenAPI 3.0 specification
- `contracts/types.ts` - TypeScript type definitions
- `quickstart.md` - Developer quick start guide
- Agent context updated for Cursor IDE

**Key Artifacts**:
- 6 entities defined (NewsArticle, UserAccount, AuthenticationToken, ArticleContent, Video, Category)
- 7 API endpoints specified (news, auth, health)
- Complete type definitions for frontend integration
- Step-by-step setup instructions

### Next Phase: Task Creation

Ready for `/speckit.tasks` command to break down implementation into actionable tasks.
