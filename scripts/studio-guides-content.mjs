/**
 * Content for the `studioGuide` documents seeded by seed-studio-guides.mjs.
 *
 * Kept separate from the seeding logic so the prose — the part that actually
 * needs reviewing — reads on its own.
 *
 * Passages marked with a `check()` block are ones written from what the repo and
 * docs establish rather than from observed editor workflow. They render as
 * blockquotes in the Studio so they stand out, and are meant to be confirmed or
 * corrected and then removed. They should not still be here when the guides are
 * considered finished.
 */

/** Splits `**bold**` runs into separate spans so guide prose stays readable here. */
const spans = (text, keyPrefix) =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return {
        _type: 'span',
        _key: `${keyPrefix}s${index}`,
        text: bold ? part.slice(2, -2) : part,
        marks: bold ? ['strong'] : [],
      }
    })

const block = (style, text, listItem) => (keyPrefix) => ({
  _type: 'block',
  _key: keyPrefix,
  style,
  ...(listItem ? { listItem, level: 1 } : {}),
  markDefs: [],
  children: spans(text, keyPrefix),
})

export const h2 = (text) => block('h2', text)
export const h3 = (text) => block('h3', text)
export const p = (text) => block('normal', text)
export const bullet = (text) => block('normal', text, 'bullet')
export const step = (text) => block('normal', text, 'number')
export const check = (text) => block('blockquote', `⟨CHECK: ${text}⟩`)

/** Assigns stable `_key`s so re-seeding produces byte-identical documents. */
export const buildBody = (blocks) => blocks.map((make, index) => make(`b${index}`))

