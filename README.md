# HIMTI Education Frontend

Public Responsi frontend for HIMTI BINUS. Implements the approved white-and-blue reference with course discovery, summary reading, Study Club/Responsi schedules, and recording discovery.

## Development

Use Node.js 22.12+ (or a compatible newer LTS).

```sh
npm ci
npm run dev
```

Open `http://localhost:3003`. Vite proxies the default same-origin `/api/public` to the local backend on port `8000`. With `docker compose up --build -d`, the proxy reaches the host backend through `host.docker.internal`. Set `PUBLIC_API_PROXY_TARGET` to override the development proxy when running Vite directly. `VITE_PUBLIC_API_BASE_URL` overrides the browser API prefix; never put secrets in `VITE_*` values.

```sh
npm run build
npm run lint
npm test
```

## Public routes

| Route | Experience |
| --- | --- |
| `/` | Home and summary-title search |
| `/courses` | Course directory with search and semester filtering |
| `/courses/:courseId` | Course summaries, sessions, and recordings |
| `/responsi` | Summary-title search and course filtering |
| `/responsi/:summaryId` | Read-only summary with code, math, and table of contents |
| `/study-clubs` | Calendar for both Study Club and Responsi events |
| `/study-clubs/:eventId` | Event details and optional external actions |
| `/videos` | Recording discovery and YouTube embed when a URL exists |

Calendar month, event/course filters, and summary queries are shareable URL parameters. Event dates and times display in Asia/Jakarta (WIB).

## Production data and deployment

The app requests real public API data. There is **no bundled demo catalog, document, event, contributor, or fallback seed**. Synthetic data exists only in test fixtures and is not imported by production code. An empty catalog renders empty states; API/network/schema errors render retry states instead of fabricated content.

The implemented frontend contract is [API-CONTRACT.md](API-CONTRACT.md):

- `GET /api/public/catalog`: complete public metadata snapshot; no summary bodies.
- `GET /api/public/summaries/{id}`: read-only Tiptap document, loaded only in the Reader.
- API transport has cancellation, a 15-second timeout, bounded retries and runtime response validation. The backend must still enforce publication/retention rules and validate content before publishing.
- Frontend cache becomes stale after 60 seconds and refreshes on mount/window focus. No realtime polling is claimed.

Build with `npm run build` and deploy `dist/` to a static HTTPS host. Set the API prefix **at build time**. Configure SPA fallbacks for frontend routes, excluding `/api/*`; never return `index.html` for an API request. Revalidate HTML, cache hashed assets immutably, and configure CORS/security headers/CSP for the actual infrastructure. See the deployment checklist in the contract.

No authentication, management UI, backend, database schema, storage, or collaboration infrastructure is included. The backend is not supplied or deployed by this repository. **Go-live requires both endpoints and a real-backend smoke test**; without them the frontend correctly shows an API error. No public archive duration is assumed.

## Structure

- `src/pages`: route-level screens and supporting compositions.
- `src/components`: shared resources, public layout, data boundary, and lazy summary renderer.
- `src/api`: validated public API transport and TanStack Query retrieval.
- `src/config`: Query configuration.
- `src/data`: public domain types and search/URL helpers, no academic records.
- `src/test/fixtures`: synthetic test-only records/documents, excluded from the application import graph.
- `src/utils`: date display helpers.

Brand asset provenance is in `docs/ASSETS.md`. Product context and the approved visual direction are in `PRODUCT.md` and `.impeccable/surfaces/education.md`.

---

# HIMTI Regis Frontend

Frontend boilerplate for the HIMTI Regis application. It is intentionally kept
small so forks can add feature folders as the product grows.

## Project Structure

```text
<project-name>/
├── src/
│   ├── api/                    # Feature-based API queries and mutations
│   │   └── users/
│   │       └── queries.ts      # User types, queries, and mutations
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Design-system UI primitives
│   │   └── layout/             # Shared layout components
│   ├── config/                 # API client, runtime, routing, and query config
│   ├── constants/              # API endpoints, query keys, and static values
│   ├── data/                   # Static or seed data
│   ├── hooks/                  # Reusable and feature-specific React hooks
│   ├── lib/                    # Shared library helpers
│   ├── pages/                  # Route-level components grouped by feature
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # General-purpose utilities
│   ├── App.tsx                 # Root providers and application routes
│   ├── main.tsx                # Browser entry point and global providers
│   ├── index.css               # Tailwind layers, tokens, and global styles
│   └── vite-env.d.ts           # Vite environment types
├── .env                        # Local environment variables (do not commit)
├── .env.example                # Environment variable template
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind theme configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite and path-alias configuration
└── README.md                   # Project documentation
```

Only keep directories that the project actually uses. Add feature folders as
the application grows instead of creating empty layers in advance.

### `src/api/`

Contains server communication grouped by feature or resource. A typical
`queries.ts` file contains:

- Request and response types
- TanStack Query hooks for `GET` requests
- Mutation hooks for `POST`, `PUT`, `PATCH`, and `DELETE` requests
- Cache invalidation rules after successful mutations

