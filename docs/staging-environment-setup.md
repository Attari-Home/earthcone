# Staging environment — admin setup steps

One-time GitHub configuration for the `staging` environment added in "Add a gated staging
environment on GitHub Pages". Everything in the repo (workflow, build config, docs) is done;
the two items below live in GitHub's settings and need **repo admin or org owner** access.
Maintainer access is not enough — Settings → Rules and Settings → Environments return 404
without admin.

Background on what the environment is and why the staging build differs from production:
`CLAUDE.md` §9 (branch workflow) and §10 (CI/CD).

---

## Step 1 — Gate the `staging` branch like `main`

Goal: nothing reaches the staging site without a reviewed pull request, exactly as for
production.

The simplest option is to extend the existing ruleset so one set of rules covers both
branches; a second, separate ruleset works too but then the two can silently drift apart.

1. Go to **https://github.com/Attari-Home/earthcone/settings/rules**.
2. Open the existing ruleset that targets `main`.
3. Under **Target branches**, choose **Add target → Include by pattern**, enter `staging`,
   and confirm. The target list should now show both `main` and `staging`.
4. Check that these rules are ticked (they already are for `main` — this is just to confirm
   what `staging` is inheriting):
    - **Restrict deletions**
    - **Block force pushes**
    - **Require a pull request before merging** → **Required approvals: 1**
    - **Require status checks to pass** → the check named **`Lint, type-check & build`**
      (the job in `.github/workflows/ci.yml`, reported by the GitHub Actions app)
5. Set **Enforcement status** to **Active** and **Save changes**.

If you would rather keep them separate, use **New ruleset → New branch ruleset**, name it
`staging`, target `staging`, and tick the same four rules.

> **Ordering note.** Once this is active, every merge into `staging` needs an approving
> review from a second account, the same as `main` (GitHub never lets a PR author approve
> their own PR). If the staging-environment PR itself has not been merged yet, either merge
> it first and then apply this step, or apply this step first and have a second account
> approve that PR. Either order is fine — just don't be surprised when the PR starts asking
> for a review.

## Step 2 — Limit the `github-pages` environment to `staging`

Goal: even a hand-triggered or future workflow cannot publish a different branch to the
staging site. The workflow already only triggers on `staging`; this is the backstop.

1. Go to **https://github.com/Attari-Home/earthcone/settings/environments**.
2. Open the **`github-pages`** environment.
3. Under **Deployment branches and tags**, switch the dropdown to **Selected branches and
   tags**.
4. Click **Add deployment branch or tag rule**, enter `staging`, and add it.
5. Leave any existing rule for other branches out — `staging` should be the only entry.

Do not pick "Protected branches only" unless Step 1 is already active, or deployments will
be rejected until it is.

## Already done — nothing to change

**Settings → Pages → Source** is already set to **GitHub Actions**, which is what the
workflow needs. The site currently serving at https://attari-home.github.io/earthcone/ is an
old deployment from the retired `gh-pages.yml`; the first push to `staging` replaces it.

---

## Verify it worked

After merging the staging-environment PR and applying both steps:

1. **Deployment ran** — Actions → **Deploy staging to GitHub Pages** shows a green run, with
   both the `build` and `deploy` jobs green.
2. **Site is live** — https://attari-home.github.io/earthcone/ loads, and clicking through
   the nav works (no 404s; that would mean a link missing the `/earthcone` base prefix).
3. **Site is not indexable** — this is the one that protects the real domain's search
   ranking, so check both:
    - https://attari-home.github.io/earthcone/robots.txt shows exactly `User-agent: *` and
      `Disallow: /`
    - View source on any page and find `<meta name="robots" content="noindex, nofollow">`

   If either is missing, stop and re-check the workflow's env vars — it means a production
   build reached Pages. (The workflow fails itself in that case, so it should not be
   possible.)
4. **Branch is gated** — `git push origin staging` directly from a local clone is rejected,
   and a test PR into `staging` shows "Review required" plus the CI check.

## Day-to-day use after setup

`feature/*` → PR into `staging` → review the deployed staging site → PR `staging` into
`main` → Cloudflare publishes to earthconecontracting.com.

Merge `staging` into `main` with a **merge commit, not a squash**: squashing rewrites the
commits and leaves the two branches permanently diverged, which makes every later PR show
phantom conflicts.
