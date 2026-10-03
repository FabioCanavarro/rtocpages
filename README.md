# A Regressor's Tale of Cultivation • Web Reader

>  **Note**: This is a **vibecoded site** built for *A Regressor's Tale of Cultivation* (회차진행자: 회귀자의 신선기).

A sleek, fast, and feature-rich web novel reader modeled after `beyonder.pages.dev`, featuring full offline EPUB support, 3D novel cover tilt animations, customizable Xianxia & Catppuccin Mocha color palettes, and cookie-based reading progress synchronization.

---

## Features

- **3D Novel Cover Tilt**: Interactive card with mouse parallax and smooth `anime.js` entrance animations.
- **Catppuccin Mocha & Cultivation Palettes**:
  - Catppuccin Mocha (Pastel dark theme)
  - Cultivation Dark (Emerald Jade & Qi Gold)
  - Ink Scroll (Sepia Parchment)
  - Celestial Ether (Midnight Star)
  - Obsidian Flame (Volcanic Regressor)
  - Bamboo Zen (Light Teal)
- **Cookie-Based Progress Sync (`rtoc_settings_v1` & `rtoc_progress_v1`)**:
  - Automatically saves active palette, font size, font family, line height, reader width, last read chapter, scroll position, completed chapters, and bookmarks into browser cookies.
  - Export and import JSON backup support.
- **Book Directory Dashboard (`/book`)**:
  - Complete chapter directory (869 chapters) with search filtering and bookmark/completion toggles.
- **Offline EPUB Download**:
  - Direct download button for `A_Regressors_Tale_of_Cultivation.epub` (9.43 MB).

---

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Vanilla CSS Variables & Tailwind CSS
- **Animations**: `anime.js` (v4)
- **Storage**: `js-cookie`
- **Analytics**: `@vercel/analytics`

---

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License & Credits

*Novel Content & Original Art*: **Pluto (해날)**
*Reader Website*: Built with AI assistance (Vibecoded).
