# 🎬 הכלים של פרוסאס

מערכת פרטית ליצירת סרטונים ברמה גבוהה, מבוססת **Remotion**, עם ממשק וובי נוח בעברית.

---

## 📖 איך זה עובד

המערכת בנויה כ־**monorepo** (מאגר אחד עם כמה פרויקטים בתוכו) ומחולקת לשני חלקים עיקריים:

### 1. ממשק המשתמש (`apps/web`) — פורט 3050
אפליקציית **Next.js** שרצה בדפדפן ומכילה:
- **דף ראשי (Dashboard)** — רשימת כל הפרויקטים עם סטטוס (טיוטה / מרנדר / הושלם / נכשל)
- **יצירת פרויקט חדש** (`/new`) — מסך עם prompt builder שבו אפשר:
  - להזין תיאור חופשי של הסרטון
  - לבחור מטרה (פרסומת, UGC, הסבר, Reel, מבצע...)
  - לבחור פלטפורמה (TikTok, Instagram Reels, YouTube, Facebook...)
  - לבחור סגנון ויזואלי, טון דיבור, עוצמת אנימציה
  - להגדיר משך ומספר סצנות
- **עורך סצנות** (`/project/[id]`) — צפייה ועריכה של כל הסצנות בפרויקט עם Timeline ויזואלי

### 2. שירות רינדור (`apps/render-service`) — פורט 4010
שרת **Node.js** מקומי שמקבל פרויקט ומרנדר אותו לקובץ MP4:
- **`POST /render`** — שולחים JSON של פרויקט → מקבלים קובץ וידאו
- **`GET /health`** — בדיקת תקינות השירות

### 3. חבילות הליבה (`packages/`)

| חבילה | מה היא עושה |
|---|---|
| **shared** | קבועים משותפים — יחסי גובה-רוחב, פלטפורמות, סוגי סצנות, סגנונות, FPS |
| **video-core** | סכמות Zod לפרויקטים, סצנות, Brand Kit, הגדרות רינדור + פונקציות עזר (timeline, המרת שניות↔פריימים) |
| **prompt-engine** | מנוע שממיר טקסט חופשי → מערך סצנות מובנה לפי מטרת הסרטון |
| **video-templates** | קומפוננטות Remotion לסצנות (HeroIntro, BigHeadline, FeatureGrid, KpiCards, SocialProof, CtaOutro ועוד) עם אנימציות spring/interpolate |
| **ui** | רכיבי ממשק משותפים (Button) |

### הזרימה המלאה
```
פרומפט → prompt-engine → סצנות מובנות (Zod) → video-templates (Remotion) → render-service → MP4
```

---

## 🚀 איך מתחילים

### דרישות מקדימות
- **Node.js** גרסה 18 ומעלה
- **npm** (מגיע עם Node.js)
- **ffmpeg** (נדרש לרינדור וידאו בפועל — `brew install ffmpeg` במק)

### שלב 1 — שכפול והתקנת תלויות
```bash
git clone https://github.com/carhubcentralts-hue/game3d.git
cd game3d
npm install
```

### שלב 2 — בנייה
```bash
npm run build
```
זה בונה את כל החבילות + אפליקציית הווב + שירות הרינדור.

### שלב 3 — הפעלת ממשק המשתמש
```bash
npm run dev
```
פותחים בדפדפן: **http://localhost:3050**

### שלב 4 — הפעלת שירות הרינדור (בטרמינל נפרד)
```bash
npm run render-service
```
השירות מאזין ב: **http://localhost:4010**

---

## 📂 מבנה הפרויקט

```
הכלים-של-פרוסאס/
├── apps/
│   ├── web/                    # ממשק Next.js — פורט 3050
│   │   └── src/app/
│   │       ├── page.tsx        # דף ראשי (Dashboard)
│   │       ├── new/page.tsx    # יצירת פרויקט + Prompt Builder
│   │       └── project/[id]/   # עורך סצנות + Timeline
│   └── render-service/         # שירות רינדור — פורט 4010
│       └── src/
│           ├── index.ts        # שרת HTTP (POST /render, GET /health)
│           ├── renderer.ts     # לוגיקת רינדור (Remotion renderMedia)
│           └── logger.ts       # לוגים עם pino
├── packages/
│   ├── shared/                 # קבועים וטיפוסים משותפים
│   ├── video-core/             # סכמות Zod + timeline helpers
│   ├── prompt-engine/          # prompt → structured scenes
│   ├── video-templates/        # קומפוננטות Remotion לסצנות
│   └── ui/                     # רכיבי ממשק משותפים
├── storage/
│   ├── projects/               # שמירת פרויקטים
│   ├── assets/                 # קבצי מדיה
│   ├── renders/                # קובצי MP4 מרונדרים
│   └── temp/                   # קבצים זמניים
├── package.json                # הגדרות monorepo
└── tsconfig.base.json          # הגדרות TypeScript בסיסיות
```

---

## 🛠️ פקודות זמינות

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | מפעיל את ממשק הווב בפיתוח (פורט 3050) |
| `npm run build` | בונה את כל החבילות והאפליקציות |
| `npm run build:packages` | בונה רק את החבילות (בלי האפליקציות) |
| `npm run render-service` | מפעיל את שירות הרינדור (פורט 4010) |
| `npm run typecheck` | בודק טיפוסי TypeScript בכל החבילות |
| `npm run lint` | מריץ linting |
| `npm run test` | מריץ טסטים |

---

## 🎨 סוגי סצנות נתמכים

המערכת תומכת ב-15 סוגי סצנות:

1. 🎬 **Hero Intro** — פתיחה דרמטית
2. 📝 **Big Headline** — טקסט קינטי גדול
3. 📐 **Split Layout** — טקסט + תמונה
4. 🖼️ **Fullscreen Image** — תמונה במסך מלא
5. ↔️ **Before/After** — לפני/אחרי
6. ⭐ **Social Proof** — המלצות
7. 📊 **KPI Cards** — מדדים ונתונים
8. 📋 **Timeline Steps** — שלבי תהליך
9. ⚡ **Feature Grid** — רשת תכונות
10. 💡 **Problem/Solution** — בעיה ופתרון
11. 🏷️ **Offer/Discount** — מבצע
12. 🔔 **CTA Outro** — סיום עם קריאה לפעולה
13. 📱 **Mockup Showcase** — תצוגת מוצר
14. 🏢 **Logo Wall** — קיר לוגואים
15. ❓ **FAQ/Objection** — שאלות נפוצות

---

## 🔧 טכנולוגיות

- **Next.js 15** — App Router, SSR, RTL
- **TypeScript** — טיפוסים חזקים בכל מקום
- **Tailwind CSS** — עיצוב מהיר
- **Remotion** — Composition, Sequence, interpolate, spring
- **Zod** — ולידציה של סכמות פרויקט וסצנות
- **Zustand** — ניהול state
- **Pino** — לוגים בשירות הרינדור
- **npm workspaces** — ניהול monorepo
