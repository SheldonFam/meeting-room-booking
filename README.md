# Meeting Room Booking

A web application for managing and booking meeting rooms. Users can browse available rooms, make reservations, and manage their bookings. Admins have access to a dashboard for managing rooms and all bookings.

## Features

- Browse and search meeting rooms
- Book rooms with date/time selection
- View bookings in calendar view
- Manage personal bookings
- Admin dashboard for room & booking management
- User authentication (Admin/User roles)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Headless UI
- **State Management:** React Query (TanStack Query)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (jose)
- **Forms:** React Hook Form + Zod validation

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin pages (dashboard, rooms, bookings)
│   ├── calendar/     # Calendar view
│   ├── my-bookings/  # User's bookings
│   ├── rooms/        # Room listing & details
│   └── login/        # Authentication
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── context/          # React context providers
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended)

### Installation

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database connection string.

3. Set up the database:

   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

## Credential

employee@example.com
employee123

admin@example.com
admin123
