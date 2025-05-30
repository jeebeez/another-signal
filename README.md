# Another Signal

A Next.js application for account management with powerful features like filtering, sorting, and searchable data tables.

## Features

- Interactive account management dashboard
- Searchable and filterable data tables
- Magic columns functionality
- Account detail pages
- Modern UI with Tailwind CSS and Radix UI components
- React Query for efficient data fetching

## Tech Stack

- [Next.js](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) components
- [TanStack React Query](https://tanstack.com/query/latest) for data fetching
- [TanStack React Table](https://tanstack.com/table/latest) for table functionality
- TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
- `src/lib` - Utility functions and types
- `src/api` - API client functions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Setup

To set up the project for development:

1. Clone the repository
2. Install dependencies using `npm install`
3. Copy `.env.example` to `.env.local` and configure environment variables
4. Run the development server with `npm run dev`

## Decisions

Several key technical decisions were made during the development of this project:

- **React Query**: Chosen for efficient data fetching, caching capabilities, and useful query and mutation hooks that simplify API state management.

- **React Table**: Selected for handling complex table functionality including sorting, filtering, and pagination with a declarative API.

- **Shadcn UI**: Implemented for providing styled, accessible components that maintain a consistent design language throughout the application.

- **Hook-based approach**: Table functionality was implemented using hooks for better testability and separation of concerns.

## Retrospective

Overall a fun project. In retrospect, I would probably want to have spent some more time cleaning up the backend but I prioritized the frontend.