export const STUDIO_GUIDES = [
  {
    id: 'studioGuide-structure-vs-presentation',
    order: 10,
    title: 'Structure vs. Presentation Mode',
    body: [
      p(
        'The Studio has two ways of looking at the same content. Which one you want depends on whether you are changing words or checking how they land on the page.',
      ),
      h2('Structure'),
      p(
        'This is the default view, and where most editing happens. On the left is a list of everything on the site, grouped by what it is — plants, seasons, pages, and so on. Click something and its form opens next to the list. It is a filing cabinet: quick to move around, but it shows you fields, not the website.',
      ),
      h2('Presentation'),
      p(
        'Presentation puts the live site beside the form. Type in a field and the page updates as you go, before anything is published. Use it when the question is **how does this look** rather than **what does this say** — checking that a description is not too long for its card, or that an image sits where you expect.',
      ),
      h2('Getting from one to the other'),
      p(
        'You do not have to navigate Presentation by hand. Open a document in Structure and look for the **Open in Presentation** button (the eye icon) in the row of buttons at the bottom of the form. It jumps straight to that document with the right page already loaded.',
      ),
      p('It works for the content that has a page of its own on the site:'),
      bullet('Native plants'),
      bullet('Seasons'),
      bullet('The landing page, the about page, and the plant list page'),
      p(
        'For a plant or a season the button stays greyed out until the document has a slug, because without one there is no address to preview. If it will not click, check the slug field first.',
      ),
      p(
        'Anything else — site settings, the menu, these guides — has no page of its own, so the button does not appear at all. That is expected, not a fault.',
      ),
    ],
  },
  {
    id: 'studioGuide-what-youll-be-editing',
    order: 20,
    title: "What You'll Be Editing",
    body: [
      p(
        'The left-hand list in Structure is the whole site. Here is what each part of it is for, top to bottom.',
      ),
      h2('Welcome Section'),
      p(
        'The introduction at the top of the home page. There is only ever one of these, so it opens straight into its form instead of a list.',
      ),
      h2('Native Plants'),
      p(
        'One document per wildflower, and the largest part of the site. Each holds the plant’s names, description, images, bloom timing, and its relationships to other plants and pollinators.',
      ),
      h2('Seasons'),
      p(
        'The season pages, each gathering the plants blooming at that time of year. Which plants appear is driven by the bloom information on the plants themselves, not typed in here.',
      ),
      h2('Pollinators'),
      p('The insects and animals referenced from plant pages.'),
      h2('Pages'),
      p(
        'A folder holding the four one-off pages: the **Landing Page**, the **About Page**, the **Plant List Page**, and the **404 Page** that shows when someone follows a broken link. There is exactly one of each, so they open directly into their form.',
      ),
      h2('Site Settings and Menu'),
      p(
        'Site Settings holds things that apply everywhere — the site title, defaults used for search results and link previews. Menu is the site’s navigation links. Both are single documents.',
      ),
      h2('Help & Guides and Learnings & Notes'),
      p(
        'The two sections at the bottom. Help & Guides is what you are reading; it is read-only. Learnings & Notes is yours to write in — see the guide on it further down this list.',
      ),
      check(
        'this describes the nav as configured, but not which of these you actually touch week to week. If some sections are effectively read-only for you in practice, say so and this guide can point that out',
      ),
    ],
  },
  {
    id: 'studioGuide-drafts-vs-published',
    order: 30,
    title: 'Drafts vs. Published',
    body: [
      p(
        'Nothing you type reaches the website until you publish it. That is the single most important thing to know about the Studio, and the cause of most "why is my change not showing?" moments.',
      ),
      h2('What happens when you type'),
      p(
        'The moment you change a field, the Studio saves a **draft**. This happens on its own — there is no save button, and you cannot lose work by closing the tab. The document is marked as having unpublished changes, and the list shows it as edited.',
      ),
      p(
        'The draft is private. Visitors to the site still see the last published version, however long the draft sits there.',
      ),
      h2('Publishing'),
      p(
        'The **Publish** button sits at the bottom of the form. Clicking it makes the draft the live version. From that point the change is public.',
      ),
      p(
        'If the button is greyed out, either there is nothing new to publish, or a required field is empty — the form will show which one.',
      ),
      h2('Seeing a change before publishing'),
      p(
        'Use Presentation (see the first guide). It renders the site from your draft, so you can read a change in place and then decide whether to publish it.',
      ),
      h2('Why a published change might still not appear'),
      p('In order of likelihood:'),
      step('The change is still a draft — the document never got published.'),
      step(
        'The right document was published, but a different one is shown on the page you are looking at.',
      ),
      step('The page is cached in your browser. A hard refresh clears it.'),
      p('If none of those explain it, that is worth reporting rather than working around.'),
      check(
        'this assumes you publish directly and do not use scheduled Releases. Releases is hidden for non-administrator accounts, so this should be accurate for the editor account — but confirm you never schedule publishing as an admin, or this guide needs a section on it',
      ),
    ],
  },
  {
    id: 'studioGuide-working-with-tags',
    order: 40,
    title: 'Working with Tags',
    body: [
      p(
        'Tags are labels on images in the Media library. They exist so you can find a picture again months later without scrolling through everything.',
      ),
      h2('Where they live'),
      p(
        'Open the **Media** tool from the top of the Studio. Every uploaded image is here, and each one can carry any number of tags.',
      ),
      h2('Tagging an image'),
      step('Open the Media tool.'),
      step('Click an image to open its details panel.'),
      step('Add tags in the tags field, then save.'),
      p('An image can hold several tags at once, so you do not have to pick a single best one.'),
      h2('Finding images by tag'),
      p(
        'The search panel filters on tags. Add a filter on the **Tags** facet and choose the tag you want. Tag filters combine with the others — folder, file type — so you can narrow down from both directions.',
      ),
      h2('Finding images with no tags'),
      p(
        'Untagged images are the ones that get lost, so there is a way to list them specifically. Add a filter on the **Tags** facet and choose the **is empty** operator instead of picking a tag. That shows only untagged images.',
      ),
      p(
        'Tag one and it drops out of that list. If it does not disappear straight away, refresh the Media list.',
      ),
      p('Working through that list occasionally is the cheapest way to keep the library usable.'),
      check(
        'the mechanics here are accurate, but not the vocabulary. What tags do you actually use, and is there a convention worth writing down — by plant, by season, by where the photo was taken? That is the part of this guide that would actually help, and it needs to come from you',
      ),
    ],
  },
  {
    id: 'studioGuide-content-agent',
    order: 45,
    title: 'Using the Content Agent',
    body: [
      p(
        'Sanity has a built-in assistant you can ask questions in plain English — the Content Agent. It can read everything on the site and answer things that would otherwise mean clicking through every plant one at a time.',
      ),
      p(
        'It is genuinely useful for a few specific jobs and genuinely wasteful for others. This guide is about telling those apart.',
      ),
      h2('Where it lives'),
      p(
        'Not in the Studio. It lives in the Sanity **Dashboard** — sign in at sanity.io and look for the chat panel on the right. That is worth knowing before you go hunting for it in the Studio and conclude it is missing.',
      ),
      h2('The one thing to understand first'),
      p(
        'The agent never changes anything on its own. It **proposes**, you approve. When you ask it to change something, the edits appear in a Changes panel for you to look over, and nothing exists until you click to confirm. Even then it only creates drafts — publishing is still your click, exactly as it is for anything else.',
      ),
      p(
        'So there is no way for it to quietly alter the site behind you. The risk is not that it changes things without asking; it is that you approve something without reading it closely.',
      ),
      h2('What it is genuinely good at here'),
      p(
        'The pattern to look for: **questions that span the whole site**. Anything you could answer yourself by opening one document is not worth asking it. Anything that would mean opening sixty is.',
      ),
      h3('Finding gaps'),
      bullet('"Which plants have no photographs?"'),
      bullet('"Which images are missing alt text?"'),
      bullet('"Which plants have not been touched in over a year?"'),
      bullet('"Which plants have the shortest descriptions?"'),
      h3('Tidying tags'),
      bullet('"Which media tags are barely used?"'),
      bullet('"Are any tags near-duplicates of each other?"'),
      bullet('"Which images have no tags at all?"'),
      h3('Understanding how things are set up'),
      p(
        'This is the underrated one. You can ask it about the shape of the site rather than the content:',
      ),
      bullet('"What fields does a native plant have?"'),
      bullet('"What has to be filled in before I can publish a plant?"'),
      bullet('"Which plants reference this pollinator?"'),
      h3('Checking your own consistency'),
      bullet('"Do any plant descriptions disagree with their bloom times?"'),
      bullet('"Which plants mention a pollinator in the text but have no pollinator linked?"'),
      h2('The one thing not to use it for'),
      p(
        'Do not let it write botanical facts. Bloom times, native range, growing conditions, whether something is edible or toxic — an AI will produce confident, fluent, plausible sentences that are wrong, and wrong plant information on a wildflower site is worse than no information.',
      ),
      p(
        'Asking it to tidy up wording you already wrote is fine. Asking it to tell you when something blooms is not. The test is simple: **would you need to check a reference book to write this sentence yourself?** If yes, do not let the agent write it either.',
      ),
      h2('What it costs, and why that matters here'),
      p(
        'The agent runs on credits, and this project is on Sanity’s free plan — a small allowance each month, which resets on the 1st and does not roll over. It is easy to spend a month’s worth in an afternoon without noticing.',
      ),
      p('Two things surprise people:'),
      bullet(
        '**Every message costs**, before any work happens. Asking a question, rephrasing it because the answer missed, and rephrasing again has cost you three times over.',
      ),
      bullet(
        '**The work costs on top**, and scales with how much it has to read. Asking about one plant is cheap. Asking it to read every plant description is not.',
      ),
      p(
        'For scale: a simple search runs a handful of credits, while changing a few documents runs several times that. It adds up faster than it feels like it should.',
      ),
      h3('The habit that saves the most'),
      p(
        'Before anything that sounds big, ask it to cost the job first: **"Estimate how many credits you would need to…"** and then describe what you want. It will tell you before spending anything, and you can decide whether it is worth it.',
      ),
      p(
        'Also: narrow first, then widen. Ask about five plants, see whether the answer is what you wanted, and only then ask about all of them.',
      ),
      p(
        'If it stops responding and mentions a limit, that is the monthly allowance gone. Nothing is broken — it comes back on the 1st.',
      ),
      h2('Other things worth knowing'),
      h3('Undo is shorter than you would expect'),
      p(
        'The agent has no undo of its own; the official advice is to use document history. On this project history only goes back a few days, so a bulk change you approve and then regret three weeks later cannot be rolled back that way. Say something quickly if a change turns out wrong — there is a separate backup, but recovering from it is a developer job, not a button.',
      ),
      p(
        'This is the strongest argument for approving changes in small batches you can actually read.',
      ),
      h3('Start a new chat for a new job'),
      p(
        'It remembers what you have been discussing, which helps within a task and hurts across tasks — leftover context from the last question can skew the next answer. When you move on to something unrelated, start a fresh chat.',
      ),
      h3('It cannot delete anything'),
      p('Deliberately. Deleting is always yours to do in the Studio.'),
      h3('It cannot change these guides'),
      p(
        'The Help & Guides pages are locked, and that lock applies to the agent too. If you ask it to fix something here, expect it to decline.',
      ),
      h2('A safe way to work'),
      step('Ask your question narrowly, on a handful of documents.'),
      step('Read the answer and check it against something you already know is true.'),
      step('If you want changes, ask for an estimate first when the job sounds large.'),
      step('Review each proposed change rather than confirming the batch on trust.'),
      step('Publish yourself, as normal.'),
      step('Note anything surprising in Learnings & Notes.'),
      check(
        'this assumes you have access to the Sanity Dashboard and are set up on the organisation — that is separate from your Studio login. If the chat panel is not there when you look, that is the likely reason and it needs sorting out before any of this applies',
      ),
      check(
        'the agent also needs to have seen the site’s current setup, which happens the first time someone opens the published Studio after an update. If it claims not to know about Learnings & Notes, open the Studio once and ask again',
      ),
    ],
  },
  {
    id: 'studioGuide-studio-troubleshooting',
    order: 50,
    title: 'Studio Troubleshooting',
    body: [
      h2('The Studio will not load'),
      p(
        'The Studio lives at **ozarkedgewildflowers.sanity.studio**. If you have an older bookmark pointing at a /studio address on the main site, it will not work any more — the Studio moved to its own address. Update the bookmark.',
      ),
      p('Log in with the Sanity account you were invited with.'),
      h2('A change is not on the website'),
      p(
        'Almost always the document was edited but not published. Open it and look for the Publish button at the bottom of the form; if it is active, there are unpublished changes. The guide on drafts and publishing covers the rest.',
      ),
      h2('The Publish button is greyed out'),
      p(
        'Either nothing has changed since the last publish, or a required field is empty. The form marks the field that is missing.',
      ),
      h2('A form is greyed out and will not let me type'),
      p(
        'If it is one of these guides, that is deliberate — they are read-only. Anywhere else, that is not expected and is worth reporting.',
      ),
      h2('Preview shows the wrong page, or nothing'),
      p(
        'The Open in Presentation button needs a slug for plants and seasons. If the document has no slug yet, the button stays disabled and the preview has no address to load.',
      ),
      h2('Something looks broken'),
      p(
        'Note what you were doing and what you expected instead, and write it up in Learnings & Notes under **Something Went Wrong**. That leaves a record with enough detail to actually chase down later, which a remembered description usually does not.',
      ),
      check(
        'these are the failures the setup makes likely, not the ones you have actually hit. Tell me which problems keep recurring for you and they should replace or lead this list',
      ),
    ],
  },
  {
    id: 'studioGuide-hints',
    order: 60,
    title: 'Hints',
    body: [
      p('Small things that make the Studio less tedious once you know them.'),
      h2('You cannot lose work by closing the tab'),
      p(
        'Edits save as drafts continuously. Closing the browser mid-sentence loses nothing — the draft is waiting when you come back.',
      ),
      h2('Draft is not the same as private-forever'),
      p(
        'A draft sitting unpublished for weeks is fine and breaks nothing. If you are unsure about a change, leaving it as a draft is a reasonable place to leave it.',
      ),
      h2('Use search rather than scrolling'),
      p(
        'With a large plant list, the search box at the top of the Studio is faster than scrolling a list, and it searches across content rather than only titles.',
      ),
      h2('Presentation is for judgement calls'),
      p(
        'When the question is whether something reads well or fits, look at it in Presentation rather than guessing from the form. Text that seems fine in a field can be too long on a card.',
      ),
      h2('Write the note while it is annoying you'),
      p(
        'Learnings & Notes is most useful when you write in it at the moment something confuses you, not afterwards when you have worked around it and forgotten the detail.',
      ),
      check(
        'these are inferred from how the Studio is set up rather than from watching you work. The genuinely useful version of this guide is the handful of things you worked out the hard way — those should replace these',
      ),
    ],
  },
  {
    id: 'studioGuide-recommendations-for-exploration',
    order: 70,
    title: 'Recommendations for Exploration',
    body: [
      p(
        'Things worth an idle twenty minutes. None of these can break anything, as long as you do not publish what you were only poking at.',
      ),
      h2('Open something in Presentation'),
      p(
        'Pick a plant, hit Open in Presentation, and edit its description while watching the page. Seeing the connection between a field and the page it produces makes the rest of the Studio easier to reason about.',
      ),
      h2('Look at how plants connect'),
      p(
        'Plant documents reference other plants and pollinators, and those references are what build the season pages and the "growing nearby" sections. Following one plant through its references shows how much of the site assembles itself.',
      ),
      h2('Filter the Media library by no tags'),
      p(
        'It is a quick way to see how much of the library is unlabelled, and tagging a handful is genuinely useful work that takes minutes.',
      ),
      h2('Write your first note'),
      p(
        'Even a short one. The categories in Learnings & Notes exist so that scattered observations end up grouped rather than lost.',
      ),
      h2('Try to break a required field'),
      p(
        'Empty a required field and try to publish. Seeing the Studio refuse, and where it puts the message, is worth knowing before it happens on something you care about.',
      ),
      check(
        'this is a reasonable tour, but it is a guess at what would be interesting to you rather than a response to what you want to understand better. Tell me what feels opaque and this guide should point there instead',
      ),
    ],
  },
]
