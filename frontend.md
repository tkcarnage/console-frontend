# Console Frontend Documentation (`console-frontend`)

This document provides an overview of the `console-frontend` application architecture, state management, key features, and API interactions.

## Overview

The frontend is a single-page application (SPA) built with React and TypeScript, using Vite for development and bundling. It provides a user interface for viewing, creating, and editing access policies managed by the `console-backend`.

## Core Technologies

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Routing:** React Router

(See `README.md` for setup and running instructions).

## Architecture & Structure (`src/`)

- **`main.tsx`**: Application entry point.
- **`App.tsx`**: Root component, sets up routing and main layout (header, footer).
- **`pages/`**: Contains top-level components for each route/view (e.g., `PolicyListPage`, `PolicyDetailPage`).
- **`components/`**: Reusable UI pieces.
  - `common/`: General components like the `UserSelectorDropdown`.
  - `policy/`: Components specifically related to displaying or editing policies (e.g., `PolicyForm`, `PolicyCard`, `AppSelector`).
  - `ui/`: Base components provided by the `shadcn/ui` library.
- **`context/`**: React Context for global state management.
  - `UserContext.tsx`: Manages the list of all users and the currently selected "Act as" user (`selectedUserId`). Fetches users on load and defaults to the Admin user.
- **`hooks/`**: Custom React hooks (e.g., `use-toast` for notifications).
- **`lib/`**: Core logic, utilities, and API communication.
  - `api.ts`: Functions for interacting with the backend API.
  - `utils.ts`: General utility functions (like `cn` for class names).
- **`types/`**: Shared TypeScript type definitions, especially for API data structures (`policy.types.ts`).
- **`assets/`**: Static assets like images.
- **`index.css`**: Global styles, Tailwind CSS directives.

## State Management

- **Global State (`UserContext`)**: The primary global state managed via React Context is the list of available users (`users`) and the ID of the user currently being impersonated (`selectedUserId`). The `UserSelectorDropdown` component reads and updates this context.
- **Local State (`useState`)**: Individual pages and components manage their own local state for things like loading indicators, error messages, form data, and UI toggles (e.g., edit mode in `PolicyDetailPage`).

## Routing

Client-side routing is handled by `react-router-dom`. The main routes are defined in `App.tsx`:

- `/`: Maps to `PolicyListPage`.
- `/policies/new`: Maps to `PolicyCreatePage`.
- `/policies/:id`: Maps to `PolicyDetailPage`.

## Key Features & Workflow

1.  **Policy List (`PolicyListPage`)**

    - Fetches the list of policies relevant to the `selectedUserId` (from `UserContext`) via `fetchPolicies(selectedUserId)`.
    - Displays policies using `PolicyCard` components.
    - Allows deleting policies (triggers `deletePolicy(id)`).
    - Provides a button to navigate to the create page.
    - Includes the `UserSelectorDropdown` which, upon selection, updates the `selectedUserId` in `UserContext`, triggering a re-fetch of policies.
    - Defaults to showing the Admin user's view (all policies).

2.  **Create Policy (`PolicyCreatePage`)**

    - Renders the `PolicyForm` component for user input.
    - Fetches the list of available apps (`fetchApps`) to populate the app selector within the form.
    - On form submission (`handleSubmit`), it makes a direct `fetch` call to the backend's `POST /api/policies` endpoint.
    - Shows success/error toasts and navigates back to the policy list on success.

3.  **View/Edit Policy (`PolicyDetailPage`)**
    - Fetches the specific policy data using `fetchPolicy(id)` based on the route parameter.
    - Fetches the list of available apps (`fetchApps`).
    - Initially renders the `PolicyForm` in `readOnly` mode.
    - An "Edit Policy" button toggles the `isEditing` state, making the form editable.
    - When the form is submitted in edit mode (`handleFormSubmit`), it calls `updatePolicy(id, data)` to save changes.
    - Shows success/error toasts.

## Backend API Interactions (`src/lib/api.ts`)

The frontend interacts with the `console-backend` through functions defined in `src/lib/api.ts`. These functions map to the following backend endpoints:

- `fetchPolicies(userId?)`: Hits `GET /api/policies` (potentially with `?userId=...`)
- `fetchPolicy(id)`: Hits `GET /api/policies/:id`
- `createPolicy(data)`: Hits `POST /api/policies` (used by `PolicyCreatePage`).
- `updatePolicy(id, data)`: Hits `PUT /api/policies/:id`
- `deletePolicy(id)`: Hits `DELETE /api/policies/:id`
- `fetchUsers()`: Hits `GET /api/users`
- `fetchGroups()`: Hits `GET /api/groups`
- `fetchApps()`: Hits `GET /api/apps`
- `fetchApp(id)`: Hits `GET /api/apps/:id`
