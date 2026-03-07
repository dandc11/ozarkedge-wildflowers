# Contributing to Ozarkedge Wildflowers

## Workflow Overview

This project uses a **fully automated GitHub issue → branch → PR workflow**. When you create an issue, a branch is automatically created. Pushing to that branch and creating a PR is validated automatically by GitHub Actions to ensure everything is properly linked.

**Key benefit:** No manual branch setup. Issues automatically get branches. Everything is traced back to the issue.

## Working on Issues: The Automated Flow

### Step 1: Create an Issue

When you create a new issue on GitHub:

1. The issue is submitted with one of our templates (Bug Report, Feature Request, etc.)
2. **GitHub Actions automatically creates a branch** with the format: `feature/issue-{NUMBER}-{slug}`
3. **A comment is posted** on the issue with the branch name and how to check it out

### Step 2: Check Out the Auto-Created Branch

Once the branch is created (you'll see the comment appear within seconds):

```bash
git fetch origin
git checkout feature/issue-{NUMBER}-{slug}
```

It's already there waiting for you. No manual branch creation needed.

### Step 3: Work on Your Branch

- Make commits as normal
- Follow the project's coding standards (see [copilot-instructions.md](.github/copilot-instructions.md))
- Reference the issue in your commit messages if relevant: `git commit -m "Feature: implement plant filter (fixes #42)"`

### Step 4: Push Your Work

```bash
git push origin feature/issue-{NUMBER}-{slug}
```

**Before you push:**

- Your local `pre-push` hook validates the branch name matches the required format
- If validation fails, you'll see a helpful error message before anything leaves your computer

**After you push:**

- GitHub Actions runs `enforce-branch-naming` workflow
- Validates the branch name follows `feature/issue-{NUMBER}-*` format
- Ensures the referenced issue exists and is open
- ❌ If invalid, the push check fails with a clear error message
- ✅ If valid, the check passes and GitHub marks it as successful

### Step 5: Create a Pull Request

Create your PR with a title that references the issue:

```
Closes #42: Add native plant filter
```

GitHub Actions runs `validate-pr-linking` workflow:

- ✅ Checks that PR title references an issue (`Closes #42` or `Fixes #42`)
- ✅ Verifies the issue number in the title matches the issue number in your branch name
- ✅ Auto-links your PR to the issue (GitHub does this automatically when the title contains `Closes #42`)
- ❌ If anything mismatches, the check fails and shows exactly what to fix

**You cannot merge the PR until all checks pass** — branch protection rules on `main` require it.

## Branch Naming Convention

Branches are automatically named following this format: `feature/issue-{NUMBER}-{slug}`

| Part                 | Example                   | Purpose                                  |
| -------------------- | ------------------------- | ---------------------------------------- |
| `feature/`           | `feature/`                | Indicates this is feature/issue work     |
| `issue-{NUMBER}`     | `issue-42`                | GitHub issue number                      |
| `{description-slug}` | `add-native-plant-filter` | Kebab-case slug derived from issue title |

### Examples

| Issue                                    | Auto-Generated Branch                      |
| ---------------------------------------- | ------------------------------------------ |
| #15: Fix layout bug on mobile            | `feature/issue-15-fix-layout-bug-mobile`   |
| #8: Add unit tests for Plant component   | `feature/issue-8-add-unit-tests-component` |
| #51: Refactor image optimization utility | `feature/issue-51-refactor-image-optimize` |

**Note:** Slugs are automatically shortened to ~40 characters to keep branch names reasonable. Examples: `feature/issue-42-add-native-filter` instead of `feature/issue-42-add-native-wildflower-plant-filter`

## Validation & Enforcement

### What Gets Checked

- **Branch name format** — must be `feature/issue-{NUMBER}-*`
- **Issue existence** — the issue number must exist in the repository
- **Issue status** — the issue should be open (not closed/archived)
- **PR title linking** — PR title must contain `Closes #NUM` or `Fixes #NUM`
- **Issue number consistency** — issue number in PR title must match issue number in branch name

### Where Validation Happens

| Stage                  | Tool                                  | Result                                              |
| ---------------------- | ------------------------------------- | --------------------------------------------------- |
| **Local (optional)**   | Git pre-push hook (`.husky/pre-push`) | Prevents bad pushes before they leave your computer |
| **Remote (automatic)** | `enforce-branch-naming` workflow      | Rejects pushed commits that don't follow format     |
| **Remote (automatic)** | `validate-pr-linking` workflow        | Blocks PR merging if title doesn't link to issue    |
| **Repository setting** | Branch protection rules on `main`     | Requires both workflows to pass before merge        |

### If Validation Fails

You'll see a clear error message. For example:

```
❌ BRANCH NAME INVALID

Expected format: feature/issue-{NUMBER}-{description-slug}

Examples of valid branch names:
  - feature/issue-42-add-plant-filter
  - feature/issue-15-fix-mobile-layout
  - feature/issue-8-update-tests

Your branch: my-cool-feature
```

**To fix:** Rename your branch to follow the format. If you've already pushed, you can force-push the renamed branch (or create a new properly-named branch and cherry-pick your commits).

## Troubleshooting

### "Branch already exists when I created the issue"

This sometimes happens if an issue is re-opened or if the workflow runs twice. The comment on the issue will show you the existing branch — just check it out:

```bash
git fetch origin
git checkout feature/issue-{NUMBER}-{description}
```

### "I pushed to a branch with the wrong name"

If you've already created commits on a poorly-named branch:

**Option 1: Rename the branch locally and force-push**

```bash
# Rename your local branch
git branch -m new-feature feature/issue-42-correct-name

# Force-push to update origin
git push origin -u feature/issue-42-correct-name --force-with-lease

# Delete the old badly-named branch from origin
git push origin -d old-feature
```

**Option 2: Create a new branch and cherry-pick commits**

```bash
# Create a new properly-named branch from main
git checkout main
git pull origin main
git checkout -b feature/issue-42-correct-name

# Cherry-pick your commits from the old branch
git cherry-pick <commit-hash1> <commit-hash2> ...

# Push the new branch
git push -u origin feature/issue-42-correct-name
```

### "My PR won't merge — validation is failing"

Check the GitHub Actions workflow logs (go to your PR → click the failing check). Common issues:

- **Branch name doesn't match pattern:** Rename your branch to `feature/issue-{NUMBER}-{slug}`
- **PR title missing issue reference:** Update PR title to include `Closes #42` or `Fixes #42`
- **Issue number mismatch:** Branch says `#42` but PR title says `#43` — make them match

### "The pre-push hook is too strict"

You can temporarily bypass the pre-push hook (not recommended, but possible):

```bash
git push --no-verify
```

However, the remote GitHub Actions checks will still run and will reject non-conforming branch names. It's better to fix the branch name.

## Optional: Local Branch Helper Script

If you prefer to manually create branches locally (not recommended, since auto-creation is faster), we have an optional helper:

```bash
./scripts/create-issue-branch.sh
```

This script:

- Prompts for an issue number and title
- Generates the proper branch name
- Creates and checks out the branch locally

However, **you still need to push to origin**, and the branch **must match the auto-created name** for validation to pass. It's simpler to let GitHub Actions create the branch when you create the issue.

## Best Practices

- ✅ **One issue per branch** — don't combine multiple issues into a single branch
- ✅ **Link all PRs to issues** — use `Closes #42` in PR title
- ✅ **Delete merged branches** — keep the repo clean after your PR is merged
- ✅ **Make focused commits** — keep commits logically organized and well-described
- ✅ **Amend commits if needed** — before you push, you can rewrite history on your own branch
- ❌ **Don't manually create branches** — let GitHub Actions do it automatically
- ❌ **Don't ignore validation errors** — they're there to keep things organized

## Questions?

If you run into issues with this workflow, open a discussion issue or ask in our team chat. We're always happy to help!
