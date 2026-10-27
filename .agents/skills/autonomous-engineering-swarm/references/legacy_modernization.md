# Legacy Codebase Modernization & Regression Protection

This guide defines the swarm's procedure for modernizing existing repositories, handling legacy monolithic controllers, and adding new features without breaking existing behavior.

---

## 1. Zero-Regression Modernization Protocol

When working in an existing codebase where business logic is embedded directly in controllers:

```
[Legacy Discovery]
       │
       ▼
1. Map Controllers ──► Identify routes, DB access, external APIs, and business rules.
       │
       ▼
2. Baseline Tests   ──► Author integration/regression tests for existing behavior BEFORE changing code.
       │
       ▼
3. Incremental Plan ──► Define feature boundaries. Do NOT rewrite unrelated controllers.
       │
       ▼
4. Extract Logic    ──► Move business rules from controller into Service layer ONLY when required.
       │
       ▼
5. Implement Feature──► Build new feature following clean architectural patterns.
       │
       ▼
6. Dual Verify      ──► Run both legacy regression suite and new feature tests.
```

---

## 2. Architectural Guidelines by Stack

### .NET APIs (ASP.NET Core / C#)
Modernize incrementally into a clean 3-tier structure:
1. **Controller Layer**:
   - Handles HTTP routing, model binding, input validation (FluentValidation/DataAnnotation), and HTTP status responses.
   - Zero business workflow logic; delegates to Services/MediatR handlers.
2. **Service / Application Layer**:
   - Contains business logic, workflows, domain events, and transaction orchestration.
3. **Repository / Infrastructure Layer**:
   - Entity Framework Core / Dapper persistence, external API clients, message brokers.
   - Avoid forcing repository interfaces for trivial read queries where direct DbContext suffices.

### Node.js / TypeScript (Express / NestJS / Fastify)
- Routes ➔ Controllers ➔ Services ➔ Data Access Objects (TypeORM / Prisma / Knex).
- Keep route signatures identical. Maintain backward compatibility for query params and response payloads.

### Python (FastAPI / Django / Flask)
- API Routers ➔ Service / Use-Case Layer ➔ SQLAlchemy / Repository.
- Pydantic models for request validation and response serialization.

---

## 3. Strict Rules for Legacy Modifications

1. **Never Blindly Rewrite**: Do not convert an entire codebase to a new framework or architecture in one PR.
2. **Contract Invariance**: Existing API routes, HTTP verbs, query parameters, authorization policies, and response schemas must remain identical unless explicitly approved by the human operator.
3. **Regression Tests First**: Write end-to-end or integration tests covering the existing controller before touching its code.
4. **Isolate Refactoring**: Keep pure refactoring PRs/commits separate from new feature implementations wherever practical.
