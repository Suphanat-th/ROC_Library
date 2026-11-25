# แผนย้าย ROC Library จาก Vercel ไป Cloudflare Pages

สถานะ: **ยังไม่เริ่มลงมือ** (วางแผนเท่านั้น) · ดูเหตุผลที่ [ADR 0001](adr/0001-move-from-vercel-to-cloudflare.md)

> ปรับแผนล่าสุด: เริ่มแบบ **ไม่มีโดเมนและไม่มี R2** ภาพอยู่ใน `public/` บน Pages เหมือนเดิม ทดลองบน `*.pages.dev` แล้วตัดสินใจเรื่อง R2 และโดเมนจากผลจริง ไม่ใช้ Vercel อีก

> **หมายเหตุ (หน้าตั้งค่าของ Cloudflare):** หน้า "Set up your application" ที่ผู้ใช้เห็นเป็นแบบ **Workers + Static Assets** (`npx wrangler deploy`) ไม่ใช่ Pages แบบเดิม จึงอ่าน "Pages / Pages Functions" ในแผนนี้ว่าเป็น **Worker หนึ่งตัวที่เสิร์ฟไฟล์ static (`assets.directory = out`) และมีโค้ดจัดการ `/api/*`** (`assets.run_worker_first: ["/api/*"]` เพื่อให้เฉพาะ API ผ่าน Worker และนับโควตา) ไฟล์ตั้งค่าคือ `wrangler.jsonc`, secret ตั้งด้วย `wrangler secret` หรือ Dashboard (มีผลทันที ไม่ต้อง redeploy ต้องยืนยันตอนทดลองจริง) Repo มีแอปอยู่ในโฟลเดอร์ย่อย `roc-library/` จึงต้องตั้ง **Root directory = `roc-library`** และ **production branch = `cloudflare-pages`** ก่อน deploy ครั้งแรก

## ที่มา
- Vercel Hobby ถูกหยุดมา ~3 สัปดาห์ หลังใช้ ~4M requests/เดือน (พุ่งสุดวัน 28 ต.ค. ตรงกับแพตช์)
- สาเหตุหลัก: `public/` หนัก 306 MB / 2,887 ไฟล์ และหน้าหนึ่งโหลดภาพเล็กจำนวนมาก (`monsterDb` gif 311, `minimap` webp 283, MapViewer ที่โหลด texture/model ทีละไฟล์ ฯลฯ) โดยไม่มี cache header
- ไม่จ่าย Vercel Pro และไม่รีบ

## ข้อตัดสินใจที่ตกลงแล้ว
| เรื่อง | ตัดสินใจ |
|---|---|
| ตัวเว็บ | Next.js `output: "export"` เสิร์ฟด้วย Cloudflare Pages (request static ฟรี ไม่จำกัด) |
| ภาพ/ไฟล์ static | **อยู่ใน `public/` บน Pages ก่อน** (ไม่ใช้ R2 ในรอบแรก) ข้อจำกัดที่ต้องยืนยันกับเอกสาร Cloudflare: ≤ 20,000 ไฟล์, ไฟล์ละ ≤ 25 MiB |
| API | Pages Functions แพ็กเกจฟรี เฉพาะ `feedback`, `boss-report`, `botgeneratekey` (100k requests/วัน, bundle 3 MB) |
| VIP | ยังไม่ใช้งาน (คอมเมนต์ใน sidebar) จึงตัด `/vip-search` และ `/api/vip` ออกจาก production |
| patch-convert | **ทาง C:** เช็ก Key ผ่าน Function `/api/patch-key` (Patch key รายสัปดาห์ + Member key ถาวร เก็บเป็น secret ของ Pages) cache ผลใน `sessionStorage` + rate limit; ถ้าหมุนคีย์ด้วย redeploy น่ารำคาญค่อยย้ายคีย์ไปตาราง Supabase (C2) |
| โครงสร้าง build | `scripts/prepare-static.mjs` ลบ `src/app/api`, `src/app/dev`, `vip-search` ชั่วคราวเฉพาะตอน build บน Cloudflare; `npm run dev` ใช้ route เดิมได้ตามปกติ; `functions/api/*` เป็นตัวห่อบางๆ เรียก utils ชุดเดียวกัน |
| โดเมน | **ยังไม่ซื้อ** ใช้ `<ชื่อ>.pages.dev` ทดลองก่อน ซื้อ (Cloudflare Registrar) เมื่อพอใจผล |
| Vercel | ไม่ใช้อีก เก็บโปรเจกต์ไว้เฉยๆ จนเว็บใหม่เสถียร 1–2 สัปดาห์แล้วลบ |
| Build/Deploy | Cloudflare Pages ผ่าน Git (ไม่ build บน Windows) |
| ค่าใช้จ่าย | ฟรีช่วงทดลอง; ~ $1/เดือน (ค่าโดเมน) เมื่อซื้อ |

