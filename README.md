# Console Frontend (`console-frontend`)

This project provides the frontend UI for the Console policy management application.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- The `console-backend` project running locally (see its README for setup instructions).

## Getting Started

1.  **Clone the Repository:**

    ```bash
    # If you haven't already cloned the main project
    git clone <repository-url>
    cd <repository-folder>/console-frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

3.  **Environment Variables:**
    - This project primarily relies on the backend API running at `http://localhost:3000/api` (as defined in `src/lib/api.ts`). If your backend runs on a different port or URL, you will need to update the `API_BASE_URL` constant in `src/lib/api.ts`.
    - No `.env` file is strictly required by default for the frontend itself, but specific integrations or configurations might introduce the need for one later.

## Running the Development Server

To start the frontend development server:

```bash
npm run dev
```

This command starts the Vite development server, typically available at `http://localhost:5173` (Vite usually picks the next available port if 5173 is taken). The server supports Hot Module Replacement (HMR).

## Available Scripts

In the `package.json`, you will find several scripts:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production into the `dist` directory.
- `npm run preview`: Serves the production build locally for testing.
- `npm run lint`: Runs the ESLint checker.

## Project Structure

- `public/`: Static assets.
- `src/`: Contains the application source code.
  - `assets/`: Static assets imported into the app (e.g., images).
  - `components/`: Reusable UI components.
    - `common/`: General-purpose components (e.g., `UserSelectorDropdown`).
    - `policy/`: Components specific to policy forms and display.
    - `ui/`: Components from `shadcn/ui` library.
  - `context/`: React context providers (e.g., `UserContext`).
  - `hooks/`: Custom React hooks (e.g., `use-toast`).
  - `lib/`: Utility functions and API interaction logic (`api.ts`, `utils.ts`).
  - `pages/`: Top-level page components corresponding to routes.
  - `types/`: TypeScript type definitions.
  - `App.tsx`: Main application component, defines routing structure.
  - `main.tsx`: Application entry point, renders the root component.
  - `index.css`: Global styles and Tailwind directives.
- `index.html`: Main HTML entry point.
- `vite.config.ts`: Vite build configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configurations.
- `components.json`: Configuration for `shadcn/ui`.
- `package.json`: Project dependencies and scripts.

## Features

- List policies based on the selected user's visibility.
- Default view shows policies visible to the seeded Admin user.
- Create new access policies.
- View and Edit existing policy details.
- "Act as" dropdown to simulate viewing policies as different users.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
