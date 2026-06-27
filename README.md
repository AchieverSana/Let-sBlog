# Sana's Blog

A full-stack MERN blogging platform with JWT + Google authentication, rich-text post authoring, a comment system with likes and permission-aware moderation, role-based dashboards, direct-to-Cloudinary image uploads, and a real CI pipeline — built, debugged, tested, and deployed end-to-end.

**Live app:** [let-s-blog-mu.vercel.app](https://let-s-blog-mu.vercel.app)
**API:** [codewithsana-api.onrender.com](https://codewithsana-api.onrender.com)

![CI](https://github.com/AchieverSana/Let-sBlog/actions/workflows/ci.yml/badge.svg)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Local Setup](#local-setup)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Security Notes](#security-notes)
- [Known Limitations / Next Steps](#known-limitations--next-steps)
- [License](#license)

---

## Features

- **Authentication** — email/password (JWT in httpOnly cookies) and Google OAuth via Firebase
- **Role-based access control** — admin-only post authoring/editing/deleting
- **Rich-text posts** — React Quill editor, output sanitized with DOMPurify before being rendered, to prevent stored-XSS via post content
- **Author attribution** — every post and comment displays who wrote it, resolved server-side via a single batched user lookup (not a per-item query) to avoid N+1 query patterns when listing many posts/comments at once
- **Comments with likes** — like/unlike toggling, with permission checks enforced identically on the client (hidden UI) and server (rejected requests) — a check in the UI alone is not real security
- **Asymmetric comment moderation** — deleting a comment is allowed for its author *or* an admin (standard moderation power); editing is **author-only, even for admins** — a moderator can remove content but can never silently rewrite someone else's words while it stays attributed to them
- **Image uploads** — Cloudinary unsigned upload presets for profile photos and post cover images, with live upload-progress UI, no backend upload endpoint needed
- **Dashboard** — role-aware: admins get site-wide analytics (total/recent users, posts, comments) and full moderation tools; regular users see their own profile and the comments they've personally left
- **Account management** — update username/email/password/profile photo, or permanently delete your account, from the profile page
- **Dark/light theme** — persisted via Redux, applied through Tailwind's class-based dark mode strategy plus Flowbite's own Tailwind plugin (needed so the theme also applies correctly to portaled components like dropdowns/modals)
- **Search & filtering** — free-text search term, sort by latest/oldest, filter by category (JavaScript/React/Next.js/uncategorized), all reflected in the URL query string so results are shareable/bookmarkable, with "Show more" pagination
- **Related content** — each post page shows estimated read time and a list of other recent posts
- **Responsive design** — collapsible mobile navigation, fully usable on small screens, not just desktop
- **Rate limiting** — brute-force protection on auth endpoints (20 req / 15 min / IP)
- **Server-side validation** — every write endpoint validates input via `express-validator`, since client-side validation alone can always be bypassed
- **Crash-safe UI** — a top-level React Error Boundary catches unexpected render errors and shows a recovery screen instead of a blank page
- **Database indexes** on the fields actually queried at scale (`Post.category`, `Post.userId`, `Comment.postId`, `Comment.userId`)
- **Automated tests** — 30 tests across backend and frontend, run automatically on every push via CI
- **Continuous Integration** — GitHub Actions runs the full test suite, lint, and a production build on every push/PR

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) + Redux Toolkit + redux-persist | Fast dev server; predictable global state for auth/theme that survives page reloads |
| Styling | Tailwind CSS + Flowbite React | Utility-first styling with an accessible component library on top, instead of hand-rolling dropdowns/modals |
| Backend | Node.js + Express 5 | Lightweight, unopinionated REST API |
| Database | MongoDB + Mongoose | Schema flexibility for blog content; indexed on the fields actually queried at scale |
| Auth | JWT (httpOnly cookies) + Firebase (Google OAuth) | Cookies avoid storing tokens in `localStorage` (safer against XSS token theft); Firebase offloads OAuth handshake complexity |
| Image hosting | Cloudinary (unsigned upload presets) | Browser uploads directly to Cloudinary — no backend upload endpoint or server-side file handling required |
| Hosting | Vercel (frontend) + Render (backend) | Free-tier friendly, git-based auto-deploy on both |
| Testing | Vitest + React Testing Library | Fast, ESM-native; one mental model for testing both the Express API and the React client |
| CI/CD | GitHub Actions | Runs tests, lint, and build automatically on every push — no manual verification needed before merging |

---

## Architecture

```
client/                   # React (Vite) SPA
  src/
    components/           # Reusable UI (Header, Footer, Comment, PostCard, dashboard widgets...)
      __tests__/             # Component tests (Vitest + React Testing Library)
    pages/                  # Route-level views (Home, PostPage, SignIn, Dashboard, Search...)
    redux/                  # Redux Toolkit slices (user, theme) + persist config
    test/                   # Shared test setup (jest-dom matchers)
    firebase.js              # Firebase app init (Google OAuth only — no Firestore/Storage used)

api/                       # Express REST API
  src/
    controllers/           # Business logic per resource (auth, user, post, comment)
    routes/                 # Route → controller wiring, with validation/auth middleware
    middleware/              # express-validator chains + the shared `validate` handler
    models/                  # Mongoose schemas (User, Post, Comment), with indexes on hot query fields
    utils/                   # verifyToken (JWT auth middleware), errorHandler
  tests/                    # Backend tests (Vitest, mocked models — no live DB needed)
  index.js                   # App entrypoint: CORS, rate limiting, DB connection, route mounting

.github/workflows/ci.yml    # Runs the full test suite + lint + build on every push/PR
```

**Request flow for a protected write** (e.g. creating a comment):

```
rate limiter → CORS → DB-connect middleware → verifyToken (JWT) → input validation → controller → MongoDB
```

Each layer can reject the request with an appropriate status code before it ever reaches the database — invalid, unauthenticated, or abusive requests are rejected as cheaply as possible.

---

## API Reference

Base URL: `https://codewithsana-api.onrender.com/api`

### Auth — `/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | – | Create an account (validated: username, email, password) |
| POST | `/auth/signin` | – | Sign in with email + password, sets JWT cookie |
| POST | `/auth/google` | – | Sign in/up via Google OAuth, sets JWT cookie |

### Users — `/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user/:userId` | – | Get a user's public profile |
| PUT | `/user/update/:userId` | JWT (self) | Update username/email/password/profile picture |
| DELETE | `/user/delete/:userId` | JWT (self or admin) | Delete an account |
| POST | `/user/signout` | – | Clear the auth cookie |
| GET | `/user/getusers` | JWT (admin) | Paginated list of all users |

### Posts — `/post`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/post/getposts` | – | List posts (supports `slug`, `postId`, `category`, `searchTerm`, `limit`, `startIndex` query params); each post is enriched with `author` (username + profile picture) |
| POST | `/post/create` | JWT (admin) | Create a post (validated: title, content) |
| PUT | `/post/updatepost/:postId/:userId` | JWT (admin, owner) | Edit a post |
| DELETE | `/post/deletepost/:postId/:userId` | JWT (admin, owner) | Delete a post |

### Comments — `/comment`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/comment/create` | JWT | Create a comment (validated: content length, postId, userId) |
| GET | `/comment/getPostComments/:postId` | – | All comments on a given post |
| PUT | `/comment/likeComment/:commentId` | JWT | Toggle a like on a comment |
| PUT | `/comment/editComment/:commentId` | JWT (author only) | Edit a comment's content |
| DELETE | `/comment/deleteComment/:commentId` | JWT (author or admin) | Delete a comment |
| GET | `/comment/getcomments` | JWT | Admins get every comment site-wide; regular users get only the comments **they personally left** |

---

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Firebase project with Google sign-in enabled (for OAuth)
- A Cloudinary account with an **unsigned** upload preset (for image uploads)

### 1. Clone and install
```bash
git clone https://github.com/AchieverSana/Let-sBlog.git
cd Let-sBlog

cd api && npm install
cd ../client && npm install
```

### 2. Environment variables

**`api/.env`**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
NODE_ENV=development
```

**`client/.env`**
```
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
```
> All Firebase/Cloudinary variables are optional — if omitted, the app falls back to this project's own values, but you'll be uploading images/auth through *this* project's accounts. Set your own to use your own.

### 3. Run
```bash
# terminal 1
cd api && npm start

# terminal 2
cd client && npm run dev
```

The client dev server runs at `http://localhost:5173` and proxies `/api` requests to the backend.

---

## Testing

```bash
cd api && npm test       # 19 tests: validators, JWT middleware, comment-like toggle logic, error handling
cd client && npm test     # 11 tests: PostCard rendering, Footer links, ErrorBoundary, comment permission rules
```

Backend tests mock Mongoose models directly — no live database required — so they run fast and deterministically. Frontend tests use React Testing Library with a minimal mock Redux store. A few tests are specifically **regression guards** for real bugs that happened during development:
- `Footer.test.jsx` checks the GitHub link spelling, after a real typo (`AcheiverSana` vs `AchieverSana`) once broke it in production
- `Comment.test.jsx` locks in the author-only-edit / author-or-admin-delete permission split, so it can't silently regress
- `ErrorBoundary.test.jsx` proves the fallback UI actually renders on a real component crash, not just in theory

---

## CI/CD

Every push and pull request to `main` automatically runs via GitHub Actions (`.github/workflows/ci.yml`):
- Installs dependencies for both `api/` and `client/`
- Runs the full test suite on both
- Lints the client (zero errors/warnings allowed — `--max-warnings 0`)
- Builds the client for production

This catches broken code before it's merged, not after it's deployed.

---

## Security Notes

- Post/comment content is rendered with `dangerouslySetInnerHTML` (required for the rich-text editor's HTML output) but is **sanitized through DOMPurify first**, stripping any executable script content.
- JWTs live in `httpOnly` cookies, not `localStorage` — `sameSite: 'none'; secure: true` in production for cross-origin auth between Vercel and Render.
- `/api/auth/*` is rate-limited to 20 requests per IP per 15 minutes to slow down credential-stuffing/brute-force attempts.
- Every write endpoint validates input server-side via `express-validator` — client-side checks are UX, not security.
- Comment **editing** is author-only (enforced server-side, not just hidden in the UI); admins keep delete power for moderation, but can't rewrite someone else's words under their name.
- Firebase and Cloudinary credentials are read from environment variables (with safe fallbacks), not hardcoded in source — so the codebase can be safely shared without exposing which exact accounts back it.

---

## Known Limitations / Next Steps

- Only admin accounts can author posts — intentional, to avoid needing a moderation queue. A `pending → approved` post status would be the natural next step to allow contributor submissions without losing editorial control.
- The rate limiter uses in-memory storage, which only works correctly on a single server instance. A Redis-backed store (e.g. `rate-limit-redis`) would be needed before horizontally scaling the API across multiple instances.
- Cloudinary uploads use an unsigned preset for simplicity; a signed-upload flow (via a small backend signing endpoint) would give stricter control in a production-grade app.
- The frontend ships as a single ~925KB JS bundle; route-based code-splitting (`React.lazy` + `Suspense`) would be the next step before this becomes a real problem at scale.
- Render's free tier spins down on inactivity, so the first request after idle time can take 30-50s — a known tradeoff of free hosting, not a code issue.

---

## License

MIT — free to use, modify, and learn from.
