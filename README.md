# The Breezy Haven

**[English](README.md) · [Tiếng Việt](README.vi.md)**

A full-stack cabin reservation and management platform built with
Next.js App Router and TypeScript.

The Breezy Haven provides two distinct experiences: a guest-facing
booking application for browsing cabins and managing reservations, and
an internal staff application for managing cabins, bookings, guests, and
daily operations.

**Live Demo:** <https://breezy.tridecent.me/>

## Demo Accounts

Use either account below to try the application. The guest account provides access to the guest-facing booking experience, while the staff account is for the staff management interface.

| Role | Email | Password |
| --- | --- | --- |
| Guest | `guest-test@gmail.com` | `Test123@` |
| Staff | `staff-test@gmail.com` | `Test123@` |

These accounts are for demonstration purposes only. Do not reuse these credentials for any other service.

------------------------------------------------------------------------

## Overview

The project was built to explore how a modern full-stack application can
be structured beyond simply putting UI components and API calls
together.

The main focus was on separating application responsibilities, handling
authentication and authorization, validating data at the application
boundary, and building reusable feature-oriented modules.

The application is divided into two main areas:

- **Guest application** --- browse cabins, view cabin details, create
    reservations, and manage an account.
- **Staff application** --- manage cabins and bookings, handle
    check-in/check-out operations, view business metrics, and manage
    staff-related data.

------------------------------------------------------------------------

## Key Features

### Guest

- Browse available cabins
- Search and filter cabins
- View detailed cabin information
- Create reservations
- View reservation history
- Modify reservations
- Cancel reservations
- Manage personal profile
- Guest authentication
- Google authentication
- Responsive interface
- Loading, error, and not-found states

### Staff

- Staff authentication and protected routes
- Dashboard with booking and revenue statistics
- Sales and stay-duration charts
- Today's check-in/check-out activity
- Booking management
- Create, update, and delete bookings
- Check-in and check-out operations
- Cabin management
- Create, update, duplicate, and delete cabins
- Staff account creation
- Staff profile management
- Password updates
- Application settings
- Data tables with sorting/filtering capabilities
- CSV/data download functionality

------------------------------------------------------------------------

## Engineering Highlights

### Feature-oriented project structure

The application is organized around features rather than placing all
components, actions, and logic into global folders.

For example:

``` text
features/
├── auth/
├── guest/
│   ├── account/
│   ├── cabins/
│   └── login/
└── staff/
    ├── bookings/
    ├── cabins/
    ├── dashboard/
    ├── profile/
    ├── settings/
    └── user/
```

This keeps feature-specific UI, actions, schemas, and supporting logic
close to the feature that uses them.

Shared functionality is kept separately under `shared/`, while
application and data-access logic are separated into `services/` and
`repositories/`.

------------------------------------------------------------------------

### Layered application logic

Business operations are separated from UI and data-access concerns.

``` text
UI / Server Actions
        ↓
    Services
        ↓
   Repositories
        ↓
     Supabase
```

For example, booking-related operations are handled by `BookingService`,
while data access is abstracted through repositories.

This makes the application logic easier to reason about and reduces the
amount of business logic directly embedded inside React components.

------------------------------------------------------------------------

### Authentication and authorization

The application implements authentication for both guests and staff.

The authentication layer includes:

- Credentials-based authentication
- Google authentication
- JWT-based session handling
- Password hashing with bcrypt
- RSA-based JWT protection
- Protected guest and staff routes
- Separate authentication flows for guests and staff

Authentication-related functionality is isolated under:

``` text
features/auth/
```

with additional session and authentication endpoints under:

``` text
app/api/auth/
app/api/session/
```

------------------------------------------------------------------------

### Server-side validation

Application input is validated using Zod schemas.

Domain-related schemas are organized under:

``` text
shared/schemas/
```

Examples include:

``` text
Booking.ts
Cabin.ts
Guest.ts
Signup.ts
Staff.ts
Setting.ts
```

This provides a consistent validation boundary for operations such as
account creation, profile updates, cabin management, and booking
operations.

