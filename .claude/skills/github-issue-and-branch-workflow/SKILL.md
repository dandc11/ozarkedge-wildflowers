---
name: github-issue-and-branch-workflow
description: Conventions and CI-enforced rules for creating GitHub issues, branches, and PRs in this repo — issue templates and labels, the feature/issue-{N}-{slug} branch format (created at pickup time, not issue-open time), the required Closes #N / Fixes #N PR title, and automatic project-board linking. Use when creating an issue, naming a branch, or titling a PR.
---

# GitHub Issue, Branch & PR Workflow

This repo automates issue → branch → PR linking with GitHub Actions that **fail CI** if the conventions below aren't followed. This skill exists so those constraints are known up front, not discovered from a failed check.

## The Automated Flow

1. An issue is created (or reopened).
2. `add-issues-to-project.yml` auto-adds the issue to the [Ozarkedge project board](https://github.com/users/dandc11/projects/1). It's **PAT-based** (`ADD_TO_PROJECT_PAT`) and has failed silently before, so confirm the issue actually landed — see _Project Board Organization_ below.
3. **When work on the issue actually starts** (not when it's created — see #302), create the branch yourself off current `main`. See _Creating the Branch_ below.
4. Commit and push.
5. `enforce-branch-naming.yml` runs on every push (except to `main`) and **rejects the push** if the branch name doesn't match `feature/issue-{NUMBER}-{slug}`, or if the referenced issue number doesn't exist.
6. Open a PR titled `Closes #{NUMBER}: <description>` or `Fixes #{NUMBER}: <description>`.
7. `validate-pr-linking.yml` runs on PR open/edit/sync and **fails the check** if the PR title doesn't start with `Closes #N`/`Fixes #N`, or if `N` doesn't match the issue number embedded in the branch name.

See [docs/BRANCH_AUTOMATION_SETUP.md](../../../docs/BRANCH_AUTOMATION_SETUP.md) for the full setup and troubleshooting guide.

## Creating the Branch

Branches used to auto-create the instant an issue was opened. That meant the fork point went stale for anything sitting in the backlog before pickup — fixed in #302 by creating the branch at pickup time instead. When you start work on issue `N`:

```bash
git fetch origin main
git checkout -b feature/issue-{N}-{slug} origin/main
```

Compute `{slug}` with the exact same algorithm the old auto-create Action used, so branch names stay consistent with history:

1. Lowercase the issue title.
2. Strip everything except `[a-z0-9 ]`.
3. Trim leading/trailing whitespace.
4. Replace whitespace runs with a single hyphen.
5. Collapse repeated hyphens.
6. Truncate to 40 characters.
7. Strip a trailing hyphen (if truncation left one).

Push when ready: `git push -u origin feature/issue-{N}-{slug}`. `scripts/create-issue-branch.sh` implements the same logic interactively for human contributors.

## Exact Enforced Rules

- **Branch name regex**: `^feature/issue-[0-9]+-[a-z0-9]([a-z0-9-]*[a-z0-9])?$` — lowercase, hyphen-separated slug, no trailing hyphen.
- **PR title regex**: must contain `Closes #N` or `Fixes #N` (case-insensitive on the verb) where `N` exactly matches the issue number parsed from the branch name (`issue-(\d+)`). A title like `... (part of #N)` does **not** satisfy this — the title must _start_ with the correct prefix.
- **One issue per PR**: because the PR title can only reference one issue number, don't point multiple PRs at an umbrella issue — open a dedicated issue for each sub-task instead.
- Always assign `dandc11` to new issues — no exceptions.
- Every new issue must get an appropriate label from the existing set (`bug`, `enhancement`, `documentation`, `devops`, `dependencies`, `sanity`, `audit`, `research`, `question`, `Studio`, `help wanted`) — don't leave issues unlabeled.

## Creating a New Issue

Use the `/create-issue` prompt (`.github/prompts/create-issue.prompt.md`) as the canonical template source. Templates:

| Template              | Labels                                                         | Title prefix        |
| --------------------- | -------------------------------------------------------------- | ------------------- |
| 🐛 Bug Report         | `bug`                                                          | `🐛 [BUG] - `       |
| 💡 Feature Request    | `question`                                                     | `💡 Enhancement - ` |
| 📖 Research           | `research`                                                     | `📖💡 Research - `  |
| 🛠️ Update / Tech Debt | `Studio`, `devops`                                             | `🛠️ Update `        |
| Generic (no template) | choose from: `bug`, `enhancement`, `documentation`, `question` | none                |

Generic body structure:

```
## Overview
{1-2 sentence summary of what and why.}

## Proposed Solution / Approach
{What should be built or changed. Reference specific files, components, schemas.}

## Acceptance Criteria
- [ ] {Testable, specific condition}

## Implementation Notes
{Optional: architecture hints, files to reference, gotchas.}

## Out of Scope
{Optional: explicitly exclude anything that might be assumed.}
```

Don't ask for Dev-only fields (Start Date, Implementation PR, Reference Issues) — leave those blank.

When creating via the GitHub MCP tools: `owner: dandc11`, `repo: ozarkedge-wildflowers`, `status: todo` unless told otherwise, `assignees: ["dandc11"]` always.

## After Creating

Tell the user the issue number/URL, that the branch (`feature/issue-{NUMBER}-{slug}`) will be created when work on the issue actually starts (see _Creating the Branch_ above), and the expected PR title format.

## Project Board Organization

Beyond the auto-add, organize each issue so the board stays legible. Set these on triage:

**Custom single-select fields** (in the [project](https://github.com/users/dandc11/projects/1); needs the Projects UI or a `gh` token with `project` scope):

- **Priority** — `P1` / `P2` / `P3`.
- **Workstream** — `Design System` / `Content` / `Studio` / `DevOps` / `Testing`. The ongoing _area_ an issue belongs to; grouping board views by it is what de-clutters.

**Milestone vs. sub-issue vs. Workstream — how to choose (they're independent; an issue can have all three):**

- **Milestone = the _when_** — a delivery arc / goal, time- or goal-bound, that may span multiple umbrellas or standalone issues. Create with `gh api repos/dandc11/ozarkedge-wildflowers/milestones -f title=…`; assign with `gh issue edit <n> --milestone "<title>"`.
- **Sub-issue = the _what_** — decomposition of one umbrella into its constituent work, with progress rollup on the parent. Use when a big issue literally breaks into smaller ones. Not `gh`-native; link via GraphQL `addSubIssue(input:{issueId, subIssueId})` (needs each issue's node id) or the issue UI. Reserve for true decomposition — don't sub-issue merely _related_ work (keep that as a cross-reference or shared milestone).
- **Workstream field = the _where_** — the ongoing area, independent of any milestone or parent.

**Board-membership caveat:** the auto-add PAT (`ADD_TO_PROJECT_PAT`, classic, `repo` + `project` scopes) has silently expired before, stopping issues from landing on the board for weeks. Both token-dependent workflows now open an `[automation-failure]` tracker issue on failure (from #287) — if that issue appears, rotate the PAT and update the repo secret, then re-run the failed runs. Always confirm a new issue actually landed on the board.
