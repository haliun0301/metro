# Repository Guidelines

## Agent Autonomy

Perform requested actions yourself whenever possible, including starting applications, running commands, and verifying results. Do not ask the user to perform these steps unless access or permissions genuinely prevent you from doing so.

## Project Structure & Module Organization

This repository is a Vite React application for exploring Shenzhen Metro data and stories.

- `App.tsx`, `index.tsx`, and `index.css` define the application shell and global styling.
- `components/` contains reusable UI, grouped by feature (`metro-stations/`, `metro-people/`, `metro-city/`, and `diagrams/`).
- `pages/` contains route-level views such as station and person detail pages.
- `data/` contains typed station, route, area, topic, and people-story content; keep content changes here rather than in components.
- `services/` contains external integrations.
- `public/` contains static images and map assets; `archive/` stores retired experiments.

## Redesign Direction

The planned work is a design re-innovation of the existing interactive storytelling website, not a rebuild or conceptual redesign. 

Preserve the existing concept, routes, research structure and data, visualizations, maps, and core interactions. Improve visual quality, information hierarchy, consistency, navigation, storytelling, and interaction quality within the current product. The experience should feel like a contemporary, spatial, editorial, immersive, human, and data-driven urban research exhibition—not a generic transit app, dashboard, or unrelated concept.

Keep the three research sections and their existing purposes:

- **Metro & Stations:** explore the network, stations, surrounding areas, and related research stories.
- **Metro & People:** explore demographic and occupation data, patterns, individual profiles, and stories.
- **Metro & City:** explore thematic locations, research themes, interview evidence, and urban impacts.

Approach redesign work systematically across content and information hierarchy, layout, brand and visual system, typography, components, imagery, and motion. Keep changes responsive, accessible, consistent, and performant. Do not begin redesign implementation until the user explicitly says **“start building.”**

## Build, Test, and Development Commands

Run these commands from the repository root:

```bash
npm install       # install dependencies
npm run dev       # start the Vite development server
npm run build     # create a production build in dist/
npm run preview   # serve the production build locally
```

There is currently no test runner, formatter, or linter configured in `package.json`. At minimum, run `npm run build` before submitting UI or TypeScript changes.

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Follow the existing two-space indentation and single-quote style where practical. Name components and pages in `PascalCase` (for example, `MetroMapPage.tsx`), hooks with a `use` prefix, and utilities/services in `camelCase`. Keep feature-specific code in its existing directory and prefer typed data structures over untyped objects. Reuse the established Tailwind/CSS patterns rather than introducing a new styling system.

## Testing Guidelines

No automated tests or coverage thresholds are configured. For changes, manually verify the affected route in `npm run dev`, exercise map interactions and language toggles when relevant, and confirm `npm run build` succeeds. If tests are added, place them near the related feature and use descriptive names such as `MetroMapPage.test.tsx`.

## Commit & Pull Request Guidelines

Existing commits are short and feature-oriented (for example, `Metro people page update`). Use an imperative, specific subject such as `Add station detail media panel`; keep unrelated changes in separate commits. Pull requests should explain the user-visible change, identify affected routes or data files, include validation steps, and attach screenshots or recordings for visual changes. Mention any required environment variables.

## Security & Configuration Tips

Keep API keys out of Git and never hard-code credentials. Treat data and image additions as user-facing content and verify paths under `public/` before referencing them.
