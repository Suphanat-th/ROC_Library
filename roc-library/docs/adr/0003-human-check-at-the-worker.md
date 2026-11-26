# The Human check is verified at the Worker, not by Supabase

Member sign-in and "forgot password" are open to bots, and every attempt can cost database work (the username lookup) or an email. We put Cloudflare Turnstile on both forms and verify the token in the Worker (`src/server/turnstile.ts`) before anything else, so a request without a passed check never touches the database. "Forgot password" therefore moves from the browser calling Supabase directly to a Worker action (`forgot`), the fourth thing the Worker does for Members. The check fails closed: if Cloudflare cannot confirm it, or the secret is missing in production, the request is refused.

Considered options:
- Supabase's own Captcha protection (Authentication > Attack Protection): rejected. Supabase verifies the token on every password sign-in, so the Worker could not verify it first (a token works once), and a bot would still make the Worker look up the username before Supabase refused it. It would close the direct-call hole below, but costs the database work we are trying to avoid.
- Only a Cloudflare Rate Limiting rule: kept as well (already set by the owner), but it limits by address and does not tell a person from a bot using many addresses.
- Nothing extra, relying on Supabase's own limits: rejected by the owner, who fears bots.

## Consequences

- Anyone holding the public Supabase anon key can still call Supabase's password-reset directly and bypass the Human check. Supabase limits that per email address, so it is accepted; the way to close it is the Supabase option above, at the price described.
- Sign-in also stops asking Supabase on every `/patch-convert` visit: the device trusts its stored session, and a suspended or removed Member is cut off when the access token (JWT, one hour by default) next renews, so the JWT lifetime in Supabase must not be set long.
- If Turnstile is down, nobody can sign in or ask for a reset until it is back.
- Needs `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a Build variable and `TURNSTILE_SECRET_KEY` as a Worker secret. Without them the check is skipped only outside production.