------------------------------------------------------------------------

### Guest and staff separation

The application treats guests and staff as different application
contexts rather than exposing the same interface to every authenticated
user.

The routing structure reflects this separation:

``` text
app/
├── guest/
└── staff/
```

Guests interact with booking-related functionality, while staff have
access to operational functionality such as cabin management, booking
administration, dashboards, and check-in/check-out workflows.

------------------------------------------------------------------------

### State management

Redux Toolkit is used for application state that benefits from
centralized management.

The project also uses RTK Query for API-oriented data fetching and
caching.

Relevant state modules include:

``` text
shared/store/
├── auth-api.ts
├── cabin-form-slice.ts
├── ui-slice.ts
└── store.ts
```

The project also uses local React state and other appropriate mechanisms
where global state is unnecessary.

------------------------------------------------------------------------

### Reusable UI and shared infrastructure

Common UI primitives and application components are centralized under:

``` text
shared/components/
```

This includes reusable components for:

- Forms
- Tables
- Dialogs and modals
- Navigation
- Buttons
- Inputs
- Selects
- Calendars
- Notifications
- Loading states
- Error states
- Data visualization
- Layouts

The application also uses Radix UI primitives and Tailwind CSS to build
the interface.

------------------------------------------------------------------------

## Architecture

The high-level source structure is:

``` text
src/
├── app/
│   ├── api/
│   ├── guest/
│   ├── staff/
│   └── ...
│
├── features/
│   ├── auth/
│   ├── guest/
│   └── staff/
│
├── lib/
│
├── repositories/
│
├── services/
│
├── shared/
│   ├── actions/
│   ├── animations/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── providers/
│   ├── schemas/
│   ├── store/
│   ├── types/
│   └── utils/
│
└── styles/
```

### `app/`

Contains Next.js App Router routes, layouts, loading states, error
boundaries, not-found pages, and API route handlers.

### `features/`

Contains feature-specific application code.

Each feature can contain its own:

- Components
- Server actions
- Schemas
- Context
- Supporting UI
- Feature-specific logic

### `services/`

Contains application-level operations and business logic.

Examples:

``` text
BookingService
CabinService
GuestService
StaffService
SettingService
FileService
```

### `repositories/`

Contains data-access abstractions and infrastructure-specific
persistence logic.

Examples include repositories for files and refresh tokens.

### `shared/`

Contains functionality shared across multiple features, including UI
components, schemas, state management, hooks, animations, utilities, and
providers.

------------------------------------------------------------------------

## Technology Stack

### Core

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Frontend

- React
- Redux Toolkit
- RTK Query
- Framer Motion
- Radix UI
- React Hook Form
- Zod
- Sonner

### Backend & Data

- Next.js Route Handlers
- Supabase
- PostgreSQL
- Custom service layer
- Repository abstractions

### Authentication & Security

- NextAuth
- JWT
- `jose`
- bcrypt
- RSA-based JWT protection
- Zod validation

### Data Visualization & UI

- Recharts
- TanStack Table
- Radix UI
- Tailwind CSS

### Development

- ESLint
- Prettier
- TypeScript
- pnpm
- Next.js Bundle Analyzer

------------------------------------------------------------------------

## Project Structure in More Detail

A simplified view of the application structure:

``` text
src/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── cabins/
│   │   ├── downloads/
│   │   └── session/
│   │
│   ├── guest/
│   │   ├── account/
│   │   ├── cabins/
│   │   ├── login/
│   │   └── setup-new-guest/
│   │
│   └── staff/
│       ├── bookings/
│       ├── cabins/
│       ├── dashboard/
│       ├── profile/
│       ├── settings/
│       └── user/
│
├── features/
│   ├── auth/
│   ├── guest/
│   │   ├── account/
│   │   ├── cabins/
│   │   └── login/
│   │
│   └── staff/
│       ├── bookings/
│       ├── cabins/
│       ├── dashboard/
│       ├── profile/
│       ├── settings/
│       └── user/
│
├── repositories/
│   ├── FileRepository.ts
│   ├── RefreshTokenRepository.ts
│   └── Repository.ts
│
├── services/
│   ├── BookingService.ts
│   ├── CabinService.ts
│   ├── FileService.ts
│   ├── GuestService.ts
│   ├── SettingService.ts
│   └── StaffService.ts
│
└── shared/
    ├── components/
    ├── hooks/
    ├── providers/
    ├── schemas/
    ├── store/
    ├── types/
    └── utils/
```