## สิ่งที่ต้องแก้เพราะ static export
- [ ] `patch-convert/page.tsx` ใช้ `headers()` และ `searchParams` ฝั่ง server (ตอนนี้อ่าน `PATCH_CONVERT_KEY` + `PATCH_CONVERT_MEMBER_KEY` จาก env) → แปลงเป็นหน้า client: อ่าน `?Key=` จาก `window.location`, localhost ผ่านเลยโดยไม่เรียก API, นอกนั้นเรียก `/api/patch-key` แล้ว cache ผลใน `sessionStorage`
  - [ ] เขียน `functions/api/patch-key` เทียบคีย์กับ secret (`timingSafeEqual`) พร้อม rate limit; คีย์ไม่ถูกฝังใน bundle
  - [ ] ยืนยันกับเอกสาร/ทดลองจริงว่าเปลี่ยน env ของ Pages มีผลเมื่อไร (ต้อง redeploy หรือไม่) ถ้ารายสัปดาห์น่ารำคาญ → ย้ายคีย์ไปตาราง Supabase (C2)
  - [ ] ยอมรับข้อจำกัด: ตัวเครื่องมือทำงานฝั่งเบราว์เซอร์และอยู่ใน bundle คนที่แก้ JS เองเลี่ยงด่านได้ แต่คีย์ไม่รั่ว
- [ ] `utils/botSession.ts` ใช้ `cookies()` ใช้ได้เฉพาะใน Function ไม่ใช่หน้า static
- [ ] `/dev/*` และ `/api/dev/*` ตัดออกจาก production build
- [ ] `images: { unoptimized: true }` ใน `next.config.ts`
- [ ] API 3 ตัวย้ายเป็น Pages Functions (`functions/api/...`) ใช้ Supabase REST ถ้าไลบรารีพึ่ง Node API

## ลำดับงาน

