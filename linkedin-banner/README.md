# Tripcerto — LinkedIn banner

Static LinkedIn banner options built from the homepage hero (`src/components/Hero.tsx`).

## Use it

Open `index.html` in a browser (double-click is fine — no build, no server).

You get **8 banner directions**, each a live preview at the LinkedIn personal-profile
size. Tune the wave frame, blur, and opacity, then **Download PNG** on any option.

## Sizes

| Target | Dimensions | Notes |
|---|---|---|
| LinkedIn personal profile banner | **1584 × 396 px** (4:1) | What this page produces |
| Export file | 3168 × 792 px PNG (2×) | Sharper on hi-dpi; LinkedIn accepts it |
| LinkedIn Company Page cover | 1128 × 191 px | Not built yet — ask if you want it |

**Safe zones** (toggle in the controls): LinkedIn covers the bottom-left
`568 × 264 px` with the profile photo, and crops the sides on mobile — keep key
text centered.

## The wave

The background is the real `Threads` WebGL shader from
`src/components/Threads.tsx`, rendered **once at a fixed time** so it is fully
static. The `Wave frame` slider scrubs which frozen frame you get; `Wave blur`
softens the shader before export.

## Options

1. **Primary** — the hero headline verbatim, two lines, gold payoff.
2. **Demand** — `Agentic AI for / Qualified Travel Demand`, logo bottom-center.
3. **Demand + top logo** — same copy, logo top-left.
4. **Intent** — `From traveller intent / to qualified demand.`
5. **Direct** — `Qualify travel demand / before the brief.`, logo bottom-right.
6. **Reference hero** — right-aligned wordmark, large demand headline, short body copy.
7. **Reference compact** — same screenshot-inspired structure with less small copy.
8. **Reference minimal** — screenshot mood with only the core message.
