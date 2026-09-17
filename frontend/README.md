# Tech Tians Academy - Frontend

Modern frontend application for **Tech Tians Academy**, built with [Next.js 14](https://nextjs.org/) (App Router), TypeScript (Strict Mode), and Tailwind CSS.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Utility Libraries**: `clsx`, `tailwind-merge`
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Code Quality**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) with `prettier-plugin-tailwindcss`

---

## 📁 Project Structure

```text
frontend/
├── app/                  # Next.js App Router routes & layouts
│   ├── (auth)/           # Route group for login, signup, OTP
│   ├── (student)/        # Route group for authenticated student pages
│   ├── layout.tsx        # Root HTML layout with metadata
│   ├── page.tsx          # Landing / home page
│   └── globals.css       # Tailwind directives & CSS variables
├── components/
│   ├── ui/               # Reusable UI primitives (buttons, inputs, dialogs)
│   ├── layout/           # Shared layout components (navbar, sidebar, footer)
│   └── shared/           # Composite reusable components (cards, tables)
├── lib/                  # Core utilities, API client, and constants
│   ├── api.ts            # Typed fetch wrapper with Bearer token & ApiError
│   ├── constants.ts      # App constants (APP_NAME, ROUTES)
│   └── utils.ts          # Helper utilities (cn class merge)
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── types/                # Shared TypeScript types & interfaces
├── public/               # Static public assets (images, icons)
├── .env.example          # Environment variable template
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration (with Tailwind class sorting)
├── package.json          # Dependencies and scripts
├── postcss.config.mjs    # PostCSS plugins
├── tailwind.config.ts    # Tailwind theme configuration
└── tsconfig.json         # TypeScript compiler configuration with @/* alias
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v18.17+` or `v20+` (Recommended: `v20.x` or `v24.x`)
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`

### 2. Environment Setup

From the `frontend` directory, create a local environment file based on the template:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts local Next.js dev server on port 3000 |
| **Build** | `npm run build` | Compiles production build |
| **Start** | `npm run start` | Runs the production build server |
| **Lint** | `npm run lint` | Runs ESLint analysis |
| **Format** | `npm run format` | Formats all files with Prettier & sorts Tailwind classes |
| **Format Check** | `npm run format:check` | Verifies formatting without writing changes |
| **Type Check** | `npm run type-check` | Runs TypeScript compiler check (`tsc --noEmit`) |

---

## 💡 Usage Examples

### Tailwind Class Merging (`lib/utils.ts`)

```tsx
import { cn } from "@/lib/utils";

export function CustomButton({ className, disabled }: { className?: string; disabled?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 font-medium bg-blue-600 text-white hover:bg-blue-500",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      Click Me
    </button>
  );
}
```

### Typed API Client (`lib/api.ts`)

```tsx
import { api, ApiError } from "@/lib/api";
import type { UserProfile } from "@/types";

try {
  const profile = await api.get<UserProfile>("/users/me");
  console.log("Logged in user:", profile.name);
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API error:", error.status, error.data);
  }
}
```
