# COACHING MANAGEMENT SYSTEM — FRONTEND DESIGN CONTEXT

# Version: 1.0.0

# Purpose: Single source of truth for all UI/UX design decisions.
# Every page, component, and layout MUST follow this system.

---

## 🎨 DESIGN SYSTEM: Premium Glassmorphism

Every UI element in this project follows a premium glassmorphism aesthetic.
The goal is a clean, modern, trust-inspiring look — think Stripe/Linear quality.

---

## 🎯 COLOR PALETTE

```
Primary Blue:     #0066FF (buttons, links, accents)
Primary Hover:    #0052CC
Primary Light:    #0066FF/10 (icon backgrounds, soft accents)
Gradient Blue:    from-[#0066FF] to-[#60A5FA] (hero text, highlights)

Light Mode:
  Background:     white / gray-50 (section alternation)
  Card:           white with border
  Text Primary:   gray-900
  Text Secondary: gray-500
  Border:         gray-100

Dark Mode:
  Background:     gray-950
  Card:           gray-900
  Text Primary:   white
  Text Secondary: gray-400
  Border:         gray-800
```

---

## 🧱 CORE CSS UTILITIES

### Glass Card (floating navbar, overlays)
```css
.glass-card {
  background: color-mix(in oklch, white 70%, transparent);
  backdrop-filter: blur(24px);
  border: 1px solid color-mix(in oklch, white 20%, transparent);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px color-mix(in oklch, black 5%, transparent);
}
.dark .glass-card {
  background: color-mix(in oklch, white 5%, transparent);
  border-color: color-mix(in oklch, white 10%, transparent);
  box-shadow: 0 25px 50px -12px color-mix(in oklch, black 20%, transparent);
}
```

### Glass Card Solid (feature cards, content cards)
```css
.glass-card-solid {
  background: white;
  border: 1px solid color-mix(in oklch, black 5%, transparent);
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px color-mix(in oklch, black 5%, transparent),
              0 2px 4px -2px color-mix(in oklch, black 5%, transparent);
}
.dark .glass-card-solid {
  background: color-mix(in oklch, rgb(17 24 39) 80%, transparent);
  border-color: color-mix(in oklch, white 10%, transparent);
}
```

### Tailwind Equivalent Classes (when CSS utility not available)
```
Glass overlay:    bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10
Glass card:       bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl
Solid card:       bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px]
```

---

## 📐 SPACING & RADIUS

```
Card border radius:    rounded-[20px] to rounded-[24px] (cards)
                       rounded-[32px] (hero CTA sections)
                       rounded-3xl (glass overlays)
Button border radius:  rounded-full (all primary buttons)
                       rounded-xl (secondary buttons, inputs)
Input border radius:   rounded-xl
Section padding:       py-20 sm:py-28 (public pages)
                       p-6 (dashboard cards)
                       p-8 to p-16 (auth cards)
```

---

## 🌊 BACKGROUNDS & EFFECTS

### Ambient Glow (hero sections, page backgrounds)
```html
<div class="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-500/10 blur-3xl" />
<div class="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
<div class="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
```

### Section Alternation
- Hero: white bg with glow
- Features: `bg-gray-50/50 dark:bg-gray-900/30`
- How It Works: white bg with glow
- Roles: `bg-gray-50/50 dark:bg-gray-900/30`
- CTA: white bg
- Footer: white bg with top border

### Shadows
```
Soft hover:    hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
Button glow:   shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40
Card default:  shadow-2xl
Float effect:  hover:-translate-y-1 transition-all duration-500
```

---

## 🔤 TYPOGRAPHY

```
Hero heading:     text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight
Section heading:  text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl
Card title:       text-lg font-semibold
Card description: text-sm text-gray-500 dark:text-gray-400 leading-relaxed
Nav links:        text-sm font-medium text-gray-600 dark:text-gray-400
Stats value:      text-3xl font-bold
Stats label:      text-sm text-gray-500
```

---

## 🔘 BUTTONS

### Primary (always rounded-full)
```html
<Button size="lg" class="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 h-13 font-semibold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 active:scale-[0.98]">
  Get Started Free
  <ArrowRight class="ml-2 size-4" />
</Button>
```

### Secondary / Ghost
```html
<Button variant="outline" size="lg" class="rounded-full px-8 h-13 font-semibold text-base border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300">
  See Our Work
</Button>
```

### Nav Button
```html
<Button size="sm" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300">
  Get Started
</Button>
```

---

## 🏗️ LAYOUT PATTERNS

