# ตั้ง R2 + Asset host ให้ Costume simulator (ก่อน deploy)

ตัดสินใจแล้ว (26 พ.ย.): ตั้ง R2 ให้เสร็จและทดสอบที่ localhost **ก่อน** deploy; โดเมน `assets.roc-library.com`; ใส่ Cache rule; ล็อก Member อย่างน้อย 2 สัปดาห์แล้วดูโควตาก่อนเปิดสาธารณะ; ผู้ใช้ commit/push เอง

## 1. สร้าง bucket และโดเมน (ทำใน Cloudflare dashboard)
1. R2 → Create bucket ชื่อ เช่น `roc-assets` (Location: Automatic)
2. bucket → Settings → Custom Domains → Add `assets.roc-library.com` (โดเมน roc-library.com ต้องอยู่ใน Cloudflare เดียวกัน)
3. **อย่าเปิด** Public Development URL (r2.dev) ใช้แค่โดเมนของเรา

## 2. CORS (bucket → Settings → CORS policy → Add)
เว็บอยู่คนละโดเมนกับ Asset host และเราส่ง header `Range` เบราว์เซอร์จึงถามก่อน (preflight) ถ้าไม่มีกฎนี้ การอ่าน pack จะพังเฉพาะบน production

```json
[
  {
    "AllowedOrigins": ["https://www.roc-library.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range"],
    "ExposeHeaders": ["Content-Range", "Content-Length", "Accept-Ranges", "ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

ถ้ามีโดเมน preview อื่น (เช่น `*.pages.dev`) ต้องเพิ่มใน `AllowedOrigins` ด้วย

## 3. Cache rule (โดเมน roc-library.com → Caching → Cache Rules → Create)
- เงื่อนไข: Hostname equals `assets.roc-library.com`
- Cache eligibility: **Eligible for cache** (Cache everything)
- Edge TTL: Override, **7 days**; Browser TTL: Respect origin (สคริปต์ตั้ง `max-age=86400`)
- เหตุผล: ไม่ให้ทุก Range Request ไปถึง R2 (นับเป็น Class B)
- ยังไม่ได้ทดสอบว่า Cloudflare cache คำขอ Range ของไฟล์ใหญ่ (body 4 MB) ได้ดีแค่ไหน ให้ดู Cache status ใน Network tab (`cf-cache-status`) หลังเปิดหน้า 2 รอบ
- หลังอัปโหลดทับ (แพตช์ใหม่): Caching → Configuration → Purge Cache → Custom purge ตาม hostname

## 4. API token สำหรับสคริปต์
R2 → Manage R2 API Tokens → Create API token → สิทธิ์ **Object Read & Write** เลือกเฉพาะ bucket นี้ แล้วใส่ใน `environment/.env.local` (ไฟล์นี้ไม่เข้า git; ห้ามใส่ในแชทหรือโค้ด):

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=roc-assets
```

## 5. อัปโหลด
```bash
cd roc-library
npx dotenv -e environment/.env.local -- node scripts/upload-costume.mjs --dry-run   # ดูก่อนว่าจะส่งอะไร
npx dotenv -e environment/.env.local -- node scripts/upload-costume.mjs             # ส่งจริง (ราว 3,500 ไฟล์ / 517 MB)
```
- ส่งเฉพาะไฟล์ที่เปลี่ยน (จำไว้ใน `dev-data/costume/uploaded.json`) หยุดกลางทาง (Ctrl+C) แล้วรันซ้ำได้
- `--only hg/` ส่งเฉพาะโฟลเดอร์; `--force` ส่งทั้งหมดใหม่
- สคริปต์ไม่ลบอะไรใน bucket (แพ็กของแพตช์เก่าจะค้าง ลบเองใน dashboard ถ้าต้องการ)

## 6. ทดสอบที่ localhost ก่อน deploy
1. ใส่ใน `environment/.env.local`: `NEXT_PUBLIC_ASSET_HOST=https://assets.roc-library.com` แล้วรีสตาร์ท `npm run dev`
2. เปิด `/costume` + DevTools Network: ตัวละคร/Costume/เอฟเฟกต์ต้องขึ้นครบ, คำขอ pack เป็น 206, ไม่มี error CORS ใน Console
3. นับ Request ต่อการเล่นหนึ่งรอบ (ตัวเลขประมาณ 20–60 ในแผนยังเป็นการเดา ให้ใช้เลขจริงนี้แทน)
4. เปิดซ้ำ ดู `cf-cache-status: HIT`

## 7. ตอน deploy (ผู้ใช้ commit/push เอง)
- ตั้ง **Build variable** `NEXT_PUBLIC_ASSET_HOST=https://assets.roc-library.com` ใน Cloudflare (ฝังตอน Build ถ้าตั้งทีหลังต้อง Build ใหม่)
- ต้อง commit: โค้ด, `public/assets/json/CostumeIndex.json`, `public/assets/images/costume/icons.png`, scripts, GLOSSARY, ADR, plan; **ไม่ commit** `public/assets/costume/` (อยู่ใน `.gitignore`)
- ถ้า push โดยยังไม่ได้อัปโหลด R2 หรือไม่ได้ตั้ง Build variable ตัวละครจะไม่ขึ้น (sprite 404)

## 8. ก่อนเปิดสาธารณะ
ล็อก Member ไว้อย่างน้อย 2 สัปดาห์ ดู R2 → Metrics (Class A/B, storage) เทียบโควตาฟรี (10 GB, 1M Class A, 10M Class B ต่อเดือน) ถ้าจะเปิด ให้ลดคำขอก่อน เช่น ไม่โหลดเอฟเฟกต์จนกว่าจะเปิด /effect
