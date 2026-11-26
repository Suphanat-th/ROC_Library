/** Rules for a Member's username and password. Shared by the sign-in pages and the Worker. */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

const USERNAME_PATTERN = /^[a-z0-9_]+$/;

/** A username is lowercase letters, digits and underscore, 3 to 20 long. Capitals typed are folded to lowercase. */
export const normalizeUsername = (value: string) => value.trim().toLowerCase();

/** Returns the Thai problem with a (normalized) username, or null when it is fine. */
export function usernameProblem(username: string): string | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `username ต้องยาว ${USERNAME_MIN}-${USERNAME_MAX} ตัวอักษร`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "username ใช้ได้เฉพาะตัวอักษรอังกฤษ ตัวเลข และ _";
  }
  return null;
}

/** Returns the Thai problem with a new password, or null when it is fine. */
export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `รหัสผ่านต้องยาวอย่างน้อย ${PASSWORD_MIN} ตัวอักษร`;
  if (password.length > PASSWORD_MAX) return `รหัสผ่านยาวเกิน ${PASSWORD_MAX} ตัวอักษร`;
  return null;
}

/** Only a path on this site may be the place to go after signing in; anything else falls back to the home page. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}