### Public Page (Landing, Auth)
```
- Header component (glass card navbar)
- Full-width sections with max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Footer component
- Ambient glow backgrounds on sections
```

### Auth Pages (Login, Register, etc.)
```
- Centered card layout
- Glass card styling: rounded-[24px] or rounded-[32px]
- Ambient glow behind card
- Logo + heading + form + footer link
```

### Dashboard Layout
```
- SidebarProvider + SidebarInset
- DashboardSidebar (fixed left)
- DashboardHeader (sticky top)
- Main content: p-4 sm:p-6 lg:p-8
- Cards use rounded-[20px] border border-gray-100 dark:border-gray-800
```

### Feed Page (standalone)
```
- No layout wrapper — own navbar
- 3-column layout on desktop
- Infinite scroll
```

---

## 📊 DASHBOARD CARDS

### Stat Card
```html
<Card class="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all">
  <CardContent class="p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">Total Revenue</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">$12,450</p>
      </div>
      <div class="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
        <DollarSign class="size-5" />
      </div>
    </div>
  </CardContent>
</Card>
```

### List/Content Card
```html
<Card class="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all">
  <CardContent class="p-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-50 text-green-600">APPROVED</span>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-2">Batch Name</h3>
        <p class="text-sm text-gray-500 mt-1">Service Title</p>
        <div class="mt-3 flex items-center gap-4 text-[13px] text-gray-400">
          <span class="flex items-center gap-1.5"><Calendar class="size-3.5" />Date</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🎭 STATUS BADGES

```html
<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-50 text-green-600">APPROVED</span>
<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600">PENDING</span>
<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-red-50 text-red-500">REJECTED</span>
<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600">WAITLISTED</span>
```

---

## ⚠️ RULES — ALWAYS FOLLOW

1. **NEVER** use plain white backgrounds for cards on public pages — use glass-card or glass-card-solid
2. **NEVER** use sharp corners — minimum rounded-xl, cards use rounded-[20px]
3. **ALWAYS** add hover effects on interactive cards — shadow increase + translate-y
4. **ALWAYS** use blue-600 as primary action color
5. **ALWAYS** add ambient glow backgrounds on public page sections
6. **ALWAYS** match landing page quality on dashboard pages
7. **ALWAYS** use dark mode compatible colors — no hardcoded grays without dark: variant
8. **ALWAYS** use the same button style system — rounded-full for primary, rounded-xl for secondary
9. **ALWAYS** use text-[11px] font-semibold for status badges
10. **ALWAYS** use lucide-react icons — consistent icon system
11. **ALWAYS** use smooth transitions — transition-all duration-300 or duration-500
12. **NEVER** add loading skeletons that look different from the actual content shape

---

## 📁 FILE STRUCTURE

```
frontend/
├── app/
│   ├── (auth)/              # Auth pages — glass card centered layout
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/         # Dashboard — sidebar + header layout
│   │   └── dashboard/
│   │       ├── page.tsx     # Dashboard home
│   │       ├── profile/
│   │       ├── services/
│   │       ├── batches/
│   │       ├── enrollments/
│   │       ├── payments/
│   │       ├── messages/
│   │       ├── notifications/
│   │       ├── media/
│   │       ├── posts/
│   │       ├── settings/
│   │       └── role-dashboards/
│   ├── feed/                # Standalone feed — own navbar
│   ├── admin/               # Admin panel
│   └── [username]/          # Public profile
├── components/
│   ├── layout/              # header, footer, sidebar, dashboard-header
│   ├── social/              # comment, like, story, notification components
│   ├── rich-editor/         # TipTap editor
│   └── ui/                  # shadcn components
├── lib/
│   ├── actions/             # Server actions per module
│   ├── constants.ts         # Routes + API endpoints
│   ├── auth.ts              # Auth helpers
│   └── socket.ts            # Socket.io client
└── DESIGN_CONTEXT.md        # This file
```

---

## 🔄 PATTERN: Server Action + Client Component

Every dashboard page follows this pattern:

```
page.tsx (Server Component)
  └── page-content.tsx (Client Component)
        ├── useState for data
        ├── useEffect to fetch data
        ├── Server action call for mutations
        └── Render with status badges, pagination, etc.
```

Server actions in `lib/actions/<module>.ts`:
```typescript
"use server";
import { cookies } from "next/headers";

async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { Cookie: cookieHeader, ...options.headers },
    cache: "no-store",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "API_ERROR");
  return data as T;
}
```

---

_End of design context file._
