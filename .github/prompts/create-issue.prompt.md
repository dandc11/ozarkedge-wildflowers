---
description: 'Create a GitHub issue using an existing template or generic format, with full automation'
agent: agent
tools:
  - mcp_github_issue_write
---

# Create GitHub Issue

Create a well-structured GitHub issue and trigger the full automation pipeline (project board + branch).

## Step 1 — Choose a Template

Ask the user:

> "Would you like to use one of your existing issue templates?
>
> 1. 🐛 Bug Report
> 2. 💡 Feature Request
> 3. 📖 Research
> 4. 🛠️ Update / Tech Debt
> 5. No template — generic format"

## Step 2 — Gather Information

Based on the chosen template, pre-fill what can be inferred from the user's request. Ask only for fields that cannot be inferred. Do not ask for Dev-only fields (Start Date, Implementation PR, Reference Issues) — leave those blank.

### 🐛 Bug Report

- **Labels:** `bug`
- **Title prefix:** `🐛 [BUG] - `
- Pre-fill: `description` from user's context
- Ask user for: reproduction URL, reproduction steps
- Optional (ask only if relevant): screenshots, logs, browsers, OS

### 💡 Feature Request

- **Labels:** `question`
- **Title prefix:** `💡 Enhancement - `
- Pre-fill: `summary` from user's context
- Ask user for: basic example, drawbacks
- Optional: unresolved questions

### 📖 Research

- **Labels:** `research`
- **Title prefix:** `📖💡 Research - `
- Pre-fill: `summary` from user's context
- Ask user for: conclusions (if known), action items
- Optional: unresolved questions

### 🛠️ Update / Tech Debt

- **Labels:** `Studio`, `devops`
- **Title prefix:** `🛠️ Update `
- Pre-fill: `summary` from user's context
- Ask user for: packages being updated
- Optional: new features enabled, risks, unresolved questions

### Generic (no template)

- **Labels:** choose the most appropriate from: `bug`, `enhancement`, `documentation`, `question`
- Use this body structure:

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

## Step 3 — Create the Issue

Use `mcp_github_issue_write` with:

- `method: create`
- `owner: dandc11`
- `repo: ozarkedge-wildflowers`
- `status`: todo unless otherwise specified by the user
- `assignees: ["dandc11"]` — **always, no exceptions**
- `labels` — per template above
- `title` — with correct prefix per template
- `body` — structured using the template's section headings

## Step 4 — Confirm

After creation, tell the user:

- The issue number and URL
- That GitHub Actions will automatically add it to the project board within ~15 seconds
- That the branch (`feature/issue-{NUMBER}-{slug}`) is created when work on the issue actually starts, not now — see `.claude/skills/github-issue-and-branch-workflow/SKILL.md`
