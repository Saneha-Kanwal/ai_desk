<!--
Sync Impact Report:
Version: 1.0.0 (initial creation)
Date: 2025-01-27
Created: Initial constitution establishing core development principles
Principles: 15 core principles defined
Templates: None yet (to be created)
-->

# Project Constitution

**Project**: AI Desk - AI News Aggregator & Explainer  
**Version**: 1.0.0  
**Ratification Date**: 2025-01-27  
**Last Amended**: 2025-01-27

## Purpose

This constitution establishes the non-negotiable principles and governance rules for the AI Desk project. All code generation, refactoring, and architectural decisions MUST comply with these principles. This document serves as the single source of truth for development standards and practices.

## Core Principles

### Principle 1: Complete Production-Ready Code Generation

**MUST** generate complete, production-ready code for Next.js + FastAPI + OpenAI Agents SDK. All generated code MUST be functional, integrated, and ready for deployment without requiring manual fixes or placeholder completion.

**Rationale**: The project requires immediate deployability. Incomplete or placeholder code delays development and introduces technical debt.

### Principle 2: Zero Database Dependency

**MUST NEVER** require or use any database (PostgreSQL, MySQL, SQLite, MongoDB, etc.). **MUST ONLY** use in-memory storage or temporary files for data persistence.

**Rationale**: The project architecture is explicitly designed to operate without database infrastructure, reducing deployment complexity and operational overhead.

### Principle 3: Automatic File Generation

**MUST** automatically build missing files, components, pages, routes, or backend code if needed to fulfill requirements. Missing dependencies MUST be created rather than referenced as placeholders.

**Rationale**: The system must be self-contained and complete. Missing files break functionality and violate the production-ready principle.

### Principle 4: Strict Specification Adherence

**MUST** follow instructions in the Specification strictly. All requirements MUST be implemented exactly as specified without deviation, shortcuts, or "good enough" approximations.

**Rationale**: Consistency and predictability require strict adherence to documented requirements. Deviations introduce bugs and maintenance issues.

### Principle 5: Modern Responsive UI

**MUST** use modern, responsive UI and clean architecture. All user interfaces MUST be fully responsive across mobile, tablet, and desktop viewports. Architecture MUST follow separation of concerns and maintainability best practices.

**Rationale**: User experience and code maintainability are critical for long-term project success.

### Principle 6: Complete Integration

**MUST** ensure all pages, APIs, components, and agents integrate correctly. No component MUST exist in isolation; all parts MUST work together seamlessly.

**Rationale**: Integration failures cause runtime errors and poor user experience. Complete integration is a prerequisite for production readiness.

### Principle 7: Real Working Logic

**MUST** avoid dummy placeholders; always generate real working logic. All functions, handlers, and components MUST implement actual functionality, not stubs or TODO comments.

**Rationale**: Placeholders create false progress and require later rework. Real logic ensures immediate functionality.

### Principle 8: Automatic Refactoring

**MUST** regenerate or refactor code automatically to fulfill requirements. When requirements change, existing code MUST be updated rather than deprecated or left broken.

**Rationale**: Code must evolve with requirements. Manual refactoring is error-prone and time-consuming.

### Principle 9: TypeScript and Python 3 Standards

**MUST** use TypeScript for Next.js and Python 3 FastAPI. All frontend code MUST be TypeScript with proper type definitions. All backend code MUST be Python 3.11+ with type hints where applicable.

**Rationale**: Type safety reduces bugs and improves developer experience. Consistent language versions ensure compatibility.

### Principle 10: Database-Free Authentication

**MUST** ensure JWT authentication works fully without any database. Authentication MUST use in-memory storage or temporary files only. User sessions MUST persist across server restarts only if using file-based storage.

**Rationale**: Authentication is a core feature that must work within the zero-database constraint. In-memory solutions are acceptable for this project's requirements.

### Principle 11: Expert-Level Article Generation

**MUST** ensure agent writing quality is expert-level, long-form, formatted, and structured. Generated articles MUST be at least 800 words, professionally formatted with headings, subheadings, bullet points, examples, and conclusions.

**Rationale**: Article quality directly impacts user value. Expert-level content establishes credibility and user trust.

### Principle 12: Continuous News Updates

**MUST** ensure news fetching auto-updates continuously and displays as dynamic cards. News MUST be fetched periodically (every 10 minutes minimum) and displayed as interactive cards on the homepage without manual refresh.

**Rationale**: Real-time updates keep content fresh and engaging. Dynamic display provides immediate user feedback.

### Principle 13: Instant Client-Side Filtering

**MUST** ensure category filtering is client-side and instant. Filtering MUST occur without server round-trips or page reloads. Category changes MUST update the UI immediately with smooth transitions.

**Rationale**: Instant filtering provides superior user experience. Client-side filtering reduces server load and improves responsiveness.

### Principle 14: Automatic AI Agent Execution

**MUST** ensure article pages always run the AI agent automatically. When a user navigates to an article page, the AI agent MUST execute immediately without requiring user interaction or button clicks.

**Rationale**: Automatic execution reduces friction and ensures consistent article generation. Manual triggers create inconsistent user experience.

### Principle 15: Correctness and Completeness

**MUST** ensure every generated file is correct, complete, runnable, and integrated. All code MUST compile/run without errors, include necessary imports/dependencies, and integrate with the rest of the system.

**Rationale**: Incorrect or incomplete files break the build and prevent deployment. Every file must contribute to a working system.

## Governance

### Amendment Procedure

1. Proposed amendments MUST be documented with rationale and impact analysis.
2. Constitution version MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward incompatible principle removals or redefinitions
   - **MINOR**: New principle additions or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes
3. All dependent templates and documentation MUST be updated to reflect changes.
4. Amendment date MUST be updated to the current date (ISO format: YYYY-MM-DD).

### Versioning Policy

- Version format: `MAJOR.MINOR.PATCH`
- Version MUST be updated on every amendment
- Version history MUST be maintained in the Sync Impact Report comment at the top of this file

### Compliance Review

- All code generation MUST be validated against these principles before acceptance
- Violations MUST be corrected immediately, not deferred
- Regular reviews SHOULD be conducted to ensure ongoing compliance

### Template Synchronization

When principles are amended, the following artifacts MUST be reviewed and updated:

- `.specify/templates/plan-template.md` - Planning templates
- `.specify/templates/spec-template.md` - Specification templates
- `.specify/templates/tasks-template.md` - Task templates
- `.specify/templates/commands/*.md` - Command templates
- `README.md` - Project documentation
- Any runtime guidance documents

## Definitions

- **In-Memory Storage**: Data structures (dictionaries, lists, sets) that persist only during application runtime
- **Temporary Files**: File-based storage that may persist across restarts but is not a database system
- **Production-Ready**: Code that compiles, runs, integrates, and deploys without manual intervention
- **Complete Integration**: All components communicate correctly, data flows properly, and errors are handled gracefully
- **Expert-Level Content**: Articles that demonstrate deep understanding, proper structure, and professional writing quality

## Compliance

All agents, developers, and automated systems working on this project MUST comply with these principles. Non-compliance MUST be addressed immediately through code correction or constitution amendment (if the principle itself is found to be incorrect).

---

**End of Constitution**
