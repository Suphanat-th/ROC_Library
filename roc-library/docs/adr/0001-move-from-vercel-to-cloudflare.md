# Move hosting from Vercel to Cloudflare Pages (static)

The site was paused on Vercel's free plan after reaching about 4M requests in a month, driven by hundreds of small pictures per page (monster pictures, minimaps, map textures) and a spike on patch day. We are moving it to Cloudflare Pages as a static export, where static requests are free and unlimited and exceeding a paid quota never pauses the site. The few server routes that remain (feedback, boss report, bot key) run as Pages Functions on the free plan. Pictures stay beside the site at first; moving them to R2 (the Asset host) is deferred until real traffic shows it is needed.

Considered options:
- Stay on Vercel Pro ($20/month): rejected, it keeps per-request pricing, the cause of the problem.
- Workers + OpenNext on Workers Paid ($5/month): rejected, it depends on OpenNext supporting Next 16 with webpack and React Compiler, and nearly all Tools are client-side anyway.
- Pictures on R2 from the start: deferred, Pages serves them free and R2 would add a custom domain, an upload step and URL rewriting before it is proven necessary.

## Consequences

- The site is a static export: no server rendering, `headers()`, `cookies()` or ISR in pages. The patch-convert page's Key check becomes a small server route (a Function) so the Keys stay secret and are not shipped in the page code; the tool itself still runs in the browser, so the gate only keeps the Keys private, it cannot stop someone editing the page locally.
- Server routes live in Pages Functions and must stay small (free bundle limit); the Bot key page takes its signing key from a secret, falling back to the file only in local development.
- The VIP search is not shipped to production while it is unused.
- The domain is bought only after a trial on the free `pages.dev` address; players will be told the new link then.
- The 306 MB of pictures stays in git for now, so builds and deploys stay heavy until they move to R2.