### เฟส 0: เตรียม (ไม่ต้องซื้ออะไร)
- [ ] **ผู้ใช้เคลียร์ git เอง** แยก commit: ไฟล์ที่ถูกลบ (ตรวจว่าตั้งใจ), ไฟล์ที่ยังไม่ track (โดยเฉพาะ `public/assets/images/minimap/`, โฟลเดอร์ model ชื่อเกาหลีใน `sprite_data`, `PatchCard`), และเพิ่ม `.claude/`, `.impeccable/`, `.agents/` ใน `.gitignore` (Cloudflare build จาก git เท่านั้น)
- [ ] สร้างบัญชี Cloudflare และเชื่อม GitHub (repo `ROC_Library`)
- [ ] เตรียมค่า secret ใส่เองใน Dashboard (ห้ามส่งในแชท): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BOT_KEYGEN_ADMIN_PASSWORD`, `BOT_LICENSE_PRIVATE_KEY`, `PATCH_CONVERT_KEY`, `PATCH_CONVERT_MEMBER_KEY`
- [ ] ตรวจเอกสาร Cloudflare ยืนยันขีดจำกัด Pages (จำนวนไฟล์, ขนาดไฟล์) และ Functions (ขนาด bundle, โควตาฟรี)
- [ ] เช็กไฟล์ `PatchImage/*.bmp` ที่ถูกลบ 148 รายการใน git status ว่าตั้งใจหรือไม่
- [ ] ผู้ใช้ส่งข้อมูล Vercel แบ่งตาม path (ภาพ gif / texture / minimap / หน้าเว็บ / API) และเช็กแพ็กเกจ Supabase

### เฟส 1: แปลงเป็น static + Functions แล้ว deploy (branch แยก)
- [ ] ตั้ง `output: "export"` และแก้ตามหัวข้อ "สิ่งที่ต้องแก้เพราะ static export"
- [ ] ตัด `/vip-search`, `/api/vip`, `/dev/*` ออกจาก production
- [ ] เขียน `scripts/prepare-static.mjs` และตั้ง build command บน Cloudflare เป็น `node scripts/prepare-static.mjs && next build --webpack`
- [ ] เขียน `functions/api/{feedback,boss-report,botgeneratekey,patch-key}` เป็นตัวห่อบางๆ เรียก utils เดิม; ตั้ง `nodejs_compat` (ใช้ `node:crypto`); ใน Function ไม่ใช้ `node:fs` อ่านคีย์จาก `BOT_LICENSE_PRIVATE_KEY` อย่างเดียว; `botSession.ts` ที่ใช้ `cookies()` ต้องปรับให้ใช้ header ของ Request ใน Function
- [ ] แก้ `layout.tsx` ที่เช็ก `VERCEL_ENV` (Google Analytics) ให้ใช้ตัวแปรของ Cloudflare เช่น `CF_PAGES_BRANCH`
- [ ] ตั้ง secret บน Cloudflare (Supabase URL/service role ฯลฯ)
- [ ] เชื่อม repo กับ Pages, deploy เป็น `*.pages.dev` ตรวจว่าภาพใน `public/` ขึ้นครบ และขนาด Functions ไม่เกิน 3 MB

**สถานะเฟส 1 (โค้ดเสร็จบน branch `cloudflare-pages`, ยังไม่ deploy):**
- ทดสอบในสำเนาแยก: `prepare-static` + `next build` ได้ static export 31 หน้า; `wrangler dev` (workerd) ตอบ API ครบ รวมการเซ็นคีย์ Ed25519 ผ่าน `node:crypto`; ขนาด Worker ~980 KiB (gzip 175 KiB) ต่ำกว่าเพดาน 3 MB ของแพ็กเกจฟรีมาก; `npm run build` ปกติผ่าน
- ยังไม่ได้ทดสอบ: การ deploy จริง, การเชื่อม Supabase จริงจาก Worker, ภาพ/แผนที่ทั้งหมด (สำเนาทดสอบไม่มีภาพใหญ่), secret ใน Cloudflare, `NEXT_PUBLIC_SITE_URL` (ตอนนี้ OG image ใช้ localhost:3000 จนกว่าจะตั้งโดเมน)
- Cloudflare ตั้ง Production branch เป็น `cloudflare-pages` แล้ว (build แรกบน `main` ล้มตามคาด เพราะ `main` ยังไม่มี `prepare-static.mjs`) รอ build จาก `cloudflare-pages`
- ต้องทำเองใน Cloudflare: ตั้ง Production branch, ใส่ secret ที่ **Settings > Variables and Secrets (runtime)** (แยกจาก Build variables), กด Deploy

### เฟส 2: ทดสอบและทดลองใช้จริง
- [ ] ไล่ทุกเมนูใน sidebar, theme toggle, patch-convert, visual (SPR/ACT), mvp (route + Supabase report), 5thAnvs, MapViewer
- [ ] ทดสอบ API: `/api/feedback`, `/api/boss-report`, `/api/botgeneratekey`
- [ ] ตรวจ timezone (GMT+7) และ localStorage
- [ ] แชร์ลิงก์ `*.pages.dev` ให้ผู้เล่นทดลอง 1–2 สัปดาห์ ดู Cloudflare Analytics (จำนวน request, หน้าที่หนัก)

### เฟส 3: ตัดสินใจจากผลจริง
- [ ] ถ้าทุกอย่างสบาย → ซื้อโดเมน ผูกกับ Pages เปิด auto-renew ประกาศลิงก์ใหม่ แล้วลบ Vercel
- [ ] ถ้า deploy ช้า/repo หนัก → ย้ายภาพไป R2 (เพิ่ม `assetUrl()`, `NEXT_PUBLIC_ASSET_BASE`, `scripts/upload-r2.mjs`, `cdn.<โดเมน>`, ตั้ง immutable + CORS; ต้องมีโดเมนก่อน)
- [ ] ถ้า MapViewer ดึงไฟล์เยอะ/404 เปลืองมาก → ทำ manifest ชื่อไฟล์ หรือรวม texture

### เฟสเสริม: กันค่าใช้จ่ายและบอต
- [ ] ตั้ง Billing notification บน Cloudflare
- [ ] ตั้ง WAF rate limit สำหรับ `/api/*` (ใช้ได้เมื่อมีโดเมนบน Cloudflare)
- [ ] ถ้า API เกิน 100k requests/วัน ค่อยพิจารณา Workers Paid ($5)
- [ ] เช็ก Supabase keep-alive ถ้าเป็นแพ็กเกจฟรี

## การติดตามและทดสอบ
(ข้อมูลด้านโควตา/เครื่องมือมาจากความจำ ต้องยืนยันกับเอกสาร Cloudflare และ Dashboard จริงในเฟส 0–1)

**ถ้าเกินโควตาจะเกิดอะไร (ต่างจาก Vercel):**
- static (หน้าเว็บ + ภาพ): ไม่จำกัด ไม่ถูก pause
- Functions เกิน 100k requests/วัน: เฉพาะ API ล่มถึงรอบวันถัดไป หน้าเว็บยังเปิดได้
- build เกินโควตา (~500 ครั้ง/เดือน): build ใหม่ไม่ได้ เว็บเดิมยังออนไลน์

**เครื่องมือดูตัวเลข:**
- ไม่ต้องมีโดเมน: Cloudflare Web Analytics, Functions metrics ใน Dashboard, `wrangler pages deployment tail` (log สด), Supabase Dashboard
- ต้องมีโดเมนบน Cloudflare: กราฟ request/bandwidth แยกตาม path, WAF rate limit

**ทดสอบโดยไม่เปลืองโควตา:**
- `npm run dev` และ `wrangler pages dev` ในเครื่อง ไม่นับโควตา
- preview deploy ต่อ branch: static ฟรี แต่ API ใช้โควตา 100k/วัน ร่วมกับของจริง และนับ build ต่อ push
- ห้ามรันสคริปต์ยิง `/api/*` ซ้ำบนเว็บจริง และไม่ push รัวๆ

**งานเพิ่ม:**
- [ ] เฟส 1: ตรวจว่า `boss-report` และ `botgeneratekey` มี rate limit หรือไม่ (`feedback` มีแล้ว 3 ครั้ง/10 นาที) ถ้าไม่มี ให้เพิ่ม
- [ ] เฟส 1: เปิด Web Analytics ตั้งแต่ deploy ครั้งแรก และจดตัวเลขที่ Dashboard แสดงได้
- [ ] เฟส 2→3: ถ้า Dashboard ของ `pages.dev` ดู request ของ static ไม่ละเอียดพอ ให้ซื้อโดเมน **ก่อนเฟส 3** เพื่อให้เห็น Analytics แยกตาม path

## ความเสี่ยง
- Pages Functions เกิน 3 MB หรือไลบรารี Supabase ใช้ Node API ไม่ได้ → ใช้ Supabase REST ตรง หรือซื้อ Workers Paid
- ขีดจำกัดไฟล์ของ Pages (ที่ผมจำได้) อาจไม่ตรงปัจจุบัน → ตรวจในเฟส 0 ถ้าไม่พอ ต้องใช้ R2 ตั้งแต่ต้น
- repo/ deploy ใหญ่ (306 MB) → build และอัปโหลดช้า
- ผู้เล่นได้ลิงก์ `pages.dev` ก่อน แล้วเปลี่ยนเป็นโดเมนจริงทีหลัง → ต้องประกาศลิงก์ใหม่
- ฟีเจอร์ server ใหม่ในอนาคตต้องใช้ Function เพิ่ม (static export ใช้ ISR/`headers()` ไม่ได้)

## สิ่งที่ผมทำเองไม่ได้ (ต้องเป็นคุณ)
สร้างบัญชี Cloudflare, เชื่อม Pages กับ GitHub, ตั้ง secret บน Cloudflare, ซื้อโดเมน (ภายหลัง), ส่งข้อมูล Vercel
