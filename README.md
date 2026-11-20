# Lima Nada support page

Fundraising page for Yayasan Pendidikan Musik Lima Nada (home of Sanggar Musik Inklusi WAKTRA), Denpasar.
Vite + React + Tailwind v4 + shadcn/ui + Motion. Bilingual (ID/EN), with the WhatsApp giving form.

Three redesign concepts share one content file (`src/content.ts`) and one giving form (`src/shared`):

| Concept | Folder | Idea |
|---|---|---|
| A · Partitur | `src/concepts/a` | Editorial score on bone paper; a five-line staff draws and the five pillar notes land on it |
| B · Panggung Malam | `src/concepts/b` | Dark stage; canvas particles form five pillars, then one sound wave on scroll |
| C · Lima Warna | `src/concepts/c` | Bright and tactile; five playable bars (pentatonic notes), bento programmes |

```bash
npm install
npm run dev:c        # live dev server for one concept
npm run build:c      # production build to dist/ (deploy this folder)
```

`prototype-v1.html` is the original prototype, kept for reference.
