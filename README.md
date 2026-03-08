# 🔧 ProSaaS Tools

פלטפורמת כלים פנימית פרטית — הכלי הראשון: **Video Studio** מבוסס Remotion.

---

## 📖 סקירה כללית

**ProSaaS Tools** היא פלטפורמה פנימית שנבנתה כ-monorepo מודולרי. המערכת כוללת:
- 🔐 **התחברות מאובטחת** — JWT session עם httpOnly cookies
- 🏠 **דשבורד ראשי** — ניהול כלים ופרויקטים
- 🎬 **Video Studio** — יצירת סרטוני שיווק עם Remotion
- 🧰 **Tool Registry** — מערכת הרחבה לכלים נוספים בעתיד
- 📦 **Storage Abstraction** — Local / Cloudflare R2
- 🗄️ **Database Ready** — Prisma + Postgres schema

---

## 🏗️ ארכיטקטורה

```
ProSaaS Tools
├── apps/web              → Next.js App (Port 3050)
│   ├── /login            → מסך התחברות
│   ├── /dashboard        → דשבורד ראשי
│   ├── /tools            → רשימת כלים
│   └── /tools/video-studio → Video Studio (projects, editor, render)
│
├── apps/render-service   → שירות רינדור (Port 4010)
│   ├── POST /render      → התחלת render job
│   ├── GET /render/:id   → סטטוס job
│   ├── GET /render/:id/logs → לוגים
│   └── GET /health       → health check
│
├── packages/database     → Prisma schema + repositories
├── packages/auth         → JWT session + password hashing
├── packages/storage      → Storage abstraction (Local / R2)
├── packages/shared       → קבועים וטיפוסים
├── packages/video-core   → Zod schemas + timeline helpers
├── packages/prompt-engine → prompt → structured scenes
├── packages/video-templates → Remotion scene components
└── packages/ui           → shared UI components
```

### זרימת הרינדור (Local → Remote Ready)

```
User → Web App → API /render → Render Service (HTTP) → Remotion → MP4
                                    ↑
                          localhost:4010 (local)
                          OR
                          https://render.example.com (remote - future)
```

**כרגע:** הרינדור רץ מקומית על המחשב שלך.
**בעתיד:** פשוט משנים `RENDER_SERVICE_URL` ב-env ומצביעים לשרת חיצוני.

---

## 🚀 התחלה מהירה

### דרישות
- **Node.js 18+**
- **npm**
- **ffmpeg** (לרינדור וידאו — `brew install ffmpeg` במק)

### שלב 1 — שכפול והתקנה
```bash
git clone https://github.com/carhubcentralts-hue/game3d.git
cd game3d
cp .env.example .env
npm install
```

### שלב 2 — בנייה
```bash
npm run build
```

### שלב 3 — הפעלה
```bash
# טרמינל 1 — ממשק הווב
npm run dev

# טרמינל 2 — שירות רינדור
npm run render-service
```

**או הכול ביחד:**
```bash
npm run dev:all
```

### שלב 4 — התחברות
פתח: **http://localhost:3050**

| שדה | ערך |
|---|---|
| שם משתמש | `Prosaas` |
| סיסמה | `Sd@090702` |

---

## 🔐 Authentication

- מסך התחברות ב-`/login`
- JWT session ב-httpOnly cookie (7 ימים)
- כל ה-routes מוגנים ב-middleware
- Logout מוחק את ה-session
- API routes:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET /api/health`

---

## 🗄️ Database (Postgres)

Schema מוכן עם Prisma. Models:

| Model | תיאור |
|---|---|
| User | משתמשים |
| Workspace | סביבות עבודה |
| Tool | כלים (Video Studio וכו') |
| Project | פרויקטים |
| Scene | סצנות |
| Asset | קבצי מדיה |
| BrandKit | ערכת מיתוג |
| RenderJob | עבודות רינדור |
| RenderOutput | פלטי רינדור |
| PromptSession | הפקות מפרומפט |
| ActivityLog | לוג פעילות |

### הפעלת DB (כשיש Postgres)
```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed default data
```

---

## ☁️ Storage (R2 / Local)

Storage abstraction עם שני drivers:
- **LocalDriver** — שמירה מקומית (ברירת מחדל לפיתוח)
- **R2Driver** — Cloudflare R2 (production)

להפעלת R2, הוסף ל-.env:
```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET=your_bucket
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