------------------------------------------------------------------------

## Booking Workflow

The reservation workflow is separated between guest-facing and
staff-facing operations.

A typical guest flow is:

``` text
Browse Cabins
      ↓
View Cabin
      ↓
Select Dates
      ↓
Enter Reservation Details
      ↓
Validate Input
      ↓
Create Booking
      ↓
View Reservation
```

Staff can subsequently manage the reservation through the internal
application:

``` text
Booking List
      ↓
Booking Details
      ↓
Check-in
      ↓
Guest Stay
      ↓
Check-out
```

This separation allows the guest interface to focus on the reservation
experience while the staff interface focuses on operational workflows.

------------------------------------------------------------------------

## Staff Dashboard

The staff dashboard provides an overview of the application's booking
activity.

It includes:

- Booking statistics
- Revenue-related statistics
- Sales chart
- Stay-duration analysis
- Today's check-in/check-out activity
- Refreshable data

The dashboard components are organized under:

``` text
features/staff/dashboard/
```

------------------------------------------------------------------------

## API

The application exposes several Next.js Route Handlers for server-side
operations.

``` text
/api/auth
/api/cabins/[cabinId]
/api/downloads/bookings
/api/downloads/cabins
/api/session/guest
/api/session/staff
```

The API layer is intentionally kept separate from application services
so that request handling and business operations are not tightly
coupled.

------------------------------------------------------------------------

## Responsive UI & UX

The application includes responsive layouts for both guest and staff
interfaces.

Additional UX considerations include:

- Loading states
- Skeleton components
- Error boundaries
- Not-found pages
- Animated transitions
- Toast notifications
- Form feedback
- Responsive navigation
- Dark mode
- Data-table interactions

Framer Motion is used selectively for interface transitions and visual
feedback rather than as a replacement for standard CSS interactions.

------------------------------------------------------------------------

## Development Principles

Several engineering principles guided the implementation.

### SOLID

The codebase aims to keep responsibilities separated and dependencies
manageable, particularly around services, repositories, authentication,
and feature modules.

### Immutability

Immutable data handling is preferred where practical to make state
transitions and application behavior easier to reason about.

### Composition over inheritance

The application favors composing smaller components and services instead
of building deep inheritance hierarchies.

### Separation of concerns

UI rendering, application logic, data access, validation, and shared
infrastructure are kept in separate layers where appropriate.

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- pnpm
- A Supabase project

### Installation

Clone the repository:

``` bash
git clone https://github.com/TriDecent/breezy-haven.git

cd breezy-haven
```

Install dependencies:

``` bash
pnpm install
```

### Environment Variables

Create a `.env.local` file and configure the required environment
variables for the application.

The exact variables depend on the Supabase and authentication
configuration used by the project.

For example:

``` env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Do not commit secrets or production credentials to the repository.

### Run the development server

``` bash
pnpm dev
```

The application will be available at:

``` text
http://localhost:3000
```

### Production build

``` bash
pnpm build
pnpm start
```

------------------------------------------------------------------------

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm prod` | Build and start the production application |
| `pnpm analyze` | Analyze the Next.js production bundle |

------------------------------------------------------------------------

## Project Scope

The Breezy Haven is a portfolio project created to demonstrate practical
full-stack development and software engineering skills.

It is not intended to represent a production hotel management system
with the full set of requirements that would normally be expected from a
commercial hospitality platform.

The project focuses primarily on:

- Full-stack application development
- Authentication and authorization
- Reservation workflows
- Application architecture
- Data management
- Form validation
- State management
- Reusable UI
- Maintainable TypeScript code

------------------------------------------------------------------------

## License

Distributed under the MIT License.
