import { checkFeedback, feedbackConfigured, saveFeedback } from "@/utils/feedbackRecord";
import { clientAddress, createLimiter, json } from "@/server/http";

/** Saves a message from the Feedback page. Open to everyone, so it is limited per address. */
const sends = createLimiter(3, 10 * 60 * 1000);

export async function handleFeedback(request: Request): Promise<Response> {
  if (!feedbackConfigured()) {
    return json({ message: "ระบบรับความคิดเห็นยังไม่ได้ตั้งค่าบนเซิร์ฟเวอร์" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, 400);
  }

  // The hidden field is empty for a person; a bot that fills it gets a quiet "ok" and nothing is saved.
  if (typeof body.website === "string" && body.website !== "") return json({ ok: true });

  if (sends.hit(clientAddress(request))) {
    return json({ message: "ส่งบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" }, 429);
  }

  const input = checkFeedback(body);
  if (!input.ok) return json({ message: input.message }, 400);

  if (!(await saveFeedback(input.value))) {
    return json({ message: "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" }, 502);
  }
  return json({ ok: true });
}
