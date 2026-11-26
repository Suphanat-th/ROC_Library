/**
 * Uploads the Costume simulator's files (made by extract-costume.mjs into public/assets/costume/) to the R2 bucket
 * behind the Asset host, under assets/costume/ (the folder src/utils/costumePack.ts reads). Only files whose
 * content changed since the last upload are sent; what was sent is remembered in dev-data/costume/uploaded.json
 * (gitignored), so an interrupted run carries on where it stopped. Nothing is ever deleted from the bucket.
 *
 *   npx dotenv -e environment/.env.local -- node scripts/upload-costume.mjs [--dry-run] [--force] [--only <prefix>]
 *
 * Needs in environment/.env.local (an R2 API token with "Object Read & Write" on the one bucket):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *
 *   --dry-run  list what would be sent and sent nothing
 *   --force    send everything again, ignoring the remembered list
 *   --only     only keys (under assets/costume/) that start with this text, e.g. "hg/" or "fx/"
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { encodePath, sha256Hex, signRequest } from "./lib/sigv4.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE = path.join(ROOT, "public/assets/costume")
const STATE = path.join(ROOT, "dev-data/costume/uploaded.json")
const PREFIX = "assets/costume/"
const PARALLEL = 8
const ATTEMPTS = 4

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const force = args.includes("--force")
const onlyAt = args.indexOf("--only")
const only = onlyAt >= 0 ? (args[onlyAt + 1] ?? "") : ""

const env = (name) => {
  const value = process.env[name]
  if (!value) {
    console.error(`${name} is not set (see the top of this file).`)
    process.exit(1)
  }
  return value
}
const accountId = dryRun ? "" : env("R2_ACCOUNT_ID")
const accessKeyId = dryRun ? "" : env("R2_ACCESS_KEY_ID")
const secretAccessKey = dryRun ? "" : env("R2_SECRET_ACCESS_KEY")
const bucket = dryRun ? "" : env("R2_BUCKET")
const host = `${accountId}.r2.cloudflarestorage.com`

const TYPES = { ".tga": "image/x-tga", ".bmp": "image/bmp", ".str": "text/plain", ".png": "image/png" }
/** A day in the browser; the Cache rule of the Asset host keeps files longer at Cloudflare. */
const CACHE_CONTROL = "public, max-age=86400"

function listFiles(dir, base = "") {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const key = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) found.push(...listFiles(path.join(dir, entry.name), key))
    else found.push(key)
  }
  return found
}

if (!fs.existsSync(SOURCE)) {
  console.error(`${SOURCE} does not exist; run scripts/extract-costume.mjs first.`)
  process.exit(1)
}

const state = !force && fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {}
const saveState = () => {
  fs.mkdirSync(path.dirname(STATE), { recursive: true })
  fs.writeFileSync(STATE, JSON.stringify(state))
}
process.on("SIGINT", () => {
  saveState()
  console.log("\nstopped; run again to carry on")
  process.exit(130)
})

async function put(key, body, hash) {
  const objectPath = encodePath(`/${bucket}/${PREFIX}${key}`)
  const type = TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream"
  let lastError
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const now = new Date()
      const headers = { host, "x-amz-content-sha256": hash, "x-amz-date": now.toISOString().replace(/[:-]|\.\d{3}/g, "") }
      const { authorization } = signRequest({
        method: "PUT",
        path: objectPath,
        headers,
        payloadHash: hash,
        date: now,
        region: "auto",
        service: "s3",
        accessKeyId,
        secretAccessKey,
      })
      const res = await fetch(`https://${host}${objectPath}`, {
        method: "PUT",
        headers: { ...headers, authorization, "content-type": type, "cache-control": CACHE_CONTROL },
        body,
      })
      if (res.ok) return
      lastError = new Error(`${res.status} ${(await res.text()).slice(0, 200)}`)
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }
  throw new Error(`${key}: ${lastError?.message ?? lastError}`)
}

const keys = listFiles(SOURCE).filter((key) => key.startsWith(only))
const queue = []
let unchanged = 0
for (const key of keys) {
  const body = fs.readFileSync(path.join(SOURCE, key))
  const hash = sha256Hex(body)
  if (state[key] === hash) unchanged++
  else queue.push({ key, body, hash })
}
const bytes = queue.reduce((sum, item) => sum + item.body.length, 0)
console.log(`${keys.length} files; ${queue.length} to send (${(bytes / 1e6).toFixed(0)} MB), ${unchanged} unchanged`)
if (dryRun) {
  for (const { key } of queue.slice(0, 20)) console.log("  ", key)
  if (queue.length > 20) console.log(`   … and ${queue.length - 20} more`)
  process.exit(0)
}

let done = 0
const failed = []
async function worker() {
  while (queue.length > 0) {
    const item = queue.pop()
    try {
      await put(item.key, item.body, item.hash)
      state[item.key] = item.hash
      done++
      if (done % 100 === 0) {
        saveState()
        console.log(`  ${done} sent`)
      }
    } catch (error) {
      failed.push(error.message)
    }
  }
}
await Promise.all(Array.from({ length: PARALLEL }, worker))
saveState()
console.log(`sent ${done}, failed ${failed.length}`)
for (const message of failed.slice(0, 10)) console.log("  ", message)
if (failed.length > 0) process.exit(1)
