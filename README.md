# EduConnect - Frontend

> **Version:** 2.0.0 | **Next.js:** 16 (App Router) | **React:** 19 | **TypeScript** | **Tailwind CSS** | **shadcn/ui**

A modern, production-ready frontend for EduConnect with role-based dashboards, real-time features, and smooth UX.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Backend API running (see backend README)

### Installation
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm ci

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# API_BASE_URL, Cookie names, Google Maps API, Cloudinary, etc.

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

### Docker (Recommended)
```bash
# From project root
docker-compose up -d
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.x |
| UI Library | shadcn/ui + Radix UI |
| Styling | Tailwind CSS 4.x |
| Forms | React Hook Form + Zod |
| State | React Query (TanStack Query) |
| Real-time | Socket.io Client |
| Charts | Recharts |
| Editor | Tiptap |
| Icons | Lucide React |
| Notifications | Sonner |
| Animations | Framer Motion |
| Testing | Jest + React Testing Library + Playwright |

---

## 🏗 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── forgot-password/      # Forgot password
│   │   ├── reset-password/       # Reset password
│   │   └── verify-email/         # Email verification
│   ├── (dashboard)/              # User dashboard route group
│   │   └── dashboard/
│   │       ├── attendance/       # Attendance pages
│   │       ├── batches/          # Batch management
│   │       ├── calendar/         # Calendar view
│   │       ├── enrollments/      # My enrollments
│   │       ├── messages/         # Chat/messaging
│   │       ├── notes/            # Daily notes
│   │       ├── notifications/    # Notifications
│   │       ├── payments/         # Payment history
│   │       ├── posts/            # Posts (create, edit, list)
│   │       ├── profile/          # Profile settings
│   │       ├── reviews/          # Reviews
│   │       ├── role-dashboards/  # Role-specific dashboards
│   │       │   ├── student-dashboard.tsx
│   │       │   ├── teacher-dashboard.tsx
│   │       │   └── guardian-dashboard.tsx
│   │       ├── services/         # My services (teacher)
│   │       ├── settings/         # Account settings
│   │       ├── subscription/     # Subscription management
│   │       └── tasks/            # Tasks/assignments
│   ├── admin/                    # Admin panel
│   │   ├── login/                # Admin login
│   │   └── (protected)/          # Protected admin routes
│   │       ├── dashboard/        # Admin dashboard
│   │       ├── admins/           # Admin management
│   │       ├── users/            # User management
│   │       ├── teachers/         # Teacher approvals
│   │       ├── services/         # Service management
│   │       ├── batches/          # Batch management
│   │       ├── enrollments/      # Enrollment management
│   │       ├── payments/         # Payment records
│   │       ├── subscriptions/    # Subscription packages
│   │       ├── posts/            # Post moderation
│   │       ├── reviews/          # Review moderation
│   │       ├── moderation/       # Content moderation
│   │       ├── audit-logs/       # Audit logs
│   │       ├── guardian-links/   # Guardian linking
│   │       ├── class-room/       # Class room management
│   │       ├── education/        # Education levels
│   │       └── settings/         # System settings
│   ├── [slug]/                   # Public service/teacher pages
│   │   ├── enroll/               # Enrollment flow
│   │   └── profile-public.tsx    # Public teacher profile
│   ├── discover/                 # Service discovery
│   ├── feed/                     # Social feed
│   ├── search/                   # Search results
│   ├── services/                 # Service detail pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components (Header, Sidebar, Footer)
│   ├── forms/                    # Form components
│   ├── charts/                   # Chart components
│   ├── chat/                     # Chat components
│   ├── dashboard/                # Dashboard-specific components
│   └── providers/                # Context providers
├── lib/                          # Utilities & configurations
│   ├── api.ts                    # Centralized API client
│   ├── constants.ts              # App constants
│   ├── utils.ts                  # Helper functions
│   ├── validations.ts            # Zod schemas
│   └── actions/                  # Server actions
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-socket.ts
│   ├── use-toast.ts
│   └── use-mobile.ts
├── config/                       # Configuration
│   └── .env.ts                   # Server-side env config
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware (auth protection)
├── next.config.ts                # Next.js config
├── tsconfig.json
├── package.json
├── Dockerfile
├── .env.example
├── .gitignore
└── components.json               # shadcn/ui config
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Modern blue/indigo gradient
- **Secondary**: Slate/gray scale
- **Accent**: Emerald (success), Amber (warning), Rose (error)
- **Dark Mode**: Full support via `next-themes`

### Typography
- **Font**: Geist (Vercel's font) via `next/font`
- **Scale**: Consistent heading + body scales

### Components
Built on **shadcn/ui** (Radix UI + Tailwind):
- Button, Input, Textarea, Select, Checkbox, Radio
- Card, Dialog, Sheet, Dropdown, Popover, Tooltip
- Table, Tabs, Accordion, Breadcrumb, Pagination
- Avatar, Badge, Skeleton, Progress, Separator
- Toast (Sonner), Form components

### Animations
- **Framer Motion** for page transitions, modals, lists
- **CSS transitions** for hover/focus states
- **Reduced motion** support

---

## 🔐 Authentication & Routing

### Middleware Protection
```typescript
// middleware.ts protects:
- /admin/* → Admin cookies required
- /dashboard/* → User cookies required
- Redirects to login if not authenticated
- Redirects away from login if authenticated
```

### Cookie-Based Auth
- **Access Token**: `cms_access_token` (HttpOnly, Secure, SameSite=Lax)
- **Refresh Token**: `cms_refresh_token` (HttpOnly, Secure, SameSite=Lax)
- **Admin Tokens**: Separate cookie names (`cms_admin_access`, `cms_admin_refresh`)
- **Auto-refresh**: Handled by API client on 401

### Route Groups
| Group | Paths | Auth |
|-------|-------|------|
| `(auth)` | `/login`, `/register`, `/forgot-password`, etc. | Public |
| `(dashboard)` | `/dashboard/*` | User required |
| `admin/(protected)` | `/admin/*` | Admin required |
| Root | `/`, `/discover`, `/services/*`, `/feed` | Public |

---

## 📱 Key Features

### Landing Page (`/`)
- Hero with animated stats
- Feature highlights
- Teacher showcase carousel
- Testimonials
- CTA to register

### Service Discovery (`/discover`)
- Map-based search (Google Maps)
- Filters: subject, level, location, price, rating
- List/grid view toggle
- Infinite scroll pagination

### Service Detail (`/services/[slug]`)
- Full service info
- Teacher profile
- Batch schedules
- Reviews & ratings
- Enroll CTA

### User Dashboards (Role-Based)

#### Student Dashboard
- Enrolled batches with progress
- Upcoming classes calendar
- Pending tasks/assignments
- Recent announcements
- Quick actions

#### Teacher Dashboard
- My services overview
- Batch management
- Student roster
- Earnings summary
- Schedule calendar

#### Guardian Dashboard
- Children overview cards
- Each child's progress
- Upcoming classes
- Payment status

### Admin Panel (`/admin`)
- Analytics dashboard (Recharts)
- User/teacher management tables
- Teacher approval workflow
- Content moderation queue
- System settings

---

## 🔌 Real-time Features (Socket.io)

### Events
```typescript
// Connection
socket.on('connect')
socket.on('disconnect')

// Chat
socket.emit('join-chat', chatId)
socket.emit('send-message', { chatId, content, type })
socket.on('new-message', message)
socket.on('message-read', { messageId, userId })

// Notifications
socket.on('notification', notification)
socket.on('unread-count', count)

// Presence
socket.emit('user-online', userId)
socket.on('user-status', { userId, status })
```

### Implementation
- `lib/socket.ts` - Singleton socket manager
- `hooks/use-socket.ts` - React hook for components
- Auto-reconnect with exponential backoff
- Auth via cookies (handled by middleware)

---

## 📝 Forms & Validation

### Stack
- **React Hook Form** - Form state management
- **Zod** - Schema validation (shared with backend)
- **shadcn/ui Form** - Accessible form components

### Example
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
})
```

---

## 🎯 State Management

| Type | Solution |
|------|----------|
| Server State | TanStack Query (React Query) |
| Client State | React Context + useReducer |
| Form State | React Hook Form |
| URL State | Next.js Search Params |
| Real-time | Socket.io + React Context |

### React Query Setup
- `providers/query-provider.tsx` - QueryClient provider
- Default: 5min stale, 10min cache
- Optimistic updates for mutations
- Automatic refetch on window focus

---

## 🧪 Testing

### Unit & Component Tests
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

- **Framework**: Jest + React Testing Library
- **Setup**: `jest.config.ts`, `jest.setup.ts`
- **Coverage**: Target >80%

### E2E Tests
```bash
npm run test:e2e      # Run Playwright tests
npm run test:e2e:ui   # Playwright UI mode
```

- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Tests**: Auth flows, critical user journeys

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build (standalone) |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit/component tests |
| `npm run test:e2e` | Run E2E tests |

---

## 🐳 Docker

### Build Image
```bash
docker build -t cms-frontend ./frontend
```

### Run Container
```bash
docker run -d \
  --name cms-frontend \
  -p 3000:3000 \
  --env-file ./frontend/.env \
  cms-frontend
```

### Multi-service
```bash
# From project root
docker-compose up -d
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Docker + VPS
```bash
# Build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)
Set all from `.env.example`:
- `API_BASE_URL` - Backend API URL
- Cookie names (must match backend)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 🔒 Security

- **Middleware**: Route protection at edge
- **HttpOnly Cookies**: Tokens never in localStorage
- **CSP Headers**: Configured in `next.config.ts`
- **Input Validation**: Zod on all forms
- **XSS Protection**: React auto-escaping + DOMPurify for rich text
- **CSRF**: SameSite=Lax cookies + custom headers

---

## ♿ Accessibility

- Semantic HTML5
- ARIA labels & roles
- Keyboard navigation
- Focus management (focus-visible)
- Color contrast (WCAG AA)
- Screen reader support
- Reduced motion support

---

## 📊 Performance

- **Next.js 16**: App Router, RSC, Streaming
- **Standalone Output**: Minimal Docker image
- **Image Optimization**: `next/image` + Cloudinary
- **Code Splitting**: Automatic per route
- **Font Optimization**: `next/font` (self-hosted)
- **Bundle Analysis**: `@next/bundle-analyzer`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- ESLint + Prettier (Next.js config)
- TypeScript strict mode
- shadcn/ui component patterns
- Conventional commits

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 📞 Support

- **Documentation**: `/docs` folder
- **Backend API**: See backend README
- **Issues**: GitHub Issues