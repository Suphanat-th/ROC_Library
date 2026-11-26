/**
 * AWS Signature Version 4 for the S3-compatible API of Cloudflare R2, with node's own crypto (no dependency).
 * Used by scripts/upload-costume.mjs. Every header passed in is signed.
 */
import { createHash, createHmac } from "node:crypto"

export const sha256Hex = (data) => createHash("sha256").update(data).digest("hex")
const hmac = (key, data) => createHmac("sha256", key).update(data).digest()

/** Encodes one path segment the way S3 wants it (the unreserved characters stay). */
const encodeSegment = (segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)

export const encodePath = (path) => path.split("/").map(encodeSegment).join("/")

/**
 * @param {{ method: string, path: string, query?: string, headers: Record<string, string>, payloadHash: string,
 *           date: Date, region: string, service: string, accessKeyId: string, secretAccessKey: string }} request
 *   `path` is already encoded (see encodePath); `headers` must include `host`.
 * @returns {{ authorization: string, amzDate: string, signature: string }}
 */
export function signRequest({ method, path, query = "", headers, payloadHash, date, region, service, accessKeyId, secretAccessKey }) {
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const day = amzDate.slice(0, 8)
  const lowered = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v).trim().replace(/\s+/g, " ")]))
  const names = Object.keys(lowered).sort()
  const canonicalHeaders = names.map((n) => `${n}:${lowered[n]}\n`).join("")
  const signedHeaders = names.join(";")
  const canonical = [method, path, query, canonicalHeaders, signedHeaders, payloadHash].join("\n")
  const scope = `${day}/${region}/${service}/aws4_request`
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256Hex(canonical)].join("\n")
  const kDate = hmac(`AWS4${secretAccessKey}`, day)
  const key = hmac(hmac(hmac(kDate, region), service), "aws4_request")
  const signature = createHmac("sha256", key).update(toSign).digest("hex")
  return {
    amzDate,
    signature,
    authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  }
}
