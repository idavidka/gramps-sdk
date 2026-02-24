# @treeviz/gramps-sdk

TypeScript SDK for the [Gramps Web API](https://gramps-project.github.io/gramps-web-api/), enabling TreeViz users to connect their self-hosted Gramps Web servers and import family tree data.

## Features

- **JWT Authentication** – username/password login with automatic token refresh
- **Comprehensive API Coverage** – People, Families, Events, Places, Media, Metadata
- **Data Conversion** – Gramps JSON → TreeViz-compatible format
- **Full Tree Conversion** – converts an entire Gramps database with cross-reference enrichment
- **Server Validation** – URL validation and connectivity testing
- **TypeScript-first** – full type definitions for all Gramps Web API objects

## Installation

```bash
npm install @treeviz/gramps-sdk
```

## Quick Start

```typescript
import { createGrampsSDK } from '@treeviz/gramps-sdk';

// Create SDK instance
const sdk = createGrampsSDK({ serverUrl: 'https://gramps.example.com' });

// Authenticate
await sdk.connect({ username: 'admin', password: 'secret' });

// Fetch people
const people = await sdk.people.list({ pageSize: 50 });
console.log(`Found ${people.length} people`);

// Fetch families
const families = await sdk.families.list();

// Fetch events and places for conversion
const events = await sdk.events.list();
const places = await sdk.places.list();

// Convert to TreeViz format
import { convertTree } from '@treeviz/gramps-sdk';

const tree = convertTree({ people, families, events, places });
console.log(`Converted ${tree.report.peopleCount} people`);
```

## Authentication

### JWT (Username/Password)

```typescript
const sdk = createGrampsSDK({ serverUrl: 'https://gramps.example.com' });
await sdk.connect({ username: 'admin', password: 'secret' });
```

Tokens are automatically cached in `sessionStorage` (access token) and `localStorage` (refresh token). Subsequent calls to `connect()` will reuse cached tokens when possible.

### Direct Token

```typescript
const sdk = createGrampsSDK({
  serverUrl: 'https://gramps.example.com',
  accessToken: 'your-jwt-token',
});
```

## API Reference

### SDK Client

```typescript
const sdk = new GrampsSDK(config: GrampsSDKConfig);

sdk.connect(credentials: JWTCredentials): Promise<void>
sdk.disconnect(): void
sdk.setServerUrl(url: string): void
sdk.setAccessToken(token: string): void
sdk.getAccessToken(): string | null
sdk.hasAccessToken(): boolean
sdk.getServerUrl(): string
```

### People API

```typescript
sdk.people.list(options?: GrampsListOptions): Promise<GrampsPerson[]>
sdk.people.get(handle: string, options?: GrampsListOptions): Promise<GrampsPerson>
sdk.people.getTimeline(handle: string): Promise<unknown[]>
sdk.people.search(query: string): Promise<GrampsPerson[]>
```

### Families API

```typescript
sdk.families.list(options?: GrampsListOptions): Promise<GrampsFamily[]>
sdk.families.get(handle: string): Promise<GrampsFamily>
sdk.families.getTimeline(handle: string): Promise<unknown[]>
```

### Events API

```typescript
sdk.events.list(options?: GrampsListOptions): Promise<GrampsEvent[]>
sdk.events.get(handle: string): Promise<GrampsEvent>
```

### Places API

```typescript
sdk.places.list(options?: GrampsListOptions): Promise<GrampsPlace[]>
sdk.places.get(handle: string): Promise<GrampsPlace>
```

### Media API

```typescript
sdk.media.list(options?: GrampsListOptions): Promise<GrampsMedia[]>
sdk.media.get(handle: string): Promise<GrampsMedia>
sdk.media.getThumbnailPath(handle: string, size?: ThumbnailSize): string
sdk.media.getFilePath(handle: string): string
```

### Metadata API

```typescript
sdk.metadata.getMetadata(): Promise<GrampsServerInfo>
sdk.metadata.listTrees(): Promise<GrampsTreeInfo[]>
sdk.metadata.getTree(treeId: string): Promise<GrampsTreeInfo>
```

## Server Validation

```typescript
import { validateServerUrl, testServerConnection, checkApiCompatibility } from '@treeviz/gramps-sdk';

// Validate URL format
const { valid, error } = validateServerUrl('https://gramps.example.com');

// Test connectivity
const { reachable, info } = await testServerConnection('https://gramps.example.com');

// Check version compatibility (requires >= 2.0.0)
const { compatible, reason } = checkApiCompatibility(info.version);
```

## Data Conversion

```typescript
import { convertTree, convertPerson, convertFamily } from '@treeviz/gramps-sdk';

// Convert entire tree
const { people, families, events, places, report } = convertTree({
  people,
  families,
  events,
  places,
});

console.log(`Warnings: ${report.warnings.length}`);
console.log(`Errors: ${report.errors.length}`);

// Convert individual records
const person = convertPerson(grampsPerson);
const family = convertFamily(grampsFamily);
```

## Gramps Web Server Setup

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  gramps-web:
    image: ghcr.io/gramps-project/grampsweb:latest
    ports:
      - "5000:5000"
    environment:
      TREE: "MyFamilyTree"
      GRAMPSWEB_JWT_SECRET_KEY: "your-secret-key"
    volumes:
      - ./gramps_data:/app/data
```

### Nginx CORS Configuration (Required for Browser Access)

```nginx
location / {
    proxy_pass http://localhost:5000;
    add_header Access-Control-Allow-Origin "https://treeviz.com";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Authorization, Content-Type";
}
```

## License

MIT
