---
name: claude-design-workflow
description: How to run the Claude Code ↔ Claude Design (claude.ai/design) loop for design-system work in this repo — the divergent/convergent split, the thin-brief handoff, the four approval gates, DESIGN.md (design.md convention) as the shared source of truth, and the per-issue cadence for the #197 design-system effort. Use when proposing or changing color/spacing/typography tokens, season theming, or any palette/look work that involves claude.ai/design.
---

# Claude Code ↔ Claude Design Workflow

This repo's design-system overhaul (umbrella #197) is done by moving deliberately between **Claude Design** (claude.ai/design) and **Claude Code**. This skill defines that loop so token changes land cleanly, stay reviewable, and stay in sync with a canonical reference both tools read. It exists because the two tools have complementary — not overlapping — strengths, and the value is in the handoff discipline.

## The two roles

- **Claude Design = divergent / visual.** Explores palettes, season looks, and spacing rhythm as *prototypes and token tables*. Answers "what should this look like." It is a proposal tool, not an implementation tool.
- **Claude Code = convergent / implementation.** Extracts ground truth (the audit) into a brief, translates Design's *token decisions* into `/styles/*.css` **by hand**, verifies (build/lint/test/preview), and opens PRs. Answers "how does this become real, correct code."

Never paste Claude Design's generated **component code** into the repo. This project has no Tailwind / CSS-modules / styled-components — **all styling lives in `/styles/*.css`** (CLAUDE.md). Only Design's *token tables and palette/look decisions* cross the boundary; Claude Code writes the CSS.

## The loop and its four approval gates

Run one pass per token issue (#259 color, #260 season, #261 spacing). Nothing lands without deliberate sign-off:

1. **Gate 1 — Brief.** Claude Code drafts a *thin brief* (below) from the audit. **User approves the brief** before it goes to Design.
2. **Gate 2 — Proposal.** User takes the brief into Claude Design (with **Codebase context attached**), iterates on looks, and **approves the resulting token table** there. Design's output comes back as a palette/token table, not code.
3. **Gate 3 — CSS diff.** Claude Code translates the approved tokens into `/styles/*.css`. **User approves the diff.**
4. **Gate 4 — PR.** Claude Code verifies and opens a PR **based on `feature/issue-197-design-system`** (not `main`). **User approves the merge.**

## The thin-brief template

Claude Design's **Codebase context reads `styles/colors.css`, `styles/variables.css`, etc. directly**, so the brief does *not* re-list every token. It carries only decisions + constraints:

```
# Design brief — <issue> (<what>)

## Read first (Codebase context)
styles/colors.css, styles/variables.css, styles/global.css  (+ the relevant component/page CSS)

## Decisions needed
- <the specific choice(s) Design should propose — e.g. "a scaled-down complementary
  primitive palette from colors actually in use">

## Ground truth / audit
- <the few numbers that matter — e.g. usage counts, the literals to promote>

## Hard constraints
- CSS custom properties only; no Tailwind, no generated component code.
- Output = a token/palette table (names + values + tier), NOT component code.
- Names/tiers must conform to the target taxonomy (see DESIGN.md / #264a spike).
- Season theming uses a single `.season`-class remap of `--season-*` aliases.

## Deliverable
- <e.g. "primitive ramps + semantic groups as a table I can translate to colors.css">
```

## Source of truth: DESIGN.md (design.md convention)

- The canonical reference is **`DESIGN.md`, authored as a [design.md](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) file** — YAML frontmatter mirroring the tokens (`colors`, `typography`, `spacing`, `rounded`, `components`; `{path.to.token}` refs) + a markdown body in the spec's section order (*Overview / Brand & Voice → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's & Don'ts*). `CLAUDE.md` points at it.
- **NOT** W3C DTCG-JSON, Style Dictionary, or any token-transformation pipeline — deliberately out of scope (overkill for a single project). **CSS custom properties in `/styles/*.css` remain the runtime source of truth;** DESIGN.md's frontmatter mirrors them and is kept in sync by hand.
- **Both tools read the repo.** Claude Code reads the files directly; Claude Design ingests `DESIGN.md` + `/styles/*.css` via its **Codebase context** (design.md is built for design-tool interoperability). There is no separate copy to drift.
- The Claude Design **"Design system" picker is a convenience snapshot, not the source of truth** — a registered system can drift. Rely on Codebase context (always fresh); register the finalized system there only *once* tokens settle (after #259–#261).

## Per-issue cadence (#197)

Execution order: **#264a research spike** (settle target token taxonomy/names + season model) → **#259 color** → **#260 season** (depends on #259). **#261 spacing** runs in parallel. **#262 inline styles** + **#263 styled-components** are pure Claude Code (no Design) and run anytime. **#264b** authors `DESIGN.md` last, documenting reality.

Each sub-issue PR bases on `feature/issue-197-design-system`; sub-issues are **closed manually** as they merge into the integration branch (they don't auto-close there). One final PR `feature/issue-197-design-system → main` titled `Closes #197:` lands everything. See [github-issue-and-branch-workflow](../github-issue-and-branch-workflow/SKILL.md) for the CI-enforced naming rules.

## Pitfalls

- **Component reinvention (design.md's main gotcha).** When DESIGN.md reaches the Components section, point it at the real `/styles/components/*.css` — don't describe components abstractly, or agents will recreate them. Keep DESIGN.md alongside CLAUDE.md and the existing skills, not as the sole guidance.
- **Season theming is date-derived.** Verifying a season change means forcing each of spring/summer/fall/winter (temporary override or manual date QA) — the live season only shows one at a time. See [pr-self-review](../pr-self-review/SKILL.md) before opening a PR.
- **Draft-only Sanity content is invisible to preview tooling** (CLAUDE.md). For any look that depends on unpublished content, request a screenshot from the developer rather than trying to enable Draft Mode programmatically.
