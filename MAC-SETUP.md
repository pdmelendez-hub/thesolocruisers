# Mac mini — Project Setup Guide

How to get the **Off The Grid Getaways** and **The Solo Cruisers** websites
running on a brand-new Mac mini. Written for Paolo (pd_me).

> **TL;DR:** Don't edit the projects through the OneDrive folder on the Mac.
> Use `git clone` into a normal local folder (e.g. `~/Projects`). OneDrive
> syncing `.git/` and `node_modules/` across Windows + Mac causes corruption.
> Git is the source of truth — both sites live on GitHub.

---

## 1. One-time: install the tools

Open **Terminal** (Cmd+Space → type "Terminal" → Enter) and run these.

### a. Install Homebrew (the Mac package manager)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
After it finishes, it prints 2 lines starting with `eval` to "add Homebrew to
your PATH" — copy/paste and run those, or just close and reopen Terminal.

### b. Install Git, Node.js, and GitHub CLI
```bash
brew install git node gh
```

### c. Verify everything installed
```bash
git --version      # any 2.x
node --version     # should be v20 or v22
npm --version      # any 10.x
gh --version       # any 2.x
```

### d. Sign in to GitHub
```bash
gh auth login
```
Choose: **GitHub.com** → **HTTPS** → **Login with a web browser**. It shows a
one-time code; press Enter, the browser opens, paste the code, authorize.
This logs you into the `pdmelendez-hub` account so you can push.

---

## 2. One-time: clone both projects

```bash
mkdir -p ~/Projects
cd ~/Projects

git clone https://github.com/pdmelendez-hub/off-the-grid-getaways.git
git clone https://github.com/pdmelendez-hub/thesolocruisers.git
```

You now have:
```
~/Projects/off-the-grid-getaways    ← OTGG main site (offthegridgetaways.com)
~/Projects/thesolocruisers          ← Solo Cruisers (thesolocruisers.com)
```

Install dependencies for each:
```bash
cd ~/Projects/off-the-grid-getaways && npm install
cd ~/Projects/thesolocruisers && npm install
```

---

## 3. Day-to-day workflow

### Always pull before you start
The daily price scrapers auto-commit to OTGG, so pull first or you'll conflict:
```bash
cd ~/Projects/off-the-grid-getaways
git pull
```

### Run a site locally (live preview in the browser)
```bash
npm run dev
```
Then open the URL it prints (usually `http://localhost:4321`).
Press `Ctrl+C` in Terminal to stop it.

### Build to check for errors before pushing
```bash
npm run build
```

---

## 4. Branches & deploying — IMPORTANT

Each site deploys differently. Get this right or you'll push to production by accident.

### Off The Grid Getaways  (`off-the-grid-getaways`)
| Branch | Deploys to | Notes |
|--------|-----------|-------|
| `master` | **PRODUCTION** — offthegridgetaways.com | ⚠️ live business site |
| any other branch | preview URL (`*.pages.dev`) | safe to experiment |

- **Production branch is `master`** (not `main`).
- Deploys automatically via Cloudflare's Git integration — pushing `master`
  goes LIVE. Always branch first, verify the preview, then merge.
```bash
git checkout -b dev/my-change      # make a safe branch
# ...edit, npm run build, commit...
git push origin dev/my-change      # creates a preview deploy, NOT live
```

### The Solo Cruisers  (`thesolocruisers`)
| Branch | Deploys to | Notes |
|--------|-----------|-------|
| `main` | thesolocruisers.com | currently a maintenance page |
| `dev`  | **dev.thesolocruisers.com** | the full site in progress |

- Do all work on the **`dev`** branch.
- Deploys via **GitHub Actions** (auto-runs on push).
```bash
cd ~/Projects/thesolocruisers
git checkout dev
git pull
# ...edit, npm run build, commit...
git push origin dev                # auto-deploys to dev.thesolocruisers.com
```

### Standard commit + push
```bash
git add .
git commit -m "describe what you changed"
git push
```

---

## 5. Optional: Cloudflare CLI (wrangler)

Already installed per-project via npm. To check deploy status:
```bash
cd ~/Projects/off-the-grid-getaways
npx wrangler pages deployment list --project-name=off-the-grid-getaways
```
First use opens a browser to authorize your Cloudflare account
(Account ID: `8dbea82fd02e7e24c44dab2794ba6c05`).

---

## 6. Repo reference

| | Off The Grid Getaways | The Solo Cruisers |
|--|--|--|
| **GitHub** | github.com/pdmelendez-hub/off-the-grid-getaways | github.com/pdmelendez-hub/thesolocruisers |
| **Stack** | Astro (static) | Astro + Cloudflare adapter |
| **Prod branch** | `master` | `main` |
| **Work branch** | feature branches → merge to `master` | `dev` |
| **Deploy method** | Cloudflare Git integration | GitHub Actions |
| **CF Pages project** | `off-the-grid-getaways` | `thesolocruisers` |

---

## 7. If something breaks

- **"npm: command not found"** → reopen Terminal, or re-run the Homebrew
  `eval` PATH lines from step 1a.
- **Permission denied on push** → re-run `gh auth login`.
- **Merge conflict after `git pull`** → the scrapers touched the same files.
  Easiest fix: `git stash`, `git pull`, then `git stash pop`.
- **Don't trust the OneDrive copy** on the Mac — always work from the
  `git clone`d folder in `~/Projects`. Git on GitHub is the real source.
