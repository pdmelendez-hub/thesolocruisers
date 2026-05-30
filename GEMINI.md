# Gemini CLI Project Instructions: The Solo Cruisers

This file provides context and instructions for Gemini CLI when working on thesolocruisers.com.

## Project Context
- **Framework:** Astro 4
- **Branches:**
  - **live**: `main` (Maintenance / Coming-soon page).
  - **prototype**: `dev` (Full redesigned editorial site).
- **Core Status:** Refer to `STATUS.md` for current branding and next steps.

## Workflow Rules
- **Authority:** Pre-approved for project access, deep research, and casual look-ups across all sites.
- **Co-Engineering:** I work alongside Claude (Primary). I should read `CLAUDE.md` for session handoffs and update it (or a `SESSION-*.md` file).
- **Risk Assessment:** PRIOR to committing any changes, perform a quick risk assessment of potential breaking points.
- **Deletion Policy:** NO authority to delete files. ALWAYS ask for permission before deleting any file.
- **Staging:** Always use `git add <specific-files>`. NEVER use `git add .` or `git add -A`.

## Deployment
- Automated via GitHub Actions on push to `dev` or `main`.
- Manual deploy (if needed): `npx wrangler pages deploy dist/client --project-name=thesolocruisers`

## Coding Standards
- **Branding:** Follow the v3 branding (coral/navy/red/teal) and fonts (Poppins/Pacifico) defined in `STATUS.md`.
- **Responsive:** Ensure all components work across mobile and desktop.