---

## 🎬 Render Service

שירות רינדור מקומי שמשתמש ב-Remotion:

- **POST /render** — מתחיל render job, מחזיר jobId מיידית
- **GET /render/:jobId** — סטטוס (pending → bundling → rendering → complete/failed)
- **GET /render/:jobId/logs** — לוגי הרינדור
- **GET /jobs** — רשימת כל העבודות
- **GET /health** — בריאות השירות

### הזרימה:
1. Web app שולח project → `POST /render`
2. Render service עושה bundle ל-Remotion composition
3. `selectComposition()` עם project data
4. `renderMedia()` יוצר MP4
5. מחזיר נתיב הקובץ

### Local vs Remote:
```env
# מקומי (ברירת מחדל)
RENDER_SERVICE_URL=http://localhost:4010

# שרת חיצוני (עתיד)
RENDER_SERVICE_URL=https://render.prosaas.example.com
```

---

## 📂 מבנה מלא

```
prosaas-tools/
├── apps/
│   ├── web/                         # Next.js frontend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── login/           # מסך התחברות
│   │       │   ├── (app)/           # protected routes
│   │       │   │   ├── dashboard/   # דשבורד
│   │       │   │   ├── tools/       # רשימת כלים
│   │       │   │   │   └── video-studio/  # Video Studio
│   │       │   │   └── settings/    # הגדרות
│   │       │   └── api/             # API routes
│   │       ├── components/          # Sidebar, etc.
│   │       ├── lib/                 # render-client
│   │       └── middleware.ts        # auth middleware
│   └── render-service/              # Render HTTP server
│       └── src/
│           ├── index.ts             # HTTP endpoints + job management
│           ├── renderer.ts          # Remotion rendering
│           ├── remotion-entry.tsx    # Composition entry point
│           └── logger.ts            # Pino logger
├── packages/
│   ├── database/                    # Prisma + repositories
│   ├── auth/                        # JWT + password hashing
│   ├── storage/                     # Local/R2 storage abstraction
│   ├── shared/                      # Constants & types
│   ├── video-core/                  # Zod schemas + helpers
│   ├── prompt-engine/               # prompt → scenes
│   ├── video-templates/             # Remotion components
│   └── ui/                          # Shared UI
├── storage/                         # Local file storage
├── scripts/                         # Setup & dev scripts
├── .env.example                     # Environment template
└── package.json                     # Monorepo config
```

---

## 🛠️ פקודות

| פקודה | תיאור |
|---|---|
| `npm run dev` | Web app בפיתוח (3050) |
| `npm run build` | בנייה מלאה |
| `npm run render-service` | שירות רינדור (4010) |
| `npm run dev:all` | הכול ביחד |
| `npm run setup` | Setup אוטומטי |
| `npm run typecheck` | בדיקת TypeScript |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed data |

---

## 🎨 סוגי סצנות

15 סוגי סצנות: Hero Intro, Big Headline, Split Layout, Fullscreen Image, Before/After, Social Proof, KPI Cards, Timeline Steps, Feature Grid, Problem/Solution, Offer/Discount, CTA Outro, Mockup Showcase, Logo Wall, FAQ/Objection.

---

## 🔧 Stack

- **Next.js 15** — App Router, SSR, RTL
- **TypeScript** — Typed everywhere
- **Tailwind CSS** — Premium dark UI
- **Remotion 4** — Video rendering
- **Prisma** — Database ORM (Postgres)
- **jose** — JWT sessions
- **Zod** — Schema validation
- **Zustand** — State management
- **Pino** — Logging
- **@aws-sdk/client-s3** — R2/S3 storage
- **npm workspaces** — Monorepo

---

## 🔮 עתיד

המערכת מוכנה להרחבה:
- 👥 Multiple users & workspaces
- 🧰 Tool plugins (Prompt Tools, Campaign Manager, Landing Pages)
- ☁️ Remote render server
- 🗄️ Full Postgres persistence
- ☁️ Cloudflare R2 storage
- 🤖 AI generation integrations
