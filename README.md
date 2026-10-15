# 🗳️ Sonnaanga... Senjaangala (சொன்னாங்க... செஞ்சாங்களா) — TVK Promise Tracker

> **"சொன்னாங்க... செஞ்சாங்களா?"** — *"Did they keep their word?"* An independent, non-partisan, citizen-driven ledger tracking the election promises made by the newly elected **Tamilaga Vettri Kazhagam (TVK)** government in Tamil Nadu (elected in 2026), led by Chief Minister C. Joseph Vijay.

---

## 📌 Project Overview

**Sonnaanga... Senjaangala** is an interactive, transparent tracking dashboard designed to foster civic engagement and hold elected representatives accountable to their manifesto commitments. Every single promise on this platform is sourced directly from the official **TVK 2026 Election Manifesto** and updated exclusively based on publicly verifiable evidence.

This application provides a visual and data-driven view of government performance across various administrative sectors (such as transport, healthcare, education, welfare, and labour), giving citizens, researchers, and journalists an objective source of truth.

---

## ✨ Core Features

*   📊 **Bento-Grid Dashboard (`BentoStats`)**: High-fidelity landing page displaying aggregate statistics, progress counts, and dynamic visualizations of promise statuses.
*   📈 **Evidence Tiers & Verification**: Progress tracking backed by verifiable sources classified into three strict credibility levels.
*   🕒 **Chronological Timelines**: Complete interactive timelines displaying every official government order (GO) or press release associated with a promise.
*   🏷️ **Sectoral Filtering**: Browse promises grouped by sectors (e.g., Women & Transport, Healthcare, Education, Welfare) with harmonious, color-coded categories.
*   📢 **Manifesto Ticker (`ManifestoTicker`)**: A sleek, animated ticker featuring core commitments to keep key promises front and center.
*   ✍️ **Citizen Evidence Submission**: A dedicated contribution portal (`/submit`) allowing citizens to submit new evidence, articles, or Gazette orders to suggest tracking updates.

---

## 🔍 Methodology & Evidence Tiers

To maintain absolute objectivity, the status of each promise is updated based on a strict three-tier verification standard:

| Tier | Type | Description |
| :--- | :--- | :--- |
| **Tier 1** | **Official Gazette & GOs** | Government Orders (GOs), official gazette notifications, and assembly-passed legislative bills. *(Highest reliability)* |
| **Tier 2** | **Govt Press Releases** | Official announcements issued directly by the Chief Minister's Office (CMO) or government departments. |
| **Tier 3** | **Credible News & Wires** | Published investigative reports, articles, and coverage from reputable wire agencies (PTI, UNI) and national/state news outlets. |

---

## 🚦 Promise Statuses

Promises transition through the following lifecycle states based on verified evidence:

*   ⚪ **Pending (`pending`)**: The default state. The promise has not yet had any active government orders, budget allocations, or implementation efforts initiated.
*   🔵 **In Progress (`in-progress`)**: Active movement exists—a cabinet approval has been declared, a study committee appointed, or planning/guidelines are officially underway.
*   🟢 **Fulfilled (`fulfilled`)**: The promise has been completely executed. The official Government Order is out, and the physical rollout/disbursal has verified benefits reaching the citizens.
*   🔴 **Evaded (`evaded`)**: The promise has been officially scrapped, delayed indefinitely, or watered down to the extent of violating the original manifesto spirit.

---

## 🛠️ Root Database & Maintenance Scripts

The repository comes equipped with a suite of Node.js automation and maintenance scripts in the root directory. These scripts process raw data, apply citizen research, update statuses, and structure the database file (`data/promises.json`).

| Script Name | Environment | Purpose / Functionality |
| :--- | :--- | :--- |
| **`update_colors.cjs`** | Node.js (CommonJS) | Reads through the database and dynamically normalizes sector colors to ensure a cohesive visual theme across all web UI elements. |

---

## 💻 Tech Stack

*   **Framework**: [Next.js 16.2.6](https://nextjs.org/) (utilizing App Router)
*   **Library**: [React 19.2.4](https://react.dev/)
*   **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/) (using `@tailwindcss/postcss`)
*   **Database**: Localized JSON file (`data/promises.json`) for zero-overhead, highly performant static data retrieval.
*   **UI Components**: Radix UI Primitives, Lucide Icons, and bespoke custom cards.
*   **Animations**: Framer Motion for buttery-smooth visual transitions and micro-interactions.
*   **Charts**: Recharts for dynamic donut graphs and interactive tracking visuals.
*   **Auth**: Next-Auth v4 for administrative verification and secure logging.

---

## 🚀 Getting Started

### 📋 Prerequisites

*   Node.js (v18.x or v20.x recommended)
*   npm or yarn

### 🔧 Installation & Setup

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/yourusername/tamilnadu-promise-tracker.git
   cd tamilnadu-promise-tracker
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard.

### 🏗️ Build & Production

To build a production-optimized version of the dashboard:
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router pages, layout, and global styles
│   ├── about/            # Project vision, FAQ, and methodology
│   ├── api/              # API endpoints for authentication and submissions
│   ├── promises/         # Promises directory and dynamic slug pages ([slug])
│   ├── sectors/          # Sectoral breakdown views and category listings
│   ├── submit/           # Citizen contribution and evidence submission page
│   ├── updates/          # Chronological update timeline of executive orders
│   ├── globals.css       # Custom Tailwind CSS v4 design tokens and layouts
│   └── layout.tsx        # Common shell, including Navbar, Footer, and fonts
├── components/           # Reusable React components
│   ├── auth/             # Session provider wrappers
│   ├── home/             # Landing page components (Hero, Stats, Timeline)
│   ├── layout/           # Shared Navigation and Footer layouts
│   ├── promise/          # Promise-specific details, tier badges, and timelines
│   ├── promises/         # Group list renderers and sidebar filters
│   ├── shared/           # Generic badges, charts, countdowns, and disclaimer
│   └── ui/               # Base design system components (buttons, dialogs, etc.)
├── data/                 # JSON Database
│   └── promises.json     # Primary ledger containing the structured data
├── lib/                  # Helper utilities and shared helper code
├── types/                # TypeScript type declarations
└── package.json          # Node dependencies and project run scripts
```

---

## 🤝 Contribution Guidelines

We welcome citizen contributions to help keep the tracker fully up-to-date:

1.  **Spot a change?** If a promise's status has shifted, or if there is new evidence, head over to the `/submit` page.
2.  **Provide Verifiable Links**: Every suggestion *must* include a URL to a Tier 1 (Gazette/GO), Tier 2 (Government Release), or Tier 3 (Reputed Media) source. Submissions without verifiable links will not be merged.
3.  **Run Maintenance Scripts**: If you are modifying the raw dataset directly or introducing new promises, use the appropriate utility script in the root directory (e.g. `node update_colors.cjs`) to format and validate the JSON.

---

## ⚖️ Disclaimer

**Sonnaanga... Senjaangala** is strictly an independent, non-partisan citizen-led initiative. We are not affiliated with, endorsed by, or connected to the Government of India, the Government of Tamil Nadu, the Tamilaga Vettri Kazhagam (TVK), or any political party. All tracking information is updated in good faith using publicly available, cited sources.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute for civic, educational, or research purposes.