Example: `src/api/users/queries.ts` may export `useUsers`, `useCreateUser`,
`useUpdateUser`, and `useDeleteUser`.

### `src/config/`

Contains application-wide configuration:

- `api-client.ts` creates the shared Axios instance, reads the API base URL,
  enables credentials when required, and attaches authentication headers.
- `react-query.ts` configures caching, retries, and refetch behavior.
- `routes.ts` defines route metadata and page components.
- `runtime.ts` validates and exposes environment-dependent values.

### `src/constants/`

Contains values shared throughout the application, such as API paths, query
keys, feature flags, and other static identifiers. Environment-specific values
belong in Vite environment variables rather than committed source files.

### `src/components/`

Contains reusable components. Keep general UI primitives separate from
feature-specific components where that distinction is useful.

```text
components/
├── ui/                         # Button, Input, Dialog, Card, and similar primitives
├── forms/                      # Reusable form compositions
└── layout/                     # Header, Sidebar, PageLayout, and similar shells
```

### `src/hooks/`

Contains reusable hooks and hooks that coordinate feature behavior. Keep raw
API query definitions in `src/api/` so components have one predictable place
for server-state operations.

Examples: `useDebounce.ts`, `useLocalStorage.ts`, or
`hooks/users/useUserFilters.ts`.

### `src/pages/`

Contains route-level components grouped by feature. Each folder may include
the page component and supporting components that are not reusable elsewhere.

```text
pages/
├── home/
│   └── index.tsx
├── dashboard/
│   └── index.tsx
└── users/
    ├── index.tsx               # User list page
    └── detail/
        └── index.tsx           # User detail page
```

### `src/types/`

Contains TypeScript types shared across multiple features. Types used by only
one API resource or component should stay beside that code.

Examples: `route.ts`, `common.ts`, and `models.ts`.

### `src/utils/` and `src/lib/`

Contain small, reusable helpers. This codebase uses `src/lib/utils.ts` for UI
class-name composition; projects may use `src/utils/` for helpers such as date
formatting or validation.

## Technology Stack and Libraries

The following libraries form the core frontend setup. Versions are defined in
`package.json`; add feature-specific libraries only when the product needs
them.

| Library | Purpose and relationship |
| --- | --- |
| React and React DOM | Build and render the component tree in the browser. |
| TypeScript | Adds static types to components, routes, API payloads, and configuration. |
| Vite | Provides the development server, environment handling, and production bundling for the React application. |
| React Router DOM | Maps URLs to page components and supports nested and protected routes. |
| Axios | Provides the shared HTTP client used by API hooks for base URLs, credentials, headers, and interceptors. |
| TanStack Query | Calls API functions and manages server-state loading, errors, caching, refetching, and mutation invalidation. Feature hooks connect Axios to TanStack Query. |
| Tailwind CSS | Provides utility classes backed by the project's design tokens. |
| shadcn/ui and Radix UI | Provide editable, accessible UI components and the unstyled primitives behind dialogs, menus, labels, and similar controls. |
| `class-variance-authority`, `clsx`, and `tailwind-merge` | Define component variants and safely compose conditional Tailwind class names through the shared `cn` helper. |
| Vitest and Testing Library | Run unit and component tests in a browser-like environment and verify behavior through user-visible interactions. |
| ESLint | Enforces JavaScript, TypeScript, React Hooks, and React Refresh rules. |

React DOM mounts the root component from `main.tsx`. `App.tsx` installs
application providers and lets React Router select the page for the current
URL. Feature hooks use Axios for requests and TanStack Query for server state.
The UI layer combines accessible shadcn-style components with Tailwind,
component variants, and the shared class-name helper.

## Getting Started

### Prerequisites

- Node.js 22 or newer
- npm
- Access to the project's API and authentication services, if applicable

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Replace the example values with settings for the local environment:

```dotenv
VITE_API_BASE_URL=<API_BASE_URL>
VITE_APP_URL=<APPLICATION_URL>
```

Only variables prefixed with `VITE_` are exposed to browser code. Never put
secrets in frontend environment variables or commit `.env`.

### Development with Docker

Docker runs the Vite development server with source code mounted for automatic
reloads. After creating `.env`, build and start the frontend:

```bash
docker compose up --build
```

Open `http://localhost:3003`. The API URL in `.env.example` points to the
backend boilerplate at `http://localhost:8000`; run that repository's Compose
setup separately when the frontend needs the local API.

Stop the frontend with:

```bash
docker compose down
```

### Development

Start the development server:

```bash
npm run dev
```

The default Vite URL for this setup is `http://localhost:3003`.

### Build

Create a production build:

```bash
npm run build
```

If the project supports additional Vite modes, build them with the matching
scripts:

```bash
npm run build:dev
npm run build:staging
```

Set the appropriate environment variables before building each environment.
Vite embeds public frontend configuration at build time.

### Preview

Serve the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint:

```bash
npm run lint
```

