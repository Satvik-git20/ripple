# ripple.

A small, thoughtful social space. Share what you're making, thinking, or noticing; follow people you actually chose. No algorithm, no infinite growth mechanics — just a clean feed, profiles, posts, comments, likes, and follows.

Built with **Express**, **SQLite**, and **vanilla HTML/CSS/JavaScript**.

![ripple](https://img.shields.io/badge/stack-Express%20%2B%20SQLite%20%2B%20vanilla%20JS-2A8A73)

## Quick start

Requirements: **Node.js 22.5+** (uses the built-in `node:sqlite` module; recommended Node 24). No native build tools or database server required.

```bash
npm install
npm start
```

Open <http://localhost:3000>.

The demo data is created automatically on first boot. To sign in instantly, click **“Step into Maya’s feed”** on the welcome screen, or use:

| Username | Password   |
| -------- | ---------- |
| `maya`   | `demo1234` |

All seeded accounts share the same demo password (`demo1234`): `maya`, `theo`, `june`, `sam`, `lina`, `amara`, `ben`, `noah`, `priya`.

### Other commands

```bash
npm run dev    # start with node --watch
npm run seed   # wipe and reseed the demo database
```

Environment variables:

- `PORT` — HTTP port (default `3000`)
- `DB_PATH` — SQLite file location (default `data/ripple.db`)
- `COOKIE_SECURE=1` — mark the session cookie `Secure` when serving over HTTPS

## Features

- **Accounts** — sign up, sign in, sign out. Passwords hashed with scrypt; sessions stored in SQLite and sent as `HttpOnly`, `SameSite=Lax` cookies.
- **Profiles** — display name, bio, location, website, avatar color, join date, follower/following counts, and post/liked tabs. Edit your own profile in a dialog.
- **Posts** — compose up to 280 characters, delete your own posts, and browse a feed of everyone or just people you follow.
- **Comments** — open a post's comment thread, add comments, and delete your own.
- **Likes** — like/unlike posts with live counts and a “Liked” profile tab.
- **Follows** — follow/unfollow from profiles, suggestions, or follower lists; browse follower and following lists.
- **Explore & search** — discover people and posts, with a search page for users and content.
- **Responsive UI** — three-column desktop layout, two-column tablet layout, and a mobile layout with bottom navigation.
- **Details** — loading skeletons, empty states, toasts, confirmation dialogs, keyboard-friendly dialogs, visible focus states, and escaped user content.

## Tech stack

| Layer    | Choice |
| -------- | ------ |
| Server   | Express 4 |
| Database | SQLite via Node's built-in `node:sqlite` (`DatabaseSync`) |
| Auth     | `scrypt` password hashing + SQLite session tokens |
| Client   | Vanilla JavaScript, hash routing, hand-written CSS |
| Fonts    | Bricolage Grotesque + DM Sans |

No frontend framework, bundler, ORM, or native npm dependencies.

## Project structure

```
saminternship/
├── server.js          # Express app, auth, REST API, static serving
├── seed.js            # Demo users, posts, comments, likes, follows
├── lib/
│   ├── db.js          # SQLite connection, schema, indexes
│   └── auth.js        # scrypt hashing, session tokens/cookies, validation
├── public/
│   ├── index.html     # App shell, fonts, dialog/toast roots
│   ├── styles.css     # Design system, components, responsive layout
│   └── app.js         # Client state, API calls, views, event handling
├── data/              # SQLite database (created at runtime, gitignored)
└── package.json
```

## API

All routes except health, register, and login require a session cookie.

| Method | Route | Purpose |
| ------ | ----- | ------- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/me` | Current user |
| `PATCH` | `/api/me` | Update profile |
| `GET` | `/api/posts?scope=all\|following` | Feed |
| `POST` | `/api/posts` | Create post |
| `GET` | `/api/posts/:id` | Single post |
| `DELETE` | `/api/posts/:id` | Delete own post |
| `POST` | `/api/posts/:id/like` | Toggle like |
| `GET` | `/api/posts/:id/comments` | List comments |
| `POST` | `/api/posts/:id/comments` | Add comment |
| `DELETE` | `/api/comments/:id` | Delete own comment |
| `GET` | `/api/users/suggestions` | People to follow |
| `GET` | `/api/users/:username` | Profile + posts |
| `GET` | `/api/users/:username/followers` | Follower list |
| `GET` | `/api/users/:username/following` | Following list |
| `POST` | `/api/users/:username/follow` | Toggle follow |
| `GET` | `/api/search?q=` | Search users and posts |

## Database

Six tables with foreign keys and cascade deletes:

- `users` — account, profile fields, avatar color
- `sessions` — hashed session tokens with expiry
- `posts` — author, content, timestamp
- `comments` — post, author, content, timestamp
- `likes` — `(user_id, post_id)` primary key
- `follows` — `(follower_id, following_id)` primary key, with a self-follow check constraint

Indexes cover feed ordering, comments per post, likes per post, follower lookups, and session expiry.

## Notes

- `data/` is gitignored; deleting it resets the app, and the next boot reseeds the demo data.
- Queries use parameterized statements throughout; user-generated content is escaped before rendering.
- The app deliberately avoids recommendation logic: the main feed is chronological, and the “Following” feed only includes people you follow.
