<!-- Roadmap for the #197 design-system overhaul. Live status lives in the issues
     (#259–#264) and the #264a spike comment on #264. The canonical *token* reference
     will be DESIGN.md (authored last, in #264b); this file is the process/roadmap. -->

# Design System Overhaul — Claude Code ↔ Claude Design Operating Loop

## Context

Issue [#197](https://github.com/dandc11/ozarkedge-wildflowers/issues/197) is a well-decomposed umbrella (sub-issues #259–#264, integration branch `feature/issue-197-design-system` already exists). The audit is precise; the sequencing is sound. **What's missing is not *what* to do — it's the operating loop** between Claude Code and [claude.ai/design](https://claude.ai/design): how to move back and forth deliberately, with approval gates, so a big multi-issue design change lands cleanly and stays in sync with a canonical reference both tools can read.

This plan does three things:
1. Defines the **Claude Code ↔ Claude Design loop** (roles, handoff artifacts, approval gates).
2. Resolves the core question — **DESIGN.md as the single source of truth both tools read** — by pulling a lightweight *research spike* from #264 to the front (research only; authoring still lands last).
3. Captures the loop as a **durable skill** (`claude-design-workflow`) so it's repeatable.

Nothing here changes tokens directly. The token decisions (#259–#261) are user + Claude Design calls made *inside* this loop, gate by gate.

---

## The operating model

**Claude Design = divergent / visual.** Explores palettes, season looks, spacing rhythm as *prototypes and token tables*. Answers "what should this look like."

**Claude Code = convergent / implementation.** Extracts ground truth → brief; translates Design's *token decisions* (never generated component code) into `/styles/*.css` by hand; verifies (build/preview/tests); opens PRs to the integration branch. Matches the #197 note that `/design-sync` doesn't fit and Design output is hand-translated.

**The handoff artifacts are the whole game:**
- **Claude Code → Design:** a *thin brief* — Design's **Codebase context reads `styles/colors.css` + `variables.css` directly**, so the brief only carries the *decisions needed* + hard constraints (CSS custom props, no Tailwind, `.season`-class model, all styles in `/styles/`). One brief per token issue.
- **Design → Claude Code:** a *palette / token table* (values + names + tiers), not code. Claude Code converts it to CSS.

**Approval gates (per issue):** (1) approve the brief before it goes to Design → (2) review Design's proposal *in Claude Design*, approve the token table → (3) Claude Code translates to CSS, approve the diff → (4) verify + open PR to `feature/issue-197-design-system`, approve merge. Four gates, so nothing lands without deliberate sign-off.

---

## DESIGN.md as the shared source of truth (the sync answer)

`DESIGN.md` is the canonical reference both tools use, with `CLAUDE.md` pointing at it. Target the **[design.md convention](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)** (Google Labs; the portable-design-context format Atlassian field-tested) — **not** W3C DTCG-JSON. A Style Dictionary / token-transformation pipeline is explicitly out of scope: overkill for a single project. CSS custom properties in `/styles/*.css` stay the **runtime** source of truth; `DESIGN.md` is authored *as a design.md file* and is the **portable/agent** layer on top.

- **`DESIGN.md` = a design.md file:** optional **YAML frontmatter** (a lightweight token mirror — `colors`, `typography`, `spacing`, `rounded`, `components`; `{path.to.token}` refs) + **markdown body** with sections in the spec's order: *Overview / Brand & Voice → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's & Don'ts*. No JSON, no build step. The frontmatter mirrors the CSS by hand (fine at this project's size).
- **The repo is canonical; both tools read it.** Claude Code reads `styles/*.css` + `DESIGN.md` directly; **Claude Design ingests them via its "Codebase" context** (design.md is built for design-tool interoperability); `CLAUDE.md` links to `DESIGN.md`. No separate copy to drift.
- **The Claude Design "Design system" picker is a *convenience snapshot*, not the source of truth.** The doc Design generates is a *page artifact inside the design file*, not a registered system, and a registered one can drift. **Rely on Codebase context (always fresh); treat picker-registration as optional.** Register the finalized system *once* after #259–#261 settle.
- **Pitfalls to design around (from Atlassian's test):** their token-cost / lossy-compression / context-truncation problems came from squeezing a 2.5 MB system into 80 KB — our whole token set fits in one design.md uncompressed, so those don't bite. The one that carries forward: design.md can nudge agents to *reinvent* components. Mitigation when we reach the Components section — point it at the real `/styles/components/*.css`, don't describe components abstractly. Keep DESIGN.md as high-level direction + token truth *alongside* `CLAUDE.md` and the existing skills, not as the only guidance.

---

## Re-sequencing: a #264 research spike goes first

The issues put #264 last ("documents reality"). But the **target taxonomy/naming/tier structure** must be known *before* #259 chooses the palette, or #259 will pick names it later has to rename. Resolution — **split #264**:

- **#264a — Research spike (up front, before #259).** Research only, no code PR. Settles the token-name mapping between our `--oe-*`/`--sp-*`/`--fs-*` CSS vars and design.md's recommended names, and how season theming maps to design.md. Output captured as a comment on #264 (and folded into the skill). This is the "north star" #259–#261 build toward.
- **#264b — Authoring (last).** Author the real `DESIGN.md` + point `CLAUDE.md` at it, *after* #259–#261 settle so it documents reality. This is the PR that closes #264.

**Recommended execution order:**
`#264a research spike` → `#259 color` → `#260 season` (depends on #259); `#261 spacing` runs in parallel; `#262 inline styles` + `#263 styled-components` run anytime in parallel (pure Claude Code, no Design); `#264b DESIGN.md` last.

### Naming convention settled in #264a

- **Primitive** tier keeps existing names — `--oe-{hue}-{100..900}`, `--sp-*`, `--fs-*`, `--fw-*`, `--br-*`, `--shadow-*`. No mass rename.
- **Semantic** tier (new, thin) uses **design.md vocabulary with the `--oe-` prefix**: `--oe-primary`, `--oe-secondary`, `--oe-surface`, `--oe-on-surface`, `--oe-error`. References primitives.
- **Component** tier (`--nav-*`, `--footer-*`, `--btn-*`) references semantic tokens.
- Seasons: one `.season`-class remap of `--season-*` semantic aliases, documented as four value-sets.

---

## Key files & references

- **Token source of truth:** `styles/colors.css`, `styles/variables.css`, `styles/global.css` (import order), `styles/base.css`.
- **Season tangle (for #260):** `styles/pages/seasons-pages.css`, `styles/components/teaser.css`, `styles/components/footer.css`, `styles/pages/home.css:82` (bug), `--fall-gradient-2` (undefined bug), `app/layout.js:46` vs `app/page.js:151` (two switch mechanisms), `utilities/helperUtil.js` + `utilities/constants.js` (season derivation).
- **Spacing (for #261):** `styles/variables.css` (`--sp-*` 14-step scale), `styles/utility/spacing.css`, the ~44 off-scale + width-shaped values (200–1600px, 9999px → new `--bp-*`/`--container-*` tier).
- **Inline styles (#262):** `components/NatureServeBadge.js`, `components/NatureServeMessage.js`, `components/PortTextWrapper.js`.
- **Dependency (#263):** `package.json` (`styled-components` v6.1.18, zero imports).
- **The loop skill:** `.claude/skills/claude-design-workflow/SKILL.md`; **the token doc (last):** `DESIGN.md`.

---

## Verification

- **Per token PR:** `npm run build`, `npm run lint`, `npm test` pass; visual check via the preview tools on primary pages (home, a plant profile, a season page). Season changes need per-season QA — verify each of spring/summer/fall/winter (temporary season override or manual date QA, since season is date-derived). Draft-only Sanity content isn't visible to preview tooling — request a screenshot for anything gated on unpublished content (per CLAUDE.md).
- **Loop health:** each PR bases on `feature/issue-197-design-system` (not `main`); sub-issues closed manually as merged (they won't auto-close into the integration branch); one final PR `feature/issue-197-design-system → main` titled `Closes #197:` lands everything.
- **Sync check:** after #264b, open a fresh Claude Design session with Codebase context and confirm it surfaces `DESIGN.md`.

## Sources
- [design.md spec (Google Labs)](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) — the target format
- [designmd.co](https://www.designmd.co/) — overview
- [Atlassian: what we learned testing design.md](https://www.atlassian.com/blog/how-we-build/atlassians-design-md-is-here-what-we-learned-testing-portable-design-context-in-practice) — pitfalls
- Rejected as overkill for this project: W3C DTCG-JSON + Style Dictionary token pipeline