### Test

Run the test suite once:

```bash
npm test
```

## Using the API Layer

The starter page's `src/api/health/queries.ts` is a working example of calling
the backend through the shared API client and exposing request state through a
TanStack Query hook.

### 1. Define Query Keys

Keep query keys stable and scoped by resource. They may be constants or small
key factories when parameters are involved.

```typescript
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
};
```

### 2. Create API Hooks

Create `src/api/<feature>/queries.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/config/api-client";
import { queryKeys } from "@/constants/query-keys";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.get<User[]>("/users").then(({ data }) => data),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => apiClient.post("/users", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  });
}
```

### 3. Use Hooks in a Component

```tsx
import { useCreateUser, useUsers } from "@/api/users/queries";

export default function UsersPage() {
  const users = useUsers();
  const createUser = useCreateUser();

  if (users.isPending) return <p>Loading users...</p>;
  if (users.isError) return <p>Could not load users.</p>;

  return (
    <section>
      <button
        type="button"
        onClick={() =>
          createUser.mutate({ name: "Example User", email: "user@example.com" })
        }
        disabled={createUser.isPending}
      >
        Add user
      </button>

      {users.data.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </section>
  );
}
```

Components consume query state but do not duplicate request configuration or
cache logic. Mutations invalidate the relevant keys so active queries refresh.

## Adding a New Feature

Example: add an `articles` resource.

### 1. Add Query Keys

Update `src/constants/query-keys.ts`:

```typescript
export const queryKeys = {
  articles: ["articles"] as const,
  article: (id: string) => ["articles", id] as const,
};
```

### 2. Add API Hooks

Create `src/api/articles/queries.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/config/api-client";
import { queryKeys } from "@/constants/query-keys";

export interface Article {
  id: string;
  title: string;
  content: string;
}

export function useArticles() {
  return useQuery({
    queryKey: queryKeys.articles,
    queryFn: () => apiClient.get<Article[]>("/articles").then(({ data }) => data),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (article: Omit<Article, "id">) =>
      apiClient.post("/articles", article),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.articles }),
  });
}
```

### 3. Add the Page and Route

Create `src/pages/articles/index.tsx`, consume the hooks there, and register the
page in `src/config/routes.ts`. Wrap the route with the project's protected
route mechanism when authentication or permissions are required.

## Tailwind Design System

The Tailwind theme maps semantic utilities to CSS custom properties declared
in `src/index.css`. Prefer semantic classes so components continue to work when
the theme changes.

### Colors

Keep the brand and accent palette, but use semantic tokens for implementation:

| Role | Token direction | Use |
| --- | --- | --- |
| Brand | `#00214F`, `#004CB5`, `#7599CA`, `#B6C5DA`, `#F8FAFC` | Identity, primary actions, and supporting brand surfaces |
| Background | `#F8FAFC` / `#F3F3F3` | App and muted surfaces; do not use the pale blues or grays for body text |
| Foreground | `#101010` / `#B4B4B4` | Default text and genuinely secondary content; use `#101010` for readable text |
| Borders | `#CECECE` / `#BDBDBD` | Dividers, inputs, and cards; use `#004CB5` for focus rings |
| Accents | `#16A34A`, `#FFB100`, `#DC2626` | Success, warning, and destructive states; pair with dark text on yellow and white text on green/red |

Use `bg-background` with `text-foreground` for pages, `bg-card` with
`text-card-foreground` for contained surfaces, and `border-border` with
`ring-ring` for controls. Keep pale brand colors as fills, not text, and verify
contrast whenever a token pairing is introduced. Reusable components should
prefer these semantic tokens over raw hex values.

### Typography

Set the primary font family in `tailwind.config.js` and load it in
`src/index.css` or through Fontsource. This example codebase uses Plus Jakarta
Sans and includes both general heading/body utilities and a design-system type
scale.

```tsx
export function ExampleCard() {
  return (
    <article className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h2 className="text-ds-h2">Section title</h2>
      <p className="mt-2 text-ds-body text-muted-foreground">
        Supporting content using semantic typography and color tokens.
      </p>
      <button className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Continue
      </button>
    </article>
  );
}
```

### UI Components

Reusable primitives live in `src/components/ui/`. Update those components or
the shared tokens rather than restyling every feature independently. Preserve
keyboard behavior, focus indicators, labels, and reduced-motion support when
customizing accessible primitives.

## Deployment

Describe the project's deployment target and release process here.

- Production URL: `<DEPLOYMENT_URL>`
- Hosting platform: `<HOSTING_PLATFORM>`
- Required build command: `npm run build`
- Build output directory: `dist`
- Runtime or proxy configuration: `<RUNTIME_CONFIGURATION>`

## Contributing

1. Create a branch from `<DEFAULT_BRANCH>`.
2. Make the smallest focused change.
3. Run `npm run lint`, `npm test`, and `npm run build`.
4. Open a pull request describing the behavior changed and how it was tested.

## License

<LICENSE_INFORMATION>
