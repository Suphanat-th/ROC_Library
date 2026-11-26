# Member sign-in runs in the browser against Supabase Auth

Members need a way into Patch Convert that does not depend on the weekly Patch key or the shared Member key. We use Supabase Auth, already the site's database provider, with email and password, invites only (sign-up closed), and the browser talks to Supabase directly. The site's Worker is used only for three things: looking up the email for a username at the moment of signing in, and the owner's invite, list and remove actions. Page views never go through the Worker, so signing in does not use the free plan's 100,000 Worker requests per day. The password is stored by Supabase as a hash and the session token (JWT) lives in the Member's browser, not in the database.

Considered options:
- Worker checks the session on every page: rejected, it turns free static pages into counted Worker requests and adds nothing for data that is not secret.
- Email-only sign-in (no username): rejected by the owner, who wants players to choose a username; the cost is one short Worker lookup per sign-in.
- Sign-in with Facebook/Discord/Google: rejected, needs an OAuth app per provider and redirect URLs on every domain, for a handful of Members.
- Send invites from Cloudflare: not possible on the free plan, which can only email the account owner's verified addresses; instead Supabase sends through a free transactional email service on our own domain.

## Consequences

- The gate is only as strong as the browser. The Patch Convert tool and its data still ship to every visitor, the same limit the Cloudflare migration already accepted for the Patch key. This is accepted because the data is not secret; real protection would mean serving the data from the server only to signed-in Members, a larger change.
- The email service needs the domain's DNS (SPF/DKIM) set in Cloudflare and a Supabase SMTP setting; Supabase's built-in email is limited to the team's own addresses and 2 emails an hour.
- Sign-in is its own page at `/member/login`. Invite links must land on a `/member/...` page on `www.roc-library.com` (and `localhost` for development), listed as redirect URLs in Supabase; the `*.workers.dev` address cannot share a session with it.
- The owner needs a Supabase service key in the Worker for the Member admin page; it is a secret like the others and never shipped to the browser.
- A free Supabase project pauses after about a week without activity; while paused, nobody can sign in.
- The Member key stays valid until Members have moved over; removing a Member does not change it.
