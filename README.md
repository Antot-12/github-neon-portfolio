
# 🚀 GitHub Neon Portfolio

A personal project that turns your public GitHub repositories into a portfolio website.  

![App screenshot](./preview.png)


---

## 📖 Table of contents

- [🚀 GitHub Neon Portfolio](#-github-neon-portfolio)
- [📖 Table of contents](#-table-of-contents)
- [🌟 Features](#-features)
  - [Analytics Dashboard](#analytics-dashboard)
  - [About Page](#about-page)
  - [Projects grid](#projects-grid)
  - [Sidebar overview](#sidebar-overview)
  - [Keyboard shortcuts](#keyboard-shortcuts)
- [🛠 Tech stack](#-tech-stack)
- [📦 Getting started](#-getting-started)
  - [1. Clone the repo](#1-clone-the-repo)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Run in development](#4-run-in-development)
  - [5. Build for production](#5-build-for-production)
- [🌐 Deploying to GitHub Pages](#-deploying-to-github-pages)
- [📁 Project structure](#-project-structure)
- [⚙️ GitHub API & caching](#️-github-api--caching)
- [🎨 Design & UX details](#-design--ux-details)

---

## 🌟 Features

### Analytics Dashboard

The `/analytics` page provides comprehensive insights into your GitHub portfolio:

- 📊 **Overview Cards**:
  - Total Lines of Code (estimated)
  - Total Stars across all repos
  - Languages Used (unique count)
  - Total Repositories
  
- 📈 **Interactive Charts**:
  - Language Distribution pie chart
  - Repository Growth Timeline with cumulative tracking
  - Activity Frequency heatmap (last 12 months)
  - Technology Radar showing your main tech stack
  - Project Categories breakdown (Web Apps, CLI Tools, Libraries, etc.)
  
- 🎯 **Advanced Features**:
  - Date range filters (7/30/90/180 days, 1 year, all time)
  - Language filters
  - Chart type toggles (bar/line/area)
  - Repository health metrics
  - Growth trends analysis
  
- 🏆 **Achievements System**:
  - Unlock badges based on coding milestones
  - Track progress across multiple achievement categories
  - Code-focused achievements (commits, languages, active maintenance)

### About Page

The `/about` page showcases your developer profile:

- 👤 **Personal Information**:
  - Profile photo with hover animations
  - Developer bio and tech stack
  - Current status and availability
  
- 🎯 **Interactive Elements**:
  - Clickable skills to filter projects
  - Timeline years link to project filters
  - Collapsible keyboard shortcuts section
  - Pulsing LinkedIn call-to-action
  
- 📊 **GitHub Insights**:
  - Real-time repository statistics
  - Language distribution mini-chart
  - Contribution streak tracking
  - Pinned projects with star counts and tooltips
  
- 🗓️ **Development Timeline**:
  - Personal coding journey by year
  - Animated scroll-triggered entries
  - Now/Next/Later roadmap cards

### Projects grid

The main `/` page shows all your public repos as cards:

- 🧱 **Neon repo cards** with:
  - Name, full name (`owner/name`)
  - Description
  - Language chip
  - Small **commits** chip
  - Stats row: ⭐ stars, 🍴 forks, 👁️ watchers, 🐞 open issues
  - Activity badge:
    - `Active` (updated ≤ 14 days)
    - `Recently updated` (≤ 60 days)
    - `Legacy` (older repos)
  - “Live preview” link if repo has `homepage` set
- 🖼 **Preview image** using GitHub OpenGraph  
- 🏷 Top GitHub **topics** rendered as neon chips
- 🎯 **Click on topic** on a card → filters the main list by this tag

Other grid features:

- 🔍 Text search by repo **name / description**
- 🧪 Filters:
  - by **language**
  - by **tag/topic**
- 🔁 Sorting:
  - `Newest`
  - `Oldest`
  - `Most commits`
  - `Fewest commits`
- 📄 Pagination with page number stored in URL & localStorage:
  - You can open a repo, go back, and stay on the same page & filters

---

### Sidebar overview

On the right side of the list page there is a sticky **Overview** panel with:

- 📦 Total repositories (with “since YEAR”)
- ⭐ Total stars + average stars per repo
- 🧾 Total commits + average commits per repo
- ⚡ Repos active in the last 30 days
- 🏆 Top starred repo (name + stars, clickable)
- 🕒 Latest updated repo (name + date, clickable)
- 🌐 Tech profile:
  - Primary language
  - Total languages used
- 🧮 Language breakdown:
  - Up to 4 top languages with percentage bars
  - Bars are clickable: click a language → apply language filter

This gives a quick “portfolio overview” of what you actually build.

---

### Keyboard shortcuts

To make the app feel more “developer friendly”, the following shortcuts are supported on the **projects list** page:

* `/` - focus the **Search** input (like GitHub / VS Code)
* `Esc` - clear the search text
* `←` / `→` - go to **previous / next page** in pagination
* `j` / `k` - move selection between cards (optionally highlight the active card / scroll it into view)

These shortcuts make browsing many repositories much faster once you get used to them.

---

## 🛠 Tech stack

* ⚛️ **React** (SPA)
* ⚡ **Vite** (dev server + build)
* 🎨 **Material UI (MUI)** for UI components and theming
* 🧭 **React Router** for navigation
* 🧠 **React Context** (`GithubContext`) for sharing GitHub data
* 📝 **react-markdown** + `remark-gfm` + `rehype-raw` for README rendering
* 📊 **Recharts** for charts and data visualizations
* 🎬 **framer-motion** for transitions and micro-animations
* 🔧 **dotenv** for environment configuration

---

## 📦 Getting started

### 1. Clone the repo

```bash
git clone https://github.com/Antot-12/github-neon-portfolio.git
cd github-neon-portfolio
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Configure environment variables

Create a `.env` file in the project root (next to `package.json`):

```bash
cp .env.example .env
```

Then open `.env` and set:

```env
VITE_GITHUB_USERNAME=your-github-username
VITE_GITHUB_TOKEN=your_personal_access_token
```

* `VITE_GITHUB_USERNAME` - which GitHub user’s public repositories to display
* `VITE_GITHUB_TOKEN` - optional **Personal Access Token** (no special scopes needed, `read-only` is fine).
  This increases rate limits above the default 60 requests/hour.

### 4. Run in development

```bash
npm run dev
# or
yarn dev
```

Open the dev server URL (usually `http://localhost:5173`).

### 5. Build for production

```bash
npm run build
npm run preview
```

* `npm run build` → generates optimized static files in `dist`
* `npm run preview` → serves the built app locally

---

## 🌐 Deploying to GitHub Pages

One simple way to deploy:

1. Push this repo to GitHub
2. In the repository **Settings → Pages**, choose **Source**: GitHub Actions or `gh-pages` branch
3. If the app is served from a subpath (e.g. `/github-neon-portfolio`), set `base` in `vite.config.js`:

```js
export default defineConfig({
  base: '/github-neon-portfolio/',
  // ...
})
```

---

## 📁 Project structure

Rough overview of the main files:

```txt
github-neon-portfolio/
├─ public/
│  ├─ repos.json                # Pre-fetched GitHub data (generated by fetch-repos.mjs)
│  ├─ no_image.jpg              # Fallback preview for repo cards
│  └─ preview.png               # Screenshot used in README
├─ scripts/
│  └─ fetch-repos.mjs           # Script to fetch and cache GitHub data
├─ src/
│  ├─ App.jsx                   # App shell, header, routes
│  ├─ main.jsx                  # React entry point
│  ├─ GithubContext.jsx         # GitHub data loading with caching
│  ├─ index.css                 # Global styles (body, scrollbar, markdown)
│  ├─ components/
│  │  ├─ RepoCard.jsx           # Single repo card with metrics & links
│  │  ├─ RepoGrid.jsx           # Animated grid of cards
│  │  ├─ RepoFilters.jsx        # Search, filters, sort UI
│  │  ├─ SidebarStats.jsx       # Overview stats sidebar on list page
│  │  ├─ ScrollProgressBar.jsx  # Global scroll progress bar
│  │  ├─ TechStackVisualization.jsx  # Technology Radar & Project Categories
│  │  ├─ ContributionTimeline.jsx    # Repository creation timeline
│  │  ├─ Achievements.jsx            # Achievement badges system
│  │  ├─ AnalyticsControls.jsx       # Filters for analytics page
│  │  ├─ GrowthMetrics.jsx           # Growth trend analysis
│  │  ├─ RepositoryHealth.jsx        # Health score metrics
│  │  ├─ LoadingOverlay.jsx     # Fullscreen loading spinner + text
│  │  └─ ErrorOverlay.jsx       # Fullscreen error message
│  ├─ pages/
│  │  ├─ RepoListPage.jsx       # Main projects page (grid + filters + stats)
│  │  ├─ RepoDetailPage.jsx     # Detail page with README + overview + TOC
│  │  ├─ AboutPage.jsx          # About page with profile & timeline
│  │  └─ AnalyticsDashboard.jsx # Analytics dashboard with charts
│
├─ .env.example                 # Sample env variables
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## ⚙️ GitHub API & caching

### Data fetching strategy

The portfolio uses a **pre-build fetch** strategy for optimal performance:

#### Build-time data generation

`scripts/fetch-repos.mjs` runs before each build (`prebuild` script):

* Fetches all repositories from GitHub API:
  ```txt
  https://api.github.com/users/:username/repos?per_page=100&sort=updated
  ```

* For each repository, fetches commit count:
  ```txt
  https://api.github.com/repos/:owner/:repo/commits?per_page=1
  ```
  - Extracts total from `Link` header's `rel="last"` page number
  - Falls back to array length if pagination unavailable

* Saves complete data to `public/repos.json` (75+ repos with full metadata)

* To update the database manually:
  ```bash
  node ./scripts/fetch-repos.mjs
  ```

#### Runtime behavior

`GithubContext.jsx`:

* Loads pre-generated `repos.json` from `/public` (no API calls at runtime)
* Implements 15-minute localStorage cache with versioned cache key
* Provides `refresh()` method for manual cache invalidation
* Normalizes data structure for consistent component usage

#### Data structure

Each repository includes:

#### Data structure

Each repository includes:

  * `id`, `name`, `full_name`, `description`, `html_url`
  * `language`, `topics`
  * `stargazers_count`, `forks_count`, `open_issues_count`, `watchers_count`
  * `created_at`, `updated_at`, `pushed_at`
  * `homepage`
  * `commitsCount` (approximate total commits)
  * `ownerLogin`
  * `size`

### Benefits of this approach

* **Zero API calls** during user browsing (instant page loads)
* **No rate limits** for end users
* **Consistent data** across all sessions
* **Build-time optimization** - data fetching happens once per deployment
* **Offline-capable** - works without GitHub API access after build

---

## 🎨 Design & UX details

Some notable UX details:

* Global dark background: `#0f151c`

* Neon main color: `#22d3ee`

* Flat cards with slight blur & shadows

* Custom scrollbar:

  ```css
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #22d3ee;
    border-radius: 999px;
  }
  ```

* `markdown-body` class for README with:

  * Better heading spacing
  * Styled code & pre blocks
  * Styled blockquotes
  * Responsive images with rounded corners and borders

* Motion:

  * Repo cards fade + slide in via **framer-motion**
  * Grid changes are animated with `AnimatePresence`
  * Detail page sections also animate slightly on mount

---
