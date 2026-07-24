# Issue-to-Branch Automation: Implementation Complete

> **Update (#302):** branches are no longer auto-created on issue open — that let a branch's fork point go stale if the issue sat in the backlog before pickup. Branch creation now happens at **pickup time** instead (by the developer or Claude, off current `main`). `create-branch-on-issue.yml` is now a manual `workflow_dispatch` escape hatch, not an on-open trigger. See [CONTRIBUTING.md](../CONTRIBUTING.md) and `.claude/skills/github-issue-and-branch-workflow/SKILL.md` for the current flow. The sections below describing on-open auto-creation reflect the original (superseded) design.
>
> **Update (#315):** the enforced branch shape is now `{type}/issue-{NUMBER}-{slug}` where `{type}` ∈ `feature`/`research`/`fix`, optionally prefixed with `claude/` for Claude-authored branches (provenance). CI treats the `claude/` prefix as optional and enforces the same shape + issue-existence check at push time (`enforce-branch-naming` + local `.husky/pre-push`) and PR time (`validate-pr-linking`). Only the harness-assigned `claude/…` scratch landing-pad branch (matching `^claude/[^/]+$`, no `/issue-`) is skipped. The `.claude/skills/github-issue-and-branch-workflow/SKILL.md` skill is the single source of truth for the exact regex; the `feature/issue-…` examples below are still valid (feature is one of the types).

## ✅ What's Been Implemented

### 1. GitHub Actions Workflows (3 new workflows)

All workflows are in `.github/workflows/`:

- **`create-branch-on-issue.yml`** — Manual escape hatch (`workflow_dispatch`; formerly triggered on issue create)
  - Creates a bare branch: `{type}/issue-{NUMBER}-{slug}` (accepts a `type` input, default `feature`)
  - Parses issue title and generates kebab-case slug
  - Posts comment on issue with branch link
  - Auto-assigns issue to the issue creator

- **`enforce-branch-naming.yml`** — Triggers on every push
  - Validates branch name matches `(claude/)?{type}/issue-{NUMBER}-{slug}` pattern (type ∈ feature/research/fix; harness `claude/…` scratch branches skipped)
  - Verifies the issue number exists and is open
  - Blocks non-conforming pushes with helpful error messages
  - Shows exact format expected if validation fails

- **`validate-pr-linking.yml`** — Triggers on PR opened/edited
  - Validates the branch shape (optional `claude/` prefix + type set) and that the referenced issue exists
  - Checks PR title contains `Closes #NUM` or `Fixes #NUM`
  - Verifies issue number in title matches issue number in branch
  - Auto-links PR to issue (GitHub does this automatically)
  - Fails check if there's a mismatch

### 2. Local Pre-Push Guard

**`.husky/pre-push`** — Local validation hook

- Runs before `git push` (if Husky is initialized)
- Validates branch name locally before any network round-trip
- Prevents bad branches from even being attempted
- Provides helpful error message with examples

### 3. Documentation

- **`CONTRIBUTING.md`** — Completely rewritten
  - Explains the automated flow step-by-step
  - Shows what happens at each stage (local, push, PR)
  - Includes troubleshooting section with solutions
  - Documents best practices

- **Issue Templates** — Updated (all 4 templates)
  - Added note about automatic branch creation
  - Points to CONTRIBUTING.md for workflow details
  - No breaking changes to existing fields

### 4. Helper Script (Optional)

**`scripts/create-issue-branch.sh`** — Already existed, still available

- Interactive script to manually create branches
- Useful if someone wants to create branch before pushing
- Not required (branches auto-create on issue creation)
- Made executable with proper permissions

---

## 🔧 Manual Setup Required: Branch Protection Rules

**This is the final enforcement step.** You must configure branch protection rules in GitHub so that:

1. Branches cannot be merged without passing the validation workflows
2. Non-conforming branches literally cannot reach `main`

### How to Set Up Branch Protection Rules

1. **Go to your GitHub repository**
   - Navigate to: Settings → Branches

2. **Add branch protection rule for `main`**
   - Click "Add rule"
   - Branch name pattern: `main`

3. **Enable these settings:**
   - ✅ **Require a pull request before merging**
     - Dismiss stale pull request approvals when new commits are pushed
     - (Optional) Require approvals

   - ✅ **Require status checks to pass before merging**
     - Require branches to be up to date before merging
     - **Required status checks:**
       - `enforce-branch-naming`
       - `validate-pr-linking`

   - ✅ **Include administrators** (optional but recommended)
     - So admins can't bypass the rules by accident

   - ✅ **Restrict who can push to matching branches** (optional)
     - If you want to prevent direct pushes to `main`

4. **Save the rule**

### Result After Setup

```
Developer creates issue #42
    ↓
(later, at pickup time) Developer creates feature/issue-42-${slug} off current main
Branch is now ready to work on

Developer makes changes
    ↓
Developer pushes to origin

enforce-branch-naming workflow runs
✅ Validates branch name
✅ Verifies issue exists and is open
    ↓
Developer creates PR with title "Closes #42: ..."

validate-pr-linking workflow runs
✅ Checks title links to issue
✅ Verifies issue# in title matches branch
    ↓
Branch protection rule checks:
✅ Status checks (enforce-branch-naming + validate-pr-linking) PASSED
    ↓
PR can be merged ✅
```

If anything fails:

```
❌ Branch name doesn't match → enforce-branch-naming FAILS
   → PR cannot be merged until fixed

❌ PR title missing issue link → validate-pr-linking FAILS
   → PR cannot be merged until fixed

❌ Issue# in title ≠ issue# in branch → validate-pr-linking FAILS
   → PR cannot be merged until fixed
```

---

## 📋 Checklist: Implementation Summary

- ✅ Created `.github/workflows/create-branch-on-issue.yml`
- ✅ Created `.github/workflows/enforce-branch-naming.yml`
- ✅ Created `.github/workflows/validate-pr-linking.yml`
- ✅ Created `.husky/pre-push` (made executable)
- ✅ Updated `CONTRIBUTING.md` with complete workflow guide
- ✅ Updated all 4 issue templates with auto-create note
- ✅ Optional helper script: `scripts/create-issue-branch.sh` (made executable)

- ⏳ **MANUAL:** Configure branch protection rules on `main` (see instructions above)

---

## 🧪 Testing the Setup

Once branch protection is configured, you can test with:

1. **Test Auto-Create Workflow:**
   - Create a test issue → GitHub Actions should create a branch within seconds
   - Check the issue comments for the branch link

2. **Test Branch Validation:**
   - Try to push a badly-named branch → should be rejected by `enforce-branch-naming`
   - Try to create a PR without issue link in title → should fail `validate-pr-linking`
   - Create proper PR → should pass both checks

3. **Test Merge Blocking:**
   - Try to merge a PR that fails checks → should be blocked by branch protection

---

## 💡 Key Behavioral Changes for Team

| Before                             | After                                          |
| ---------------------------------- | ---------------------------------------------- |
| Manually create branches per issue | Branch created at pickup time, off current `main`, following a fixed format |
| No enforcement of branch naming    | Branch name validation on every push           |
| Manual linking of PR to issue      | Automatic linking if PR title has `Closes #42` |
| Can push non-conforming branches   | Cannot push unless branch matches format       |
| Can merge non-linked PRs           | Cannot merge unless PR properly links to issue |

---

## 📚 Team Communication

When you're ready to roll this out to your team, share:

1. [CONTRIBUTING.md](../../CONTRIBUTING.md) — the main reference
2. The "Workflow Overview" section — shows the happy path
3. The "Troubleshooting" section — for when things go wrong
4. This setup guide (for understanding what's happening behind the scenes)

---

## ❓ FAQ

**Q: What if someone creates a branch manually?**
A: If it doesn't match `(claude/)?{type}/issue-{NUMBER}-*` (type ∈ feature/research/fix), the push will be blocked with a helpful error message. The only exception is a harness-assigned `claude/…` scratch landing-pad branch, which is skipped.

**Q: What if the issue number in the branch doesn't exist?**
A: The `enforce-branch-naming` workflow will detect this and reject the push.

**Q: Can someone bypass these rules?**
A: Only if branch protection is not configured or if they delete the workflows. With proper branch protection on `main`, it's impossible to merge non-conforming code.

**Q: What if someone closes an issue before finishing work?**
A: The branch will still exist and can be worked on, but the `enforce-branch-naming` workflow will warn about it. (This is fine — you can reopen the issue if needed.)

**Q: How do I handle fixing mistakes after pushing?**
A: See "Troubleshooting" section in CONTRIBUTING.md for options (rename branch, cherry-pick commits, etc.)

---

## 🎯 Next Steps

1. ✅ Review the implementation (all files are ready)
2. ✅ Tested end-to-end — issue #186 and #187 confirmed working
3. ⏳ **Configure branch protection rules** on GitHub repo (Settings → Branches → main)
4. 📢 Communicate to team: Share CONTRIBUTING.md
5. 🚀 Start using! All team members benefit from auto-created branches and automatic validation

---

Questions? Check CONTRIBUTING.md troubleshooting section or review the workflow YAML files for details.
