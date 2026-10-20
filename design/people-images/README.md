# People image direction

Black-and-white doodles are the single active direction. Style references from the user are pending. Do not generate batches or treat existing doodles as final style approval.

## Paths

- Published avatar: `public/images/people/personNNN/avatar.png`
- Published story image: `public/images/people/personNNN/moment-1.png` (and subsequent numbers)
- Avatar URL: `/images/people/personNNN/avatar.png`, assigned explicitly in `data/metro-people/people.ts` under `profileImage`.
- Story URLs: explicit `items[].image` entries in `data/metro-people/person-stories/personNNN.json`.
- Missing avatar: empty `profileImage.src`; the UI uses a placeholder. Never borrow another person's image.

## Existing provisional assets

- person040: flying-fish doodle avatar and three story drawings.
- person103: coffee-making doodle avatar.
- Remaining 109 people: no assigned avatar, pending references and review.

## Next stages

1. Collect reference images and agree on drawing style, composition, and crop.
2. Define nickname interpretation rules and review a small sample of prompts.
3. Generate and review a small trial.
4. Decide on generation tooling and provenance records before expanding.
5. Publish only explicitly selected assets to the canonical paths.

No generation commands are active at this stage. Earlier human portraits, photographic symbols, occupation templates, scripts, and result logs are preserved in `archive/image-experiments-2026-09-12/` and are not used by the site.
