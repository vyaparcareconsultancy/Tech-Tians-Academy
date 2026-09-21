# Tech Tians Academy — Admin & Teacher Panel (M3)

Production-ready enterprise administration and faculty management portal for **Tech Tians Academy**, built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Firebase.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (M1 Design System)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Networking**: Axios (with auto Bearer injection & 401 token refresh queue)
- **Notifications & Auth**: Firebase Auth + Firebase Cloud Messaging (FCM)
- **Target Deployment**: Vercel

---

## 🎨 Design System Tokens

Synchronized with M1 Student Web Portal:
- **Navy**: `#0A1628` (Primary background, dark mode cards)
- **Blue**: `#2563EB` (Primary buttons, active states, branding)
- **Cyan**: `#06B6D4` (Highlights, secondary badges, accents)
- **Slate**: Grayscale scale (`50` to `950`)
- **Typography**: Inter via Google Fonts (`var(--font-inter)`)

---

## 📂 Project Architecture

```
admin/
├── app/
│   ├── layout.tsx                # Root layout with Inter, AuthProvider & ToastProvider
│   ├── globals.css               # Theme tokens & CSS variables
│   ├── page.tsx                  # Root redirection
│   ├── login/
│   │   └── page.tsx              # Role-aware login with Zod validation & Demo quick-switch
│   ├── (admin)/                  # Route group with Admin navigation shell
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx    # Metrics, live feeds, quick action modals
│   │   ├── students/page.tsx     # Student roster & progress
│   │   ├── teachers/page.tsx     # Faculty management
│   │   ├── courses/page.tsx      # Curriculum catalog & pricing
│   │   ├── batches/page.tsx      # Live cohorts & schedules
│   │   ├── tests/page.tsx        # Assessments & grading
│   │   ├── orders/page.tsx       # Transactions & invoices
│   │   ├── reports/page.tsx      # BI analytics & completion rates
│   │   └── settings/page.tsx     # Organization config
│   └── (teacher)/                # Route group with Faculty navigation shell
│       ├── layout.tsx
│       ├── my-batches/page.tsx   # Assigned cohorts & live classroom
│       ├── content/page.tsx      # Lecture materials & code repos
│       └── doubts/page.tsx       # Student inquiries with live resolution modal
├── components/
│   ├── ui/                       # Button, Input, Card, Modal, Table, Badge, Toast, Skeleton
│   └── layout/                   # Sidebar (collapsible + mobile), TopBar, Breadcrumbs, AppShell
├── hooks/
│   ├── useAuth.tsx               # Auth state & cookie synchronization
│   └── useNotifications.ts       # FCM push permissions & foreground toast listener
├── lib/
│   ├── api-client.ts             # Axios with Bearer token & refresh interceptor
│   ├── firebase.ts               # Firebase App, Auth & FCM initialization
│   └── utils.ts                  # Tailwind merge & currency formatters
├── services/
│   ├── auth.service.ts           # Login, logout, refresh (with Mock mode)
│   ├── dashboard.service.ts      # Admin & Teacher stats
│   ├── notification.service.ts   # FCM device token registration
│   └── mock-data.ts              # Deterministic mock datasets
├── types/                        # Auth, Dashboard, Navigation & Common types
├── middleware.ts                 # Next.js protected route middleware
└── public/
    └── firebase-messaging-sw.js  # FCM background push service worker
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm**: v9+

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | NestJS REST API Base URL (M2) | `http://localhost:4000/api/v1` |
| `NEXT_PUBLIC_APP_ENV` | Environment identifier | `development` |
| `NEXT_PUBLIC_USE_MOCK` | Enable standalone mock service layer | `true` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Configured |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Configured |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Configured |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Configured |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Messaging Sender ID | Configured |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Configured |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | FCM Web Push Certificate Key | Configured |

### 3. Install & Run Locally

```bash
# From admin/ directory
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🔑 Demo Credentials (Mock Mode)

When `NEXT_PUBLIC_USE_MOCK=true`, use the 1-click test credentials on the login screen or:

- **Admin Portal**:
  - Email: `admin@techtians.com`
  - Password: `password123`
  - Access: All 9 administrative modules + business intelligence

- **Teacher Portal**:
  - Email: `teacher@techtians.com`
  - Password: `password123`
  - Access: Faculty dashboard, cohorts, doubt resolution, content uploads

---

## 🔒 Security & Route Protection

1. **Middleware Guard (`middleware.ts`)**:
   - Inspects `techtians_session` and `techtians_role` cookies.
   - Redirects unauthenticated traffic to `/login?from=<url>`.
   - Prevents `student` role accounts from accessing admin/faculty portals (HTTP 403).

2. **JWT Storage**:
   - Access token held in memory (`lib/api-client.ts`) with development localStorage fallback.
   - Refresh token transferred via HTTP-only cookie to prevent XSS.

---

## 📦 Scripts

- `npm run dev`: Starts local Next.js dev server
- `npm run build`: Production bundle compilation & TypeScript check
- `npm run start`: Starts compiled production build
- `npm run lint`: Executes ESLint validation
