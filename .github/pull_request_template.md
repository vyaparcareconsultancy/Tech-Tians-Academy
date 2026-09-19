## PR Description
Provide a concise summary of the changes introduced in this PR.

## Type of Change
- [ ] `feat`: A new feature
- [ ] `fix`: A bug fix
- [ ] `chore`: Build process, dependencies, or tool configurations
- [ ] `refactor`: Code change that neither fixes a bug nor adds a feature
- [ ] `docs`: Documentation updates

## Module
- [ ] M1: Student Web Portal
- [ ] M2: NestJS Core Backend & Database
- [x] M3: Admin & Teacher Management Panels (Next.js)

## Checklist
- [ ] Code strictly follows TypeScript and ESLint standards
- [ ] Components adhere to M1 design system (Navy `#0A1628`, Blue `#2563EB`, Cyan `#06B6D4`)
- [ ] No hardcoded API URLs or secrets (all managed via `.env`)
- [ ] Mock services verify standalone execution (`NEXT_PUBLIC_USE_MOCK=true`)
- [ ] Mobile responsive layout tested and verified
- [ ] Firebase messaging / notifications gracefully handle fallback
