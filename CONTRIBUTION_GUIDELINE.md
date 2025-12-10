# Contributing Guidelines

Thank you for contributing to this project! Please follow the rules below to keep our codebase clean, consistent, and easy to maintain.

---

## 🚀 Branch Naming

**Use the following format for branch names:**

- `feature/[description]` - For new features
- `fix/[description]` - For bug fixes
- `docs/[description]` - For documentation updates
- `refactor/[description]` - For code refactoring

**Examples:**

- `feature/add-authentication`
- `feature/user-management`
- `fix/billing-calculation`
- `docs/api-documentation`

---

## 📝 Git Commit Messages

We follow the **conventional commit** style for consistency:

- `feat:` → For new features
- `fix:` → For bug fixes
- `docs:` → For documentation changes
- `refactor:` → For code refactoring without changing functionality
- `style:` → For formatting changes
- `test:` → For adding or updating tests
- `chore:` → For maintenance tasks

**Examples:**

- `feat: add user authentication system`
- `fix: resolve billing calculation error`
- `docs: update API documentation`
- `refactor: optimize database queries`

---

## 📂 File Naming Convention

- Use **camelCase** for all files:
  **Examples:**
- `userController.ts`
- `userService.ts`

## 🚫 Common Mistakes to Avoid

- Don't expose sensitive data in API responses (passwords, refresh_token)
- Don't use `any` type in TypeScript - use Prisma types or define custom types
- Don't skip input validation - always validate with Zod schemas
- Don't commit `.env` files - use `.env.example` instead
- Don't write business logic in controllers - use services layer
- Don't forget error handling in async functions - use try/catch with next()
- Don't forget to hash passwords before storing in database
- Don't skip role-based access control for protected endpoints
- Don't forget to exclude sensitive fields in Prisma select statements
- Don't use direct database field names in API responses - use consistent naming

---

## 🤝 Pull Requests

- Keep PRs small and focused on a single feature or fix
- Link related issues in the PR description
- Request at least one reviewer before merging
- Ensure all tests pass before submitting
- Update documentation if needed
- Follow the PR template (if available)
