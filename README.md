# ART HAMPER

Quick scaffold for a collaborative workspace where multiple users join a workspace to collaborate on physical product orders.

Setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client and apply schema (SQLite)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If you prefer to push schema without migrations (dev):

```bash
npx prisma db push
```

3. Run dev server

```bash
npm run dev
```

Files added

- package.json — project scripts and deps
- tailwind.config.js, postcss.config.js, styles/globals.css
- pages/* — Next pages and API routes
- lib/prisma.js — Prisma client singleton
- prisma/schema.prisma — DB schema (Workspace, Order, Collaborator)

Next steps I can run for you (ask me):

- run `npm install` and `npx prisma migrate dev --name init` here
- wire authentication (NextAuth) and WebSocket collaboration
- add UI components and forms to create orders / invite collaborators
