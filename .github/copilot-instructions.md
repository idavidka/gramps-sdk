# GitHub Copilot Instructions - Gramps SDK

---

## ⚠️ MANDATORY BEHAVIORAL RULES — READ FIRST, ALWAYS APPLY

These rules are **non-negotiable** and apply to **every single response**, without exception.

### 1. 🌐 Response Language

> **ALWAYS respond in the same language the user used in their question.**
> - User writes in Hungarian → respond in Hungarian
> - User writes in English → respond in English
> - **NEVER** switch languages mid-response unless the user explicitly asks
> - This rule overrides all other language rules in this document

### 2. 📝 Suggested Commit Message — ALWAYS Required After Changes

> **EVERY response where any file, code, or configuration was modified MUST end with a suggested commit message.**
> This is automatic and unconditional — never skip it, never ask if needed.

**Required format at the end of every modifying response:**

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```

**Rules:**
- Use **Conventional Commits** format: `type(scope): subject`
- Keep it **under 72 characters**
- Use **imperative mood** ("add feature", not "added feature")
- **Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

---

## Project Overview

**Gramps SDK** (`@treeviz/gramps-sdk`) is a TypeScript SDK for the Gramps Web API. It provides JWT-based authentication, a REST API client for interacting with Gramps data, and data conversion utilities between Gramps and standard genealogy formats.

### Tech Stack

- **Language**: TypeScript
- **Build Tool**: tsup
- **Testing**: Vitest (with jsdom)
- **HTTP Client**: Native fetch API
- **Authentication**: JWT (JSON Web Tokens)
- **Module Format**: ES Modules + CJS

### Project Structure

```
gramps-sdk/
├── src/
│   ├── auth/          # JWT authentication (login, token management)
│   ├── api/           # REST API client (people, families, events, etc.)
│   ├── converters/    # Data conversion (Gramps ↔ GEDCOM, etc.)
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Helper utilities
│   ├── client.ts      # Main SDK client
│   ├── __tests__/     # Unit tests
│   └── index.ts       # Main entry point
└── README.md
```

### Key Features

1. **JWT Authentication**: Login to Gramps Web API with username/password, manage tokens
2. **REST API Client**: Type-safe access to Gramps Web API endpoints (people, families, events, places, sources)
3. **Data Converters**: Convert between Gramps data model and other formats (e.g., GEDCOM)
4. **Type Safety**: Full TypeScript support with detailed Gramps data types
5. **Error Handling**: Descriptive error classes for all API failure cases

### Code Style & Conventions

1. **Language**: All code, comments, and documentation must be in **English**
   - Variable names, function names, class names must be in English
   - All inline and documentation comments must be in English
   - All `.md` files must be in English
   - **Copilot Responses**: Always respond in the **same language as the user's question**
2. **TypeScript**: Strict mode enabled, avoid `any` types
3. **File Naming**: `kebab-case.ts`
4. **Error Handling**: Use typed error classes for all failures
5. **Testing**: Mock all HTTP requests in tests (no real API calls)
6. **Converters**: Keep conversion logic in `converters/`, not in API or auth modules

### Commit Message Convention

Follow **Conventional Commits** specification:

**Format:** `<type>(<scope>): <subject>`

**Examples:**
```
feat(api): add place search endpoint support
fix(auth): handle token expiration correctly
docs: update JWT authentication guide
test(converters): add GEDCOM conversion tests
refactor(types): improve Gramps data model types
```

### Common Tasks

#### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

#### Building
```bash
npm run build         # Build for production (tsup)
npm run dev           # Development watch mode
npm run clean         # Remove dist/
```

#### Publishing to NPM
```bash
npm version patch|minor|major
npm run build
npm publish
```

### API Structure

#### Entry Points (package.json exports)

- `.` — Main index (re-exports everything)
- `./auth` — JWT authentication utilities
- `./api` — REST API client modules
- `./converters` — Data conversion utilities
- `./types` — TypeScript type definitions
- `./utils` — Helper utilities

#### Usage Example

```typescript
import { GrampsClient } from '@treeviz/gramps-sdk';

const client = new GrampsClient({
  baseUrl: 'https://your-gramps-web.example.com',
});

// Authenticate
await client.login('username', 'password');

// Fetch people
const people = await client.api.getPeople({ page: 0, pageSize: 20 });

// Fetch a single person
const person = await client.api.getPerson('handle-id');

// Convert to GEDCOM
import { toGedcom } from '@treeviz/gramps-sdk/converters';
const gedcomString = toGedcom(person);
```

### Authentication Flow (JWT)

1. Call `client.login(username, password)` → receives JWT access token + refresh token
2. SDK automatically attaches Bearer token to all API requests
3. On token expiry, SDK attempts automatic refresh
4. On refresh failure, re-authentication is required

### Testing Best Practices

1. **Mock HTTP**: Use Vitest to mock fetch responses
2. **Test Auth**: Mock login and token refresh flows
3. **Error Cases**: Test 401 (unauthorized), 404 (not found), 500 (server error)
4. **Converters**: Test conversion logic with sample Gramps data
5. **Type Safety**: Verify response types match TypeScript definitions

### Security Best Practices

1. **Credentials**: Never hardcode username/password in source code
2. **JWT Storage**: Store tokens securely (never in localStorage for sensitive deployments)
3. **HTTPS Only**: Always connect to Gramps Web API over HTTPS
4. **Token Refresh**: Implement secure token refresh; invalidate on logout

### Common Issues & Solutions

#### JWT Expiration
- Access tokens expire; implement automatic refresh via the auth module
- If refresh fails, prompt user to re-authenticate

#### Self-Hosted Gramps Web API
- The SDK targets the [Gramps Web API](https://gramps-project.github.io/gramps-web-api/)
- Base URL must point to your own Gramps Web instance
- Ensure CORS is configured on the server for browser usage

### Contact & Resources

- **NPM Package**: `@treeviz/gramps-sdk`
- **Repository**: https://github.com/idavidka/gramps-sdk
- **Gramps Web API Docs**: https://gramps-project.github.io/gramps-web-api/
- **Parent Project**: TreeViz Monorepo

---

**When working on this project:**
1. Always write in English (code, comments, docs)
2. Mock all HTTP requests in tests
3. Follow Gramps Web API data model conventions
4. Keep converters isolated from API/auth logic
5. Never hardcode credentials
6. **After completing changes, ALWAYS suggest a commit message** following Conventional Commits format

**Commit Message Reminder:**
After making any changes, ALWAYS provide a suggested commit message at the end of your response:

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```
