# Tech Tians Academy

Unlock your potential with us — India's premier Next-Gen Ed-Tech Platform.

---

## 🏛 Platform Architecture & Module Ownership

| Module | Scope | Stack | Owner |
|---|---|---|---|
| **M1** | Student Web Application | Next.js 14+ / React / Tailwind | Frontend Team (M1) |
| **M2** | Core Backend & Databases | NestJS / PostgreSQL / Redis | Backend Team (M2) |
| **M3** | **Admin & Teacher Panels + 3rd Party Integrations** | **Next.js 14+ / Tailwind / Firebase** | **M3 Team** |

---

## 🚀 Repositories & Workspaces

### `admin/` — Admin & Teacher Management Panels (M3)
Houses the enterprise administrative portal, batch orchestration, student rosters, doubt escalation engine, and faculty classroom hubs.
- **Path**: [`admin/`](file:///Users/kumarianjali/Documents/Tech%20Tians/Tech-Tians-Academy/admin)
- **Tech**: Next.js 14 (App Router), Tailwind CSS, Firebase FCM, Axios Interceptors, Zod.
- **Documentation**: Refer to [admin/README.md](file:///Users/kumarianjali/Documents/Tech%20Tians/Tech-Tians-Academy/admin/README.md) for environment configuration and run steps.

---

## 🌿 Git Branching Strategy & Workflow

- `main`: Production-ready code deployed to Vercel/Cloud.
- `develop`: Integration branch for sprint deliverables.
- Feature branches: `feat/<feature-name>`, `fix/<bug-name>`, `chore/<task-name>`, `refactor/<target>`.

### Commit Conventions
All team commits must follow the conventional commit standard:
- `feat: add collapsible sidebar with localStorage persistence`
- `fix: resolve 401 token refresh queue race condition`
- `chore: update dependencies and next.config.mjs`
- `refactor: extract toast alert into standalone hook`
