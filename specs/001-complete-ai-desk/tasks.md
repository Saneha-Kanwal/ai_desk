# Tasks: Complete AI News Aggregator Platform

**Input**: Design documents from `/specs/001-complete-ai-desk/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are OPTIONAL - not explicitly requested in specification, so test tasks are excluded. Focus on implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `frontend/app/`, `frontend/components/`, `frontend/lib/`
- Paths follow the structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure: `backend/app/`, `backend/app/routers/`, `backend/tests/`
- [X] T002 Create frontend directory structure: `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/public/`
- [X] T003 [P] Initialize Python backend project with `requirements.txt` in `backend/`
- [X] T004 [P] Initialize Next.js frontend project with `package.json` in `frontend/`
- [X] T005 [P] Create `.env.example` file in project root with required environment variables
- [X] T006 [P] Create `backend/app/config.py` for environment variable management using pydantic-settings
- [X] T007 [P] Create `backend/app/__init__.py` and `backend/app/routers/__init__.py`
- [X] T008 [P] Create `frontend/tsconfig.json` with TypeScript configuration
- [X] T009 [P] Create `frontend/tailwind.config.js` with Tailwind CSS configuration
- [X] T010 [P] Create `frontend/next.config.js` with Next.js configuration
- [X] T011 [P] Create `frontend/postcss.config.js` for PostCSS configuration
- [X] T012 [P] Create `backend/tests/__init__.py` and `backend/tests/conftest.py` for pytest setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T013 Create `backend/app/main.py` with FastAPI app initialization and CORS middleware
- [X] T014 [P] Create `backend/app/schemas.py` with base Pydantic models (NewsItemResponse, UserResponse, Token, etc.)
- [X] T015 [P] Create `backend/app/storage.py` with in-memory news storage using OrderedDict
- [X] T016 [P] Create `backend/app/auth_memory.py` with in-memory user storage and password hashing utilities
- [X] T017 [P] Create `backend/app/routers/health.py` with GET /api/health endpoint
- [X] T018 Create `frontend/lib/api.ts` with Axios client configuration and base API utilities
- [X] T019 Create `frontend/lib/auth.ts` with authentication utilities (token management, auth API client)
- [X] T020 Create `frontend/app/layout.tsx` with root layout structure and Header component integration
- [X] T021 Create `frontend/app/globals.css` with Tailwind directives and global styles
- [X] T022 Create `frontend/components/Header.tsx` with navigation header structure (auth buttons placeholder)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse and Filter AI News (Priority: P1) 🎯 MVP

**Goal**: Users can browse AI news articles displayed as cards on homepage with instant category filtering

**Independent Test**: Visit homepage → verify news cards display with title, summary, category, source, image, publication time → click category tab → verify instant filtering without page reload → verify news feed auto-updates

### Implementation for User Story 1

- [X] T023 [P] [US1] Create `backend/app/ingest.py` with RSS feed fetching functions using feedparser
- [X] T024 [US1] Implement RSS feed parsing in `backend/app/ingest.py` to extract title, url, source, published_at, summary, tags, thumbnail
- [X] T025 [US1] Implement category classification logic in `backend/app/ingest.py` (keyword-based: AI-Related News, Inventions, Technologies, Breakthroughs)
- [X] T026 [US1] Implement thumbnail extraction from RSS feeds in `backend/app/ingest.py` (media_thumbnail, media_content, links)
- [X] T027 [US1] Update `backend/app/storage.py` to add news items with category and thumbnail fields
- [X] T028 [US1] Implement `get_news_by_category()` function in `backend/app/storage.py` for category filtering
- [X] T029 [US1] Implement `search_news_items()` function in `backend/app/storage.py` with category parameter support
- [X] T030 [US1] Create `backend/app/routers/news.py` with GET /api/news endpoint supporting pagination, search, category filter
- [X] T031 [US1] Implement background news fetching task in `backend/app/routers/news.py` using BackgroundTasks
- [X] T032 [US1] Update `backend/app/main.py` to register news router and schedule periodic news fetching (every 10 minutes)
- [X] T033 [US1] Update `backend/app/schemas.py` with NewsItemResponse schema including category and thumbnail fields
- [X] T034 [US1] Create `frontend/components/NewsCard.tsx` component displaying title, summary, category, source, thumbnail, published time
- [X] T035 [US1] Create `frontend/components/CategoryNavbar.tsx` with sticky navigation bar and category filter tabs (AI-Related News, Inventions, Technologies, Breakthroughs)
- [X] T036 [US1] Implement client-side category filtering logic in `frontend/app/page.tsx` using useState and useMemo
- [X] T037 [US1] Create `frontend/app/page.tsx` homepage with news cards grid layout and category filtering integration
- [X] T038 [US1] Implement news fetching API call in `frontend/lib/api.ts` with category parameter support
- [X] T039 [US1] Implement automatic news feed updates in `frontend/app/page.tsx` using polling or useEffect with interval
- [X] T040 [US1] Add smooth animations to category filtering in `frontend/components/CategoryNavbar.tsx` and `frontend/app/page.tsx`
- [X] T041 [US1] Ensure news cards are wide, modern, beautiful, and responsive in `frontend/components/NewsCard.tsx`
- [X] T042 [US1] Update `frontend/app/globals.css` with responsive breakpoints and card styling

**Checkpoint**: At this point, User Story 1 should be fully functional - users can browse news, filter by category instantly, and see auto-updating feed

---

## Phase 4: User Story 2 - Read Comprehensive AI-Generated Articles (Priority: P1)

**Goal**: Users can click news cards to automatically generate and view comprehensive 800+ word articles with formatting and YouTube links

**Independent Test**: Click any news card → verify article page loads → verify AI agent automatically executes → verify article generates (800+ words) → verify formatting (headings, subheadings, bullet points) → verify YouTube links displayed

### Implementation for User Story 2

- [X] T043 [P] [US2] Create `backend/app/agents.py` with OpenAI client initialization using Assistants API v2 (default_headers)
- [X] T044 [US2] Implement `process_news_item_with_agent()` function in `backend/app/agents.py` using OpenAI Assistants API
- [X] T045 [US2] Configure system instructions in `backend/app/agents.py` to enforce 800+ word minimum and expert-level quality
- [X] T046 [US2] Implement research workflow in `backend/app/agents.py` (SEARCH → GATHER → SYNTHESIZE → CREATE)
- [X] T047 [US2] Implement word count validation and retry logic in `backend/app/agents.py` (retry up to 3 times if <800 words)
- [X] T048 [US2] Implement auto-enhancement loop in `backend/app/agents.py` to expand articles if word count insufficient
- [X] T049 [US2] Create `backend/app/youtube.py` with YouTube video search functions (optional - graceful degradation)
- [X] T050 [US2] Implement YouTube query generation in `backend/app/agents.py` (3-5 queries per article)
- [X] T051 [US2] Implement YouTube video fetching in `backend/app/agents.py` using `backend/app/youtube.py` (if API available)
- [X] T052 [US2] Update `backend/app/routers/news.py` with GET /api/news/{id} endpoint that automatically triggers article generation
- [X] T053 [US2] Implement force_regenerate parameter handling in GET /api/news/{id} endpoint
- [X] T054 [US2] Update `backend/app/schemas.py` with VideoResponse schema for YouTube videos
- [X] T055 [US2] Create `frontend/app/article/[id]/page.tsx` dynamic route for article pages
- [X] T056 [US2] Implement automatic article generation trigger in `frontend/app/article/[id]/page.tsx` on page load
- [X] T057 [US2] Create `frontend/components/InlineArticle.tsx` component for displaying formatted articles
- [X] T058 [US2] Implement article content parsing and formatting in `frontend/components/InlineArticle.tsx` (headings, subheadings, bullet points, code blocks)
- [X] T059 [US2] Implement YouTube video link display in `frontend/components/InlineArticle.tsx`
- [X] T060 [US2] Add modern typography styling to article display in `frontend/components/InlineArticle.tsx` and `frontend/app/article/[id]/page.tsx`
- [X] T061 [US2] Implement loading states for article generation in `frontend/app/article/[id]/page.tsx`
- [X] T062 [US2] Implement error handling for article generation failures in `frontend/app/article/[id]/page.tsx`
- [X] T063 [US2] Update `frontend/lib/api.ts` with getNewsItem() function for fetching article with generation
- [X] T064 [US2] Ensure article page routing works: clicking news card navigates to `/article/[id]` in `frontend/components/NewsCard.tsx`

**Checkpoint**: At this point, User Story 2 should be fully functional - users can click cards, automatically generate comprehensive articles, and view formatted content with YouTube links

---

## Phase 5: User Story 3 - Authenticate and Access Protected Content (Priority: P2)

**Goal**: Users can register, login, access protected article pages, and logout with JWT authentication stored in HttpOnly cookies

**Independent Test**: Register new account → verify account created → login → verify JWT cookie set → access article page → verify no redirect → logout → verify cookie cleared → try accessing article → verify redirect to login

### Implementation for User Story 3

- [X] T065 [P] [US3] Implement `create_user()` function in `backend/app/auth_memory.py` with password hashing using bcrypt
- [X] T066 [US3] Implement `authenticate_user()` function in `backend/app/auth_memory.py` for email/password validation
- [X] T067 [US3] Implement `create_access_token()` function in `backend/app/auth_memory.py` using python-jose for JWT generation
- [X] T068 [US3] Implement `get_user_by_email()` and `get_user_by_id()` functions in `backend/app/auth_memory.py`
- [X] T069 [US3] Create `backend/app/routers/auth_memory.py` with POST /api/auth/register endpoint
- [X] T070 [US3] Implement user registration logic in POST /api/auth/register (check duplicates, hash password, create user)
- [X] T071 [US3] Create POST /api/auth/login endpoint in `backend/app/routers/auth_memory.py`
- [X] T072 [US3] Implement login logic in POST /api/auth/login (validate credentials, issue JWT, set HttpOnly cookie)
- [X] T073 [US3] Create GET /api/auth/me endpoint in `backend/app/routers/auth_memory.py` for current user info
- [X] T074 [US3] Create POST /api/auth/logout endpoint in `backend/app/routers/auth_memory.py` to clear JWT cookie
- [X] T075 [US3] Implement JWT middleware/dependency in `backend/app/routers/auth_memory.py` using OAuth2PasswordBearer
- [X] T076 [US3] Implement `get_current_active_user()` dependency in `backend/app/routers/auth_memory.py` for protected routes
- [X] T077 [US3] Protect GET /api/news/{id} endpoint in `backend/app/routers/news.py` with JWT authentication requirement
- [X] T078 [US3] Update `backend/app/main.py` to register auth_memory router
- [X] T079 [US3] Update `backend/app/schemas.py` with RegisterRequest, LoginRequest, UserResponse schemas
- [X] T080 [US3] Create `frontend/app/register/page.tsx` with registration form (email, password, confirm password)
- [X] T081 [US3] Implement registration API call in `frontend/lib/auth.ts` with register() function
- [X] T082 [US3] Create `frontend/app/login/page.tsx` with login form (email, password)
- [X] T083 [US3] Implement login API call in `frontend/lib/auth.ts` with login() function (handles HttpOnly cookie)
- [X] T084 [US3] Implement logout functionality in `frontend/lib/auth.ts` with logout() function
- [X] T085 [US3] Implement getCurrentUser() function in `frontend/lib/auth.ts` for fetching current user info
- [X] T086 [US3] Update `frontend/components/Header.tsx` to display user email and logout button when authenticated
- [X] T087 [US3] Update `frontend/components/Header.tsx` to show login/signup buttons when not authenticated
- [X] T088 [US3] Implement authentication check in `frontend/app/article/[id]/page.tsx` - redirect to login if not authenticated
- [X] T089 [US3] Update `frontend/lib/api.ts` to include JWT token in Authorization header for authenticated requests
- [X] T090 [US3] Implement token refresh logic in `frontend/lib/api.ts` to handle token expiration
- [X] T091 [US3] Update `frontend/components/NewsCard.tsx` to handle click - check auth before navigating to article page

**Checkpoint**: At this point, User Story 3 should be fully functional - users can register, login, access protected articles, and logout with secure JWT authentication

---

## Phase 6: User Story 4 - View News by Time Period (Priority: P3)

**Goal**: Users can filter news articles by time periods (last 20 seconds, 30 minutes, 6 hours, 1 day, 4 days, or older)

**Independent Test**: Select "last 30 minutes" filter → verify only articles from last 30 minutes displayed → select "last 1 day" → verify articles from past 24 hours shown → verify instant updates

### Implementation for User Story 4

- [X] T092 [P] [US4] Implement time period filtering logic in `backend/app/storage.py` with time range calculations
- [X] T093 [US4] Update `get_news_by_category()` function in `backend/app/storage.py` to support time_period parameter
- [X] T094 [US4] Update `search_news_items()` function in `backend/app/storage.py` to support time_period parameter
- [X] T095 [US4] Update GET /api/news endpoint in `backend/app/routers/news.py` to accept time_period query parameter
- [X] T096 [US4] Implement time period filter application in GET /api/news endpoint (20s, 30m, 6h, 1d, 4d, older)
- [X] T097 [US4] Update `backend/app/schemas.py` with TimePeriod type definition (handled via regex validation in endpoint)
- [X] T098 [US4] Create time period filter UI component in `frontend/app/page.tsx` (added as select dropdown)
- [X] T099 [US4] Implement time period filter state management in `frontend/app/page.tsx`
- [X] T100 [US4] Update news fetching API call in `frontend/lib/api.ts` to include time_period parameter
- [X] T101 [US4] Implement client-side time period filtering in `frontend/app/page.tsx` (instant, no server round-trip)
- [X] T102 [US4] Update `frontend/app/page.tsx` to include time period filter dropdown/buttons
- [X] T103 [US4] Ensure time period filtering works in combination with category filtering

**Checkpoint**: At this point, User Story 4 should be fully functional - users can filter news by time periods instantly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T104 [P] Add error handling and user-friendly error messages across all frontend components
- [X] T105 [P] Add loading states and spinners across all frontend pages and components
- [X] T106 [P] Implement error logging in `backend/app/main.py` with proper log levels
- [X] T107 [P] Add input validation and sanitization in all backend endpoints
- [X] T108 [P] Optimize news card rendering performance in `frontend/components/NewsCard.tsx` (virtualization if needed)
- [X] T109 [P] Add SEO meta tags to `frontend/app/layout.tsx` and article pages
- [X] T110 [P] Create `frontend/public/robots.txt` and `frontend/app/sitemap.ts` for SEO
- [X] T111 [P] Add responsive design improvements across all components (mobile, tablet, desktop)
- [X] T112 [P] Implement proper CORS configuration in `backend/app/main.py` for production
- [ ] T113 [P] Add rate limiting to backend endpoints (if needed) - Optional enhancement
- [X] T114 [P] Update `README.md` with complete setup instructions and project overview
- [X] T115 [P] Create `backend/start_backend.sh` script for easy backend startup
- [X] T116 [P] Create `frontend/run_frontend.sh` script for easy frontend startup
- [ ] T117 [P] Validate quickstart.md instructions work end-to-end - Manual validation needed
- [X] T118 [P] Add comprehensive error messages for OpenAI API failures
- [X] T119 [P] Implement graceful degradation when YouTube API unavailable
- [X] T120 [P] Add accessibility improvements (ARIA labels, keyboard navigation) across frontend components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel after Foundational
  - User Story 3 (P2) depends on User Story 2 (article pages need protection)
  - User Story 4 (P3) can proceed independently but enhances User Story 1
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires User Story 1 for news cards to click
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Protects User Story 2 article pages
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Enhances User Story 1 filtering

### Within Each User Story

- Storage/Models before Services
- Services before Endpoints/Routers
- Backend endpoints before Frontend integration
- Core implementation before UI polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - User Story 1 backend tasks (T023-T032) can run in parallel with frontend tasks (T034-T042)
  - User Story 2 backend tasks (T043-T053) can run in parallel with frontend tasks (T055-T064)
  - User Story 3 backend tasks (T065-T078) can run in parallel with frontend tasks (T080-T091)
  - User Story 4 backend tasks (T092-T096) can run in parallel with frontend tasks (T098-T103)
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Backend tasks can run in parallel:
Task T023: Create ingest.py with RSS feed fetching
Task T027: Update storage.py to add category/thumbnail fields
Task T033: Update schemas.py with NewsItemResponse

# Frontend tasks can run in parallel:
Task T034: Create NewsCard.tsx component
Task T035: Create CategoryNavbar.tsx component
Task T038: Implement news fetching API call
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Browse and Filter AI News)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Full value!)
4. Add User Story 3 → Test independently → Deploy/Demo (Protected content!)
5. Add User Story 4 → Test independently → Deploy/Demo (Enhanced filtering!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Backend: ingest, storage, news router)
   - Developer B: User Story 1 (Frontend: NewsCard, CategoryNavbar, homepage)
   - Developer C: User Story 2 (Backend: agents, article generation)
   - Developer D: User Story 2 (Frontend: article page, InlineArticle)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks include exact file paths for clarity
- Tasks are ordered by execution dependencies within each phase

---

## Summary

**Total Tasks**: 120 tasks
- Phase 1 (Setup): 12 tasks ✅ **100% Complete**
- Phase 2 (Foundational): 10 tasks ✅ **100% Complete**
- Phase 3 (User Story 1): 20 tasks ✅ **100% Complete**
- Phase 4 (User Story 2): 22 tasks ✅ **100% Complete**
- Phase 5 (User Story 3): 27 tasks ✅ **100% Complete**
- Phase 6 (User Story 4): 12 tasks ✅ **100% Complete**
- Phase 7 (Polish): 17 tasks ✅ **94% Complete** (15/17 - 2 optional tasks remaining)

**Completion Status**: **118/120 tasks complete (98.3%)**

**Remaining Tasks** (Optional/Enhancement):
- T113: Rate limiting (optional enhancement for production)
- T117: Manual validation of quickstart.md instructions

**Parallel Opportunities**: 45+ tasks can run in parallel (marked with [P])

**MVP Scope**: Phases 1-3 (Setup + Foundational + User Story 1) = 42 tasks ✅ **Complete**

**Independent Test Criteria**:
- User Story 1: Visit homepage → verify cards display → verify category filtering works instantly
- User Story 2: Click card → verify article generates automatically → verify 800+ words → verify formatting
- User Story 3: Register → login → access article → verify protection → logout → verify redirect
- User Story 4: Select time filter → verify instant filtering by publication time

