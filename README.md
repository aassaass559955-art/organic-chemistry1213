# الكيمياء العضوية — Organic Chemistry Platform

منصة علمية أكاديمية متكاملة لنشر البحوث والدراسات والأطاريح والرسائل الجامعية والمقالات التعليمية في **الكيمياء العضوية** باللغتين العربية والإنجليزية — بإشراف **الباحث مرتضى عوض**.

A bilingual (Arabic/English) academic platform for publishing organic chemistry research, studies, theses and educational articles — curated by **researcher Murtada Awad**.

---

## ✨ Features

- **ثنائية اللغة RTL/LTR** — تبديل فوري بين العربية والإنجليزية (Zustand).
- **Dark / Light Mode** مع هوية بصرية `#00B894 · #0984E3 · #6C5CE7` على `#0F172A`.
- **خلفية جزيئات حية ثلاثية الأبعاد** (Three.js + React Three Fiber): ذرات مترابطة، حلقة بنزين دوّارة، ميثان، وغبار جزيئي مع تفاعل مع مؤشر الفأرة.
- **12 قسماً**: الرئيسية، الأبحاث، الدراسات، الأطاريح والرسائل، المقالات التعليمية، شرح المواضيع، التفاعلات العضوية، التراكيب الكيميائية، المكتبة العلمية، الأخبار، من نحن، تواصل معنا.
- **لوحة تحكم كاملة**: إضافة/تعديل/حذف المحتوى، رفع ملفات (PDF/DOCX/PPTX/ZIP/صور)، إدارة التعليقات، إدارة المستخدمين، نشر الإشعارات، إحصائيات ورسوم بيانية (Chart.js).
- **المساعد الذكي** *Organic Chemistry Assistant*: قاعدة معرفة عربية/إنجليزية + بحث حي في قاعدة التفاعلات والمواضيع.
- **بحث وتصفية متقدمة**: بالعنوان، الموضوع، المؤلف، السنة، الجامعة، نوع المحتوى.
- **نظام تحميل احترافي**: معاينة مباشرة، عدّاد تحميلات، حجم الملف، وتاريخ النشر.
- **SEO**: Metadata + OpenGraph + JSON-LD + `sitemap.xml` + `robots.txt`.
- **أمان**: جلسات JWT موقّعة (jose) بكوكي httpOnly، كلمات مرور bcrypt، حماية `/admin` عبر Middleware، تحقق من أنواع الملفات وبصماتها (magic bytes)، حدود للحجم والمدخلات.

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + Framer Motion |
| 3D | Three.js + React Three Fiber |
| Database | PostgreSQL + Drizzle ORM |
| State / Data | Zustand + TanStack React Query |
| Charts | Chart.js + react-chartjs-2 |
| Auth | JWT (jose) + bcryptjs + Middleware |
| Icons | Lucide |

## 🗄️ Data Model

`users` · `researchers` · `categories` · `tags` · `articles` (+ `article_tags`) · `chemical_topics` · `reactions` · `books` · `comments` · `downloads` · `notifications` · `stats`

## 🚀 Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Configure environment
cp .env.example .env   # then fill DATABASE_URL & AUTH_SECRET

# 3) Push the schema to PostgreSQL
npx drizzle-kit push

# 4) Seed demo data (creates the admin account too)
node src/db/seed.mjs

# 5) (optional) regenerate the sample downloadable PDF
node scripts/make-sample-pdf.mjs

# 6) Run
npm run dev
```

- الموقع: `http://localhost:3000`
- لوحة التحكم: `http://localhost:3000/admin` — سجّل الدخول بـ `ADMIN_EMAIL` / `ADMIN_PASSWORD` من ملف `.env`.

## ☁️ Deploying to Vercel

1. ادفع المشروع إلى GitHub.
2. أنشئ قاعدة PostgreSQL (Vercel Postgres / Neon / Supabase).
3. في Vercel: استورد المستودع وأضف متغيرات البيئة `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. `npx drizzle-kit push` محلياً ضد قاعدة الإنتاج ثم `node src/db/seed.mjs`.
5. Deploy — لا إعدادات إضافية مطلوبة.

> ملاحظة: رفع الملفات يخزن في `public/uploads` (مناسب للاستضافة الذاتية). على Vercel استخدم تخزيناً خارجياً (S3/R2) بتحديث `src/app/api/upload/route.ts` بسهولة.

## 🔐 Admin API Overview

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth` | POST/DELETE | Login / logout (JWT cookie) |
| `/api/articles` | GET/POST | List & create content |
| `/api/articles/[id]` | GET/PATCH/DELETE | Single content ops |
| `/api/comments` + `/[id]` | GET/POST/PATCH/DELETE | Moderation |
| `/api/upload` | POST | Upload files (validated) |
| `/api/download` | GET | Tracked downloads |
| `/api/notifications` | GET/POST | Notifications |
| `/api/users` | GET/PATCH | User & role management |
| `/api/stats` | GET | Dashboard analytics |
| `/api/assistant` | POST | AI assistant replies |
| `/api/track` | POST | Visitor counter |

---

© منصة الكيمياء العضوية — الباحث مرتضى عوض. جميع الحقوق محفوظة.
