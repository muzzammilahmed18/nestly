# Nestly — Case Study

## The problem
Booking a short-term stay is a two-sided marketplace problem: hosts need a simple way to list a space and manage bookings without ever double-booking the same dates to two different guests; guests need to search, filter, and book with real confidence their reservation is secured, not just "probably" available. Most simple booking demos skip the hard part — actually preventing conflicting bookings — and just assume it away. Nestly doesn't.

I built Nestly to practice the full real-world stack this problem requires: a genuine relational database, real role-based permissions across three account types, and backend logic that has to be actually correct, not just happy-path functional.

## Tech choices, and why
* **React + Vite + Tailwind** — I'd already built a full production app with this stack, so I could put my limited time into what was genuinely new here rather than relearning frontend basics.
* **PostgreSQL + Prisma** — Listings-and-Bookings is a real one-to-many relational problem, and Postgres is the natural fit for that. Prisma made working with real SQL migrations and relations far more approachable than raw SQL would have been on a tight timeline.
* **JWT auth with an embedded role** — GUEST / HOST / ADMIN is baked directly into the token payload, so every protected route can check both session validity and permissions in one pass.
* **Cloudinary for photo uploads** — Instead of storing files on the backend's own disk, the browser uploads directly to Cloudinary and only the resulting URL ever touches my database.
* **Recharts for the Host dashboard** — It cost no extra ramp-up time while still delivering real, useful visualizations (bookings by listing, revenue over time, booking status breakdown).

## The hardest challenge: preventing double-bookings
**The core risk:** Two guests trying to book overlapping dates on the same listing at nearly the same moment. If my code checked "are these dates free?" and then, as a separate step, created the booking, two requests arriving milliseconds apart could both pass the availability check before either booking actually existed in the database yet — silently double-booking the same listing.

**How I solved it:** I wrapped the availability check and the booking creation inside a single Prisma database transaction (`prisma.$transaction(...)`), so the whole "check, then create" sequence executes as one atomic unit. The overlap logic itself checks whether one date range starts before the other ends, in both directions:
```javascript
checkIn: { lt: checkOutDate },
checkOut: { gt: checkInDate },
```
If a conflicting CONFIRMED booking already exists, the transaction throws before ever creating the new one, and the API returns a `409` conflict — not a silent failure.

**What I'd do with more time:** This transaction-based approach significantly narrows the race window, but it isn't a mathematically airtight guarantee under extreme concurrent load at scale. A fully bulletproof solution would add a Postgres exclusion constraint (`EXCLUDE USING gist`) directly at the database schema level. I made a deliberate scope call to ship the transaction-based version given the project timeline.

## What I'd tell another developer building this
1. **Role-based permissions are two checks, not one.** It's not enough to ask "is this a Host?" — you also have to ask "is this *their* listing?" I had to go back and add ownership checks (`listing.hostId === req.userId`) to every write route.
2. **Environment variables only apply to the build they're set before.** I hit this issue deploying my previous project too — an env var correctly saved in the dashboard doesn't retroactively apply to an already-built deployment; you have to trigger a genuinely fresh build after setting it.
3. **Client-side uploads to a third-party service (Cloudinary) simplify the backend a lot.** My server never has to touch a file at all, only the URL, which sidesteps an entire category of disk storage problems.

## Live links
* **App:** [PASTE YOUR VERCEL URL]
* **Frontend code:** [PASTE YOUR GITHUB LINK]
* **Backend code:** [PASTE YOUR GITHUB LINK]