---
name: github-issue-and-branch-workflow
description: Conventions and CI-enforced rules for creating GitHub issues, branches, and PRs in this repo — issue templates and labels, the auto-created feature/issue-{N}-{slug} branch format, the required Closes #N / Fixes #N PR title, and automatic project-board linking. Use when creating an issue, naming a branch, or titling a PR.
---

# GitHub Issue, Branch & PR Workflow

This repo automates issue → branch → PR linking with GitHub Actions that **fail CI** if the conventions below aren't followed. This skill exists so those constraints are known up front, not discovered from a failed check.

## The Automated Flow

1. An issue is created (or reopened).
2. `create-branch-on-issue.yml` auto-creates a branch named `feature/issue-{NUMBER}-{slug}` off `main` (slug is a kebab-cased, 40-char-max truncation of the issue title) and comments on the issue with the branch name. The issue is also auto-assigned to whoever opened it.
3. `add-issues-to-project.yml` auto-adds the issue to the [Ozarkedge project board](https://github.com/users/dandc11/projects/1) — no manual `gh project` command needed.
4. Developer checks out the branch, commits, and pushes.
5. `enforce-branch-naming.yml` runs on every push (except to `main`) and **rejects the push** if the branch name doesn't match `feature/issue-{NUMBER}-{slug}`, or if the referenced issue number doesn't exist.
6. Developer opens a PR titled `Closes #{NUMBER}: <description>` or `Fixes #{NUMBER}: <description>`.
7. `validate-pr-linking.yml` runs on PR open/edit/sync and **fails the check** if the PR title doesn't start with `Closes #N`/`Fixes #N`, or if `N` doesn't match the issue number embedded in the branch name.

See [docs/BRANCH_AUTOMATION_SETUP.md](../../../docs/BRANCH_AUTOMATION_SETUP.md) for the full setup and troubleshooting guide.

## Exact Enforced Rules

- **Branch name regex**: `^feature/issue-[0-9]+-[a-z0-9]([a-z0-9-]*[a-z0-9])?$` — lowercase, hyphen-separated slug, no trailing hyphen.
- **PR title regex**: must contain `Closes #N` or `Fixes #N` (case-insensitive on the verb) where `N` exactly matches the issue number parsed from the branch name (`issue-(\d+)`). A title like `... (part of #N)` does **not** satisfy this — the title must *start* with the correct prefix.
- **One issue per PR**: because the PR title can only reference one issue number, don't point multiple PRs at an umbrella issue — open a dedicated issue for each sub-task instead.
- Always assign `dandc11` to new issues — no exceptions.
- Every new issue must get an appropriate label from the existing set (`bug`, `enhancement`, `documentation`, `devops`, `dependencies`, `sanity`, `audit`, `research`, `question`, `Studio`, `help wanted`) — don't leave issues unlabeled.

## Creating a New Issue

Use the `/create-issue` prompt (`.github/prompts/create-issue.prompt.md`) as the canonical template source. Templates:

| Template | Labels | Title prefix |
|---|---|---|
| 🐛 Bug Report | `bug` | `🐛 [BUG] - ` |
| 💡 Feature Request | `question` | `💡 Enhancement - ` |
| 📖 Research | `research` | `📖💡 Research - ` |
| 🛠️ Update / Tech Debt | `studio`, `devops` | `🛠️ Update ` |
| Generic (no template) | choose from: `bug`, `enhancement`, `documentation`, `refactor`, `question` | none |

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

Tell the user the issue number/URL, that the branch (`feature/issue-{NUMBER}-{slug}`) will auto-create within ~15 seconds, and the expected PR title format.
