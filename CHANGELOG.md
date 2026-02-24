# Changelog

All notable changes to `@treeviz/gramps-sdk` will be documented in this file.

## [1.0.0] - 2026-02-24

### Added
- Initial release of `@treeviz/gramps-sdk`
- JWT authentication module (`src/auth/jwt.ts`)
  - `login()` – username/password login
  - `refreshToken()` – refresh JWT access token
  - `validateToken()` – validate a JWT token
  - Token storage helpers (sessionStorage + localStorage)
- HTTP client (`src/utils/http.ts`)
  - `GrampsHttpClient` – authenticated fetch-based client
  - Authorization header injection
  - Error handling and timeout support
- Server validation utilities (`src/utils/validation.ts`)
  - `validateServerUrl()` – URL format validation
  - `testServerConnection()` – connectivity testing
  - `checkApiCompatibility()` – version compatibility check
- API modules
  - `PeopleAPI` – list, get, timeline, search
  - `FamiliesAPI` – list, get, timeline
  - `EventsAPI` – list, get
  - `PlacesAPI` – list, get
  - `MediaAPI` – list, get, thumbnail/file paths
  - `MetadataAPI` – metadata, trees
- Data converters
  - `convertPerson()` – Gramps person → TreeViz format
  - `convertFamily()` – Gramps family → TreeViz format
  - `convertEvent()` – Gramps event → TreeViz format
  - `convertPlace()` – Gramps place → TreeViz format
  - `convertTree()` – full tree conversion with cross-reference enrichment
- TypeScript types for all Gramps Web API objects
- Main `GrampsSDK` client class with singleton management
- Unit tests for client, auth, validation, and converters
