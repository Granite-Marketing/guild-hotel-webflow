// Builds docs/figma/build-plans/Q021/plan.json from hand-authored structure plus
// instance content extracted from the figma/ snapshot specs. Run from the repo root:
//   node docs/figma/build-plans/Q021/make-plan.mjs && node docs/figma/build-plans/Q021/build-preview.mjs
import fs from 'node:fs'

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const manifest = read('assets/asset-manifest.json').assets
const assetFor = (ref) => {
  const a = manifest.find((m) => m.figmaImageRef === ref)
  return { webflowAssetId: a?.webflowAssetId ?? null, webflowUrl: a?.webflowUrl ?? null, local: a?.localPath ?? null }
}

const chamfer = (x, y = x) =>
  `polygon(${x} 0, calc(100% - ${x}) 0, 100% ${y}, 100% calc(100% - ${y}), calc(100% - ${x}) 100%, ${x} 100%, 0 calc(100% - ${y}), 0 ${y})`

// ---------- classes ----------
const familyClasses = [
  { name: 'section_venue-card-fullbleed', styles: { desktop: { position: 'relative', 'background-color': 'var(--color-neutral-100)' } } },
  {
    name: 'venue-card-fullbleed_intro',
    note: 'Optional header above the stage (home/04 eyebrow heading; on wellness and meetings the Q023 intro may move here, see open questions).',
    styles: {
      desktop: { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'row-gap': '1.5rem', 'padding-top': '7rem', 'padding-left': '2rem', 'padding-right': '2rem', 'text-align': 'center', color: 'var(--color-accent)' },
      tablet: { 'padding-top': '5rem' },
      mobilePortrait: { 'padding-top': '3.5rem' },
    },
  },
  {
    name: 'venue-card-fullbleed_stage',
    note: 'data-scroll-enlarge-snap-stage. Its padding is the gap around the full-size frame.',
    styles: {
      desktop: { 'padding-top': '1.25rem', 'padding-bottom': '1.25rem', 'padding-left': '2.5rem', 'padding-right': '2.5rem' },
      mobilePortrait: { 'padding-top': '0.5rem', 'padding-bottom': '0.5rem', 'padding-left': '0.75rem', 'padding-right': '0.75rem' },
    },
  },
  {
    name: 'venue-card-fullbleed_media',
    note: 'data-scroll-enlarge-snap-media. The chamfered frame; corner size from figma/vectors/group-270990056-1520x988-288-4035.svg (34 to 36px). No max-width or max-height (module rule).',
    styles: {
      desktop: { position: 'relative', width: '100%', 'aspect-ratio': '1520 / 988', overflow: 'hidden', 'background-color': 'var(--color-neutral-300)', 'clip-path': chamfer('2.25rem', '2.125rem') },
      mobileLandscape: { 'aspect-ratio': 'auto', 'min-height': '37.5rem' },
      mobilePortrait: { 'clip-path': chamfer('1rem') },
    },
  },
  {
    name: 'venue-card-fullbleed_item',
    note: 'data-scroll-enlarge-snap-item, one per panel. A static card has exactly one.',
    styles: { desktop: { position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' } },
  },
  {
    name: 'venue-card-fullbleed_figure',
    styles: { desktop: { position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', margin: '0' } },
  },
  {
    name: 'venue-card-fullbleed_image',
    note: 'data-scroll-enlarge-snap-image on snap panels.',
    styles: { desktop: { display: 'block', width: '100%', height: '100%', 'object-fit': 'cover' } },
  },
  {
    name: 'venue-card-fullbleed_content',
    note: 'data-scroll-enlarge-snap-content. Also the dark scrim: Figma uses #000 at 0.3 to 0.45 per instance; one value, 0.4, is used everywhere.',
    styles: {
      desktop: { position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center', 'row-gap': '2.5rem', 'padding-top': '2.5rem', 'padding-bottom': '2.5rem', 'padding-left': '2.5rem', 'padding-right': '2.5rem', 'text-align': 'center', color: 'var(--color-neutral-100)', 'background-color': 'rgba(0, 0, 0, 0.4)' },
      mobilePortrait: { 'row-gap': '2rem', 'padding-left': '1.25rem', 'padding-right': '1.25rem' },
    },
  },
  {
    name: 'venue-card-fullbleed_header',
    styles: { desktop: { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'row-gap': '1.5rem', 'max-width': '61rem' } },
  },
  {
    name: 'venue-card-fullbleed_logo-wrapper',
    note: 'Optional: venue wordmark in place of the heading (home/05 to 07, dining-collection/04 to 06).',
    styles: { desktop: { width: '26rem', 'max-width': '100%', margin: '0' }, mobilePortrait: { width: '15rem' } },
  },
  { name: 'venue-card-fullbleed_logo', styles: { desktop: { display: 'block', width: '100%', height: 'auto' } } },
  {
    name: 'venue-card-fullbleed_text',
    note: 'Wraps the paragraph; size comes from a text-size-* utility on the same div. Line height 1.6 matches Gatch 22/35.2.',
    styles: { desktop: { 'max-width': '41.25rem', 'line-height': '1.6' } },
  },
  { name: 'venue-card-fullbleed_footer', styles: { desktop: { display: 'flex', 'justify-content': 'center' } } },
  {
    name: 'venue-card-fullbleed_tabs',
    note: 'Optional nav inside the media (dining-collection/03). Outside the items so it stays visible. Pill shape from figma/vectors/vector-25-886x56-266-1332.svg.',
    styles: {
      desktop: { position: 'absolute', left: '50%', bottom: '2.5rem', 'z-index': '50', display: 'flex', 'column-gap': '2.8125rem', 'padding-top': '1.0625rem', 'padding-bottom': '1.0625rem', 'padding-left': '2.25rem', 'padding-right': '2.25rem', transform: 'translateX(-50%)', 'white-space': 'nowrap', color: 'var(--color-neutral-100)', 'background-color': 'var(--color-brand-4a1217)', 'clip-path': chamfer('1.25rem', '1rem') },
      tablet: { 'column-gap': '1.75rem' },
      mobileLandscape: { left: '1rem', right: '1rem', bottom: '1rem', 'column-gap': '1.5rem', 'padding-left': '1.25rem', 'padding-right': '1.25rem', transform: 'none', 'overflow-x': 'auto', 'clip-path': chamfer('0.75rem') },
    },
  },
  {
    name: 'venue-card-fullbleed_tab',
    note: 'data-scroll-enlarge-snap-tab. Plus text-size-regular and text-style-eyebrow-caps. The module adds is-active.',
    styles: { desktop: { color: 'inherit', 'text-decoration': 'none', opacity: '0.7', 'padding-bottom': '0.25rem', 'border-bottom': '1px solid transparent' } },
  },
  {
    name: 'venue-card-fullbleed_list',
    note: 'Optional venue list under the header (home/15).',
    styles: { desktop: { 'grid-column-start': '1', 'grid-column-end': '-1', display: 'flex', 'flex-direction': 'column', width: '100%', 'margin-top': '3rem' }, mobilePortrait: { 'margin-top': '1.5rem' } },
  },
  {
    name: 'venue-card-fullbleed_list-link',
    styles: { desktop: { display: 'block', 'padding-top': '1.5rem', 'padding-bottom': '1.5rem', 'border-top': '1px solid rgba(244, 239, 223, 0.5)', color: 'inherit', 'text-decoration': 'none', opacity: '0.5' }, mobilePortrait: { 'padding-top': '1rem', 'padding-bottom': '1rem' } },
  },
]

const proposedShared = [
  {
    name: 'heading-style-display',
    why: 'Sackers Heavy Gothic 80/80 has no Relume level (heading-style-h1 is the 56px Hero). tokens.json counts 19 Sackers 80/80 text nodes (letter-spacing 0 and -4); all are venue-card headings today. A typography level, so it lives with the heading-style-* utilities, not in the family. Standalone class, not a combo.',
    styles: {
      desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '5rem', 'line-height': '1', 'font-weight': '400' },
      tablet: { 'font-size': '4rem' },
      mobileLandscape: { 'font-size': '3.25rem' },
      mobilePortrait: { 'font-size': '2.5rem' },
    },
  },
  {
    name: 'text-style-eyebrow-caps',
    comboOn: 'text-size-regular',
    why: 'Figma named style EYEBROW-CAPS; tokens.json suggests this combo. Used for the venue tabs here and for eyebrows across many components. Same name as other wave 2 plans so K01 merges one definition.',
    styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '1.125rem', 'line-height': '1.2', 'letter-spacing': '-0.03em', 'text-transform': 'lowercase' } },
  },
]

// Classes this plan uses but does not own. The preview needs values for them;
// these are assumptions from figma/tokens.json and the vectors, for K01 to check.
const reusedClassAssumptions = [
  { name: 'heading-style-h1', source: 'tokens.json Sackers Heavy Gothic/Display/Hero', styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '3.5rem', 'line-height': '1', 'font-weight': '400' }, mobilePortrait: { 'font-size': '2.5rem' } } },
  { name: 'heading-style-h2', source: 'tokens.json H2-CAPS', styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '2.5rem', 'line-height': '1', 'letter-spacing': '-0.05em', 'font-weight': '400' }, mobilePortrait: { 'font-size': '2rem' } } },
  { name: 'heading-style-h3', source: 'tokens.json H3-CAPS', styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '1.875rem', 'line-height': '1', 'letter-spacing': '-0.05em', 'font-weight': '400' }, mobilePortrait: { 'font-size': '1.5rem' } } },
  { name: 'heading-style-h4', source: 'tokens.json H4-CAPS', styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '1.5rem', 'line-height': '1.2', 'font-weight': '400' } } },
  { name: 'text-size-large', source: 'tokens.json Gatch Test 22/35.2', styles: { desktop: { 'font-family': 'var(--font-style-body)', 'font-size': '1.375rem' }, mobilePortrait: { 'font-size': '1.125rem' } } },
  { name: 'text-size-medium', source: 'tokens.json Paragraph 20/26', styles: { desktop: { 'font-family': 'var(--font-style-body)', 'font-size': '1.25rem', 'line-height': '1.3' } } },
  { name: 'text-size-regular', source: 'tokens.json Gatch Test/Body/Regular 18/28.8', styles: { desktop: { 'font-family': 'var(--font-style-body)', 'font-size': '1.125rem', 'line-height': '1.6' } } },
  {
    name: 'button',
    source: 'figma/vectors/vector-25-194x37-236-8217.svg (54 uses) and the Label / Button style. The site-wide button owner (K01 or the first shared entry to build it) decides the final values.',
    styles: { desktop: { display: 'inline-flex', 'justify-content': 'center', 'align-items': 'center', 'min-height': '2.3125rem', 'padding-left': '1.5rem', 'padding-right': '1.5rem', 'font-family': 'var(--font-style-heading)', 'font-size': '1rem', 'line-height': '1', 'text-transform': 'lowercase', 'text-decoration': 'none', color: 'var(--color-neutral-900)', 'background-color': 'var(--color-neutral-100)', 'clip-path': chamfer('0.75rem') } },
  },
  {
    name: 'is-outline',
    comboOn: 'button',
    source: 'home/11 and home/15: cream outline, transparent fill. A chamfered outline cannot come from border plus clip-path; the assumption is an outline SVG as background image (asset to upload).',
    styles: { desktop: { color: 'var(--color-neutral-100)', 'background-color': 'transparent', 'clip-path': 'none', 'background-image': 'url("button-outline.svg")', 'background-size': '100% 100%', 'background-repeat': 'no-repeat' } },
  },
]

const reusedClasses = reusedClassAssumptions.map((c) => c.name)

// ---------- tree ----------
// optional: element is removed when the instance has no content for it.
const tree = [
  {
    tag: 'section', classes: ['section_venue-card-fullbleed'], attributes: { 'data-scroll-enlarge-snap': '(snap groups only)' }, element: 'root',
    children: [
      {
        tag: 'header', classes: ['venue-card-fullbleed_intro'], optional: true, element: 'intro',
        children: [{ tag: 'h2', classes: ['heading-style-h4'], prop: 'introHeading' }],
      },
      {
        tag: 'div', classes: ['venue-card-fullbleed_stage'], attributes: { 'data-scroll-enlarge-snap-stage': '(snap groups only)' }, element: 'stage',
        children: [
          {
            tag: 'div', classes: ['venue-card-fullbleed_media'], attributes: { 'data-scroll-enlarge-snap-media': '(snap groups only)' }, element: 'media',
            children: [
              {
                tag: 'article', classes: ['venue-card-fullbleed_item'], attributes: { 'data-scroll-enlarge-snap-item': '(snap groups only)' }, repeat: 'items', element: 'item',
                children: [
                  {
                    tag: 'figure', classes: ['venue-card-fullbleed_figure'], element: 'figure', optional: true,
                    children: [{ tag: 'img', classes: ['venue-card-fullbleed_image'], attributes: { 'data-scroll-enlarge-snap-image': '(snap groups only)', loading: 'eager', 'data-eager': '' }, prop: 'image' }],
                  },
                  {
                    tag: 'div', classes: ['venue-card-fullbleed_content'], attributes: { 'data-scroll-enlarge-snap-content': '(snap groups only)' }, element: 'content',
                    children: [
                      {
                        tag: 'header', classes: ['venue-card-fullbleed_header'], element: 'header', optional: true,
                        children: [
                          { tag: 'figure', classes: ['venue-card-fullbleed_logo-wrapper'], optional: true, element: 'logo-wrapper', children: [{ tag: 'img', classes: ['venue-card-fullbleed_logo'], prop: 'logo' }] },
                          { tag: 'h3', classes: ['heading-style-display'], optional: true, prop: 'heading', note: 'Tag h3 inside a snap group (the intro is h2), h2 on a standalone card. Size class per instance: heading-style-display, heading-style-h1 or heading-style-h2.' },
                          { tag: 'div', classes: ['venue-card-fullbleed_text', 'text-size-large'], optional: true, element: 'text', note: 'Size class per instance: text-size-large, text-size-medium or text-size-regular.', children: [{ tag: 'p', classes: [], prop: 'text' }] },
                        ],
                      },
                      {
                        tag: 'footer', classes: ['venue-card-fullbleed_footer'], optional: true, element: 'footer',
                        children: [{ tag: 'a', classes: ['button'], attributes: { href: '#' }, prop: 'button', note: 'Add is-outline per instance (home/11, home/15).' }],
                      },
                      {
                        tag: 'div', classes: ['venue-card-fullbleed_list'], optional: true, element: 'list',
                        children: [{ tag: 'a', classes: ['venue-card-fullbleed_list-link'], attributes: { href: '#' }, repeat: 'list', children: [{ tag: 'div', classes: ['heading-style-h3'], prop: 'listLabel' }] }],
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'nav', classes: ['venue-card-fullbleed_tabs'], optional: true, element: 'tabs', attributes: { 'aria-label': '(venue group name)' },
                children: [{ tag: 'a', classes: ['venue-card-fullbleed_tab', 'text-size-regular', 'text-style-eyebrow-caps'], attributes: { href: '#', 'data-scroll-enlarge-snap-tab': '' }, repeat: 'tabs', prop: 'tabLabel' }],
              },
            ],
          },
        ],
      },
    ],
  },
]

// ---------- variants ----------
const variants = [
  {
    modifier: 'is-media-center', briefVariant: 'is-media-center',
    meaning: 'Snap group start state: the frame starts at 83% of the stage content box (1261 of 1520), 16:9, centred in a 100svh stage. scrollEnlargeSnap grows it to the stage content box.',
    crop: 'figma/pages/home/sections/04-an-unexpected-resort-dining-experience/section.webp',
    deltas: [
      { on: 'venue-card-fullbleed_stage', styleDeltas: { desktop: { display: 'flex', 'justify-content': 'center', 'align-items': 'center', height: '100svh' } } },
      { on: 'venue-card-fullbleed_media', styleDeltas: { desktop: { width: '83%', 'aspect-ratio': '1261 / 712' }, mobileLandscape: { width: '88%', 'aspect-ratio': '3 / 4', 'min-height': '0' } } },
    ],
  },
  {
    modifier: 'is-tall', briefVariant: 'is-2-images + is-tall',
    meaning: 'Standalone edge-to-edge card, about square, no chamfer and no stage gap (home/11).',
    crop: 'figma/pages/home/sections/11-rooms-suites/section.webp',
    deltas: [
      { on: 'venue-card-fullbleed_stage', styleDeltas: { desktop: { 'padding-top': '0', 'padding-bottom': '0', 'padding-left': '0', 'padding-right': '0' } } },
      { on: 'venue-card-fullbleed_media', styleDeltas: { desktop: { 'aspect-ratio': '1600 / 1579', 'clip-path': 'none' }, mobileLandscape: { 'aspect-ratio': 'auto', 'min-height': '45rem' } } },
      { on: 'venue-card-fullbleed_header', styleDeltas: { desktop: { 'row-gap': '2rem', 'max-width': '22rem' } } },
    ],
  },
  {
    modifier: 'is-left', briefVariant: 'is-left',
    meaning: 'Standalone edge-to-edge card, 16:9, content bottom-left with the CTA on the right and an optional venue list below (home/15).',
    crop: 'figma/pages/home/sections/15-meetings-events/section.webp',
    deltas: [
      { on: 'venue-card-fullbleed_stage', styleDeltas: { desktop: { 'padding-bottom': '0', 'padding-left': '0', 'padding-right': '0' } } },
      { on: 'venue-card-fullbleed_media', styleDeltas: { desktop: { 'aspect-ratio': '16 / 9', 'clip-path': 'none' }, mobileLandscape: { 'aspect-ratio': 'auto', 'min-height': '45rem' } } },
      { on: 'venue-card-fullbleed_content', styleDeltas: { desktop: { display: 'grid', 'grid-template-columns': '1fr auto', 'align-content': 'end', 'align-items': 'center', 'justify-items': 'start', 'column-gap': '2rem', 'row-gap': '0', 'padding-bottom': '0', 'text-align': 'left' }, mobileLandscape: { 'grid-template-columns': '1fr', 'row-gap': '1.5rem' } } },
      { on: 'venue-card-fullbleed_header', styleDeltas: { desktop: { 'align-items': 'flex-start', 'row-gap': '1.5rem' } } },
    ],
  },
  {
    modifier: 'is-active', briefVariant: '(state, set by scrollEnlargeSnap or the page)',
    meaning: 'Active tab or list row.',
    crop: 'figma/pages/dining-collection/sections/03-zuma/section.webp',
    deltas: [
      { on: 'venue-card-fullbleed_tab', styleDeltas: { desktop: { opacity: '1', 'border-bottom-color': 'currentColor' } } },
      { on: 'venue-card-fullbleed_list-link', styleDeltas: { desktop: { opacity: '1' } } },
    ],
  },
]

// ---------- instances ----------
const sections = [
  // [page/section, briefVariant, group, role]
  ['home/04-an-unexpected-resort-dining-experience', 'is-media-center', 'home-venues', 'root'],
  ['home/05-dress-up-for-the-rich-worldly', 'base', 'home-venues', 'item'],
  ['home/06-cocktail-classics-and-drinks-for-connaisseurs', 'base', 'home-venues', 'item'],
  ['home/07-our-new-pool-serves-up-san', 'base', 'home-venues', 'item'],
  ['home/08-lobby-terrace', 'base', 'home-venues', 'item'],
  ['home/09-solana-coffee', 'base', 'home-venues', 'item'],
  ['home/11-rooms-suites', 'is-2-images + is-tall', 'home-rooms', 'standalone'],
  ['home/15-meetings-events', 'is-left', 'home-meetings', 'standalone'],
  ['dining-collection/03-zuma', 'is-left + is-media-center', 'dining-venues', 'root'],
  ['dining-collection/04-dress-up-for-the-rich-worldly', 'base', 'dining-venues', 'item'],
  ['dining-collection/05-cocktail-classics-and-drinks-for-connaisseurs', 'base', 'dining-venues', 'item'],
  ['dining-collection/06-our-new-pool-serves-up-san', 'base', 'dining-venues', 'item'],
  ['dining-collection/07-garden-terrace', 'base', 'dining-venues', 'item'],
  ['dining-collection/08-solana-coffee', 'base', 'dining-venues', 'item'],
  ['wellness-collection/03-in-room-wellness', 'base', 'wellness-venues', 'item'],
  ['wellness-collection/04-fitness-center', 'base', 'wellness-venues', 'item'],
  ['wellness-collection/05-mindful-dining', 'base', 'wellness-venues', 'item'],
  ['wellness-collection/06-wellness-events', 'base', 'wellness-venues', 'item'],
  ['meetings-collection/03-council-boardroom', 'is-cream + is-no-image', 'meetings-venues', 'item'],
  ['meetings-collection/04-lobby-terrace', 'base', 'meetings-venues', 'item'],
  ['meetings-collection/05-1-america-plaza', 'base', 'meetings-venues', 'item'],
  ['legal/06-small-conference-center', 'base', 'legal-venues', 'item'],
  ['legal/07-large-conference-center', 'base', 'legal-venues', 'item'],
  ['legal/08-council-boardroom', 'base', 'legal-venues', 'item'],
  ['legal/09-one-columbia-place', 'base', 'legal-venues', 'item'],
  ['corporate/06-small-conference-center', 'base', 'corporate-venues', 'item'],
  ['corporate/07-large-conference-center', 'base', 'corporate-venues', 'item'],
  ['corporate/08-council-boardroom', 'base', 'corporate-venues', 'item'],
  ['corporate/09-one-columbia-place', 'base', 'corporate-venues', 'item'],
]

const logos = {
  'group-270989670-416x101-250-1958.svg': 'Zuma',
  'a-738x232-433-5771.svg': 'The Lobby Bar',
  'a-682x148-433-5793.svg': 'Pool Lounge',
}
const logoBySection = {
  'home/05-dress-up-for-the-rich-worldly': 'group-270989670-416x101-250-1958.svg',
  'dining-collection/04-dress-up-for-the-rich-worldly': 'group-270989670-416x101-250-1958.svg',
  'home/06-cocktail-classics-and-drinks-for-connaisseurs': 'a-738x232-433-5771.svg',
  'dining-collection/05-cocktail-classics-and-drinks-for-connaisseurs': 'a-738x232-433-5771.svg',
  'home/07-our-new-pool-serves-up-san': 'a-682x148-433-5793.svg',
  'dining-collection/06-our-new-pool-serves-up-san': 'a-682x148-433-5793.svg',
}

const clean = (s) => s.replace(/\s+/g, ' ').trim()
const instances = sections.map(([key, briefVariant, group, role]) => {
  const [page, section] = key.split('/')
  const specPath = `figma/pages/${page}/sections/${section}/spec.json`
  const spec = read(specPath)
  const content = {}
  const classes = {}
  for (const t of spec.texts) {
    const c = clean(t.characters)
    if (t.fontSize === 16) { content.button = c.toLowerCase(); continue }
    if (t.fontSize === 80) { content.heading = c; classes.heading = 'heading-style-display'; continue }
    if (t.fontSize === 56) { content.heading = c; classes.heading = 'heading-style-h1'; continue }
    if (t.fontSize === 40) { content.heading = c; classes.heading = 'heading-style-h2'; continue }
    if (t.fontSize === 30) { (content.list ??= []).push(c); continue }
    if (t.fontSize === 24) { content.introHeading = c; continue }
    if (t.fontSize === 22) { content.text = c; classes.text = 'text-size-large'; continue }
    if (t.fontSize === 20) { content.text = c; classes.text = 'text-size-medium'; continue }
    if (t.fontSize === 18 && t.fontFamily === 'Gatch Test') { content.text = c; classes.text = 'text-size-regular'; continue }
    if (t.fontSize === 18) { (content.tabs ??= []).push(c); continue }
  }
  const logo = logoBySection[key]
  if (logo) content.logo = { svg: `figma/vectors/${logo}`, alt: logos[logo], webflowAssetId: null }
  const img = spec.images[0]
  if (img) content.image = { figmaImageRef: img.imageRef, ...assetFor(img.imageRef) }
  if (key === 'home/11-rooms-suites' || key === 'home/15-meetings-events') classes.button = 'button is-outline'
  const scrim = spec.colors.find((c) => c.hex === '#000000' && c.opacity < 1)
  const plannedVariant =
    role === 'root' ? 'is-media-center' : key === 'home/11-rooms-suites' ? 'is-tall' : key === 'home/15-meetings-events' ? 'is-left' : 'base'
  return {
    page, section: key, briefVariant, plannedVariant, group, role,
    spec: specPath, crop: `figma/pages/${page}/sections/${section}/section.webp`,
    classes, content,
    figmaScrimOpacity: scrim?.opacity ?? null,
    ...(spec.images.length === 0 ? { note: 'No image in Figma: a #D9D9D9 placeholder card. Needs an image before launch; the media background shows meanwhile.' } : {}),
  }
})

const groups = [
  { group: 'home-venues', page: 'home', root: 'home/04-an-unexpected-resort-dining-experience', modifier: 'is-media-center', snap: true, attributes: { 'data-scroll-enlarge-snap': '', 'data-scroll-enlarge-snap-step': '80' }, items: ['home/05', 'home/06', 'home/07', 'home/08', 'home/09'], tabs: false, intro: true },
  { group: 'dining-venues', page: 'dining-collection', root: 'dining-collection/03-zuma', modifier: 'is-media-center', snap: true, attributes: { 'data-scroll-enlarge-snap': '' }, items: ['dining-collection/04', 'dining-collection/05', 'dining-collection/06', 'dining-collection/07', 'dining-collection/08'], tabs: true, intro: false },
  { group: 'wellness-venues', page: 'wellness-collection', root: 'wellness-collection/02 (Q023 owns the intro and start frame today)', modifier: 'is-media-center', snap: true, attributes: { 'data-scroll-enlarge-snap': '' }, items: ['wellness-collection/03', 'wellness-collection/04', 'wellness-collection/05', 'wellness-collection/06'], tabs: true, intro: true, openQuestion: 'Q021-OQ2' },
  { group: 'meetings-venues', page: 'meetings-collection', root: 'meetings-collection/02 (Q023 owns the intro and start frame today)', modifier: 'is-media-center', snap: true, attributes: { 'data-scroll-enlarge-snap': '' }, items: ['meetings-collection/03', 'meetings-collection/04', 'meetings-collection/05'], tabs: true, intro: true, openQuestion: 'Q021-OQ2' },
  { group: 'legal-venues', page: 'legal', root: null, modifier: null, snap: false, items: ['legal/06', 'legal/07', 'legal/08', 'legal/09'], note: 'No animation note and no start frame: four static base cards, one section each (no data attributes). See Q021-OQ3.', openQuestion: 'Q021-OQ3' },
  { group: 'corporate-venues', page: 'corporate', root: null, modifier: null, snap: false, items: ['corporate/06', 'corporate/07', 'corporate/08', 'corporate/09'], note: 'Same as legal (identical content). See Q021-OQ3.', openQuestion: 'Q021-OQ3' },
  { group: 'home-rooms', page: 'home', root: 'home/11-rooms-suites', modifier: 'is-tall', snap: false, items: ['home/11'] },
  { group: 'home-meetings', page: 'home', root: 'home/15-meetings-events', modifier: 'is-left', snap: false, items: ['home/15'] },
]

const assets = []
const seen = new Set()
for (const i of instances) {
  const im = i.content.image
  if (im && !seen.has(im.figmaImageRef)) {
    seen.add(im.figmaImageRef)
    assets.push({ slot: 'image', figmaImageRef: im.figmaImageRef, webflowAssetId: im.webflowAssetId, webflowUrl: im.webflowUrl, local: im.local, usedBy: instances.filter((x) => x.content.image?.figmaImageRef === im.figmaImageRef).map((x) => x.section) })
  }
  const lg = i.content.logo
  if (lg && !seen.has(lg.svg)) {
    seen.add(lg.svg)
    assets.push({ slot: 'logo', local: lg.svg, webflowAssetId: null, note: 'SVG not uploaded yet (figma/assets.json webflowAssetId null). Upload before the build.', usedBy: instances.filter((x) => x.content.logo?.svg === lg.svg).map((x) => x.section) })
  }
}
assets.push({ slot: 'button-outline', local: 'docs/figma/build-plans/Q021/button-outline.svg', webflowAssetId: null, note: 'Chamfered outline for button is-outline; generated from the 194x37 button vector. Belongs to the button owner; listed so it is not missed.' })

const plan = {
  entry: 'Q021',
  component: 'venue-card-fullbleed',
  buildOn: { page: 'home', pageId: '6ad64060ae8eac6d7b7c4241', section: 'home/04-an-unexpected-resort-dining-experience', note: 'Build the home snap group (home/04 to 09) as the first instance, convert the section to a Webflow component, then insert instances elsewhere.' },
  siteId: '6ad6405eae8eac6d7b7c41a3',
  reusedClasses,
  reusedClassAssumptions,
  familyClasses,
  proposedShared,
  variables: ['color-neutral-100', 'color-neutral-300', 'color-neutral-900', 'color-accent', 'color-brand-4a1217', 'font-style-heading', 'font-style-body'],
  tree,
  variants: variants.flatMap((v) => v.deltas.map((d) => ({ modifier: v.modifier, briefVariant: v.briefVariant, meaning: v.meaning, on: d.on, styleDeltas: d.styleDeltas, crop: v.crop }))),
  props: [
    { name: 'introHeading', type: 'text', element: 'venue-card-fullbleed_intro', optional: true },
    { name: 'image', type: 'image', element: 'venue-card-fullbleed_image', optional: true },
    { name: 'imageAlt', type: 'text', element: 'venue-card-fullbleed_image' },
    { name: 'logo', type: 'image', element: 'venue-card-fullbleed_logo', optional: true },
    { name: 'heading', type: 'text', element: 'venue-card-fullbleed_header (h2 or h3)', optional: true },
    { name: 'text', type: 'text', element: 'venue-card-fullbleed_text', optional: true },
    { name: 'buttonLabel', type: 'text', element: 'button', optional: true },
    { name: 'buttonLink', type: 'link', element: 'button', optional: true },
    { name: 'tabs', type: 'repeat (text)', element: 'venue-card-fullbleed_tab', optional: true },
    { name: 'list', type: 'repeat (text + link)', element: 'venue-card-fullbleed_list-link', optional: true },
  ],
  propsNote: 'Webflow component props cannot repeat elements. Build the section once as a component for the static cards (home/11, home/15, legal, corporate); snap groups have 3 to 5 items each, so build them as plain sections from the same classes (or a component per group with no props). See Q021-OQ4.',
  groups,
  assets,
  instances,
  openQuestions: [
    { id: 'Q021-OQ1', question: 'Most "instances" are panels of one scrollEnlargeSnap group, not sections. Plan builds 4 snap sections (home, dining, wellness, meetings) whose items are the panel instances. Confirm.', default: 'Yes, as planned.' },
    { id: 'Q021-OQ2', question: 'Wellness and meetings: the intro and start frame sit in wellness-collection/02 and meetings-collection/02 (Q023 tab-pills-intro, is-media-center), but the snap root must contain both the frame and the panels. Either Q023 hands its intro to venue-card-fullbleed_intro (this plan supports it: intro header plus tabs) or Q023 hosts the snap markup with these classes.', default: 'venue-card-fullbleed owns the whole snap section; Q023 drops those two instances. Needs the Q023 plan and K01 to agree.' },
    { id: 'Q021-OQ3', question: 'Legal and corporate 06 to 09 have no animation note and no start frame. Static stack of four cards, or a snap group that starts full size?', default: 'Static stack (four base sections).' },
    { id: 'Q021-OQ4', question: 'Webflow component shape: one component for static cards with props, snap groups as plain sections using the same classes. Alternative: one component per snap group with no props.', default: 'As planned.' },
    { id: 'Q021-OQ5', question: 'home/15 venue list (council boardroom, courtyard, conference center): rows fade towards the bottom in Figma. Static links with the first row is-active, or does it switch the background image on hover?', default: 'Static links, first row is-active, no JS.' },
    { id: 'Q021-OQ6', question: 'meetings-collection/03 is a #D9D9D9 placeholder with a #484848 square in Figma: which image goes there, and is the square a real element (logo or badge)?', default: 'Base panel; image to come; square ignored.' },
    { id: 'Q021-OQ7', question: 'Dining tabs read "lobby terrace" but panel 07 is "garden terrace". Which name?', default: 'Use the panel name (garden terrace) for both.' },
    { id: 'Q021-OQ8', question: 'Logo panels (Zuma, The Lobby Bar, Pool Lounge) have a wordmark and no text heading. Keep a visually hidden h3 with the venue name for headings order, or rely on the logo alt text?', default: 'Logo alt only; the tabs and intro give context.' },
    { id: 'Q021-OQ9', question: 'clip-path (chamfered frame, tabs and button) may not be settable through the Designer API. Fallback: a small site-wide CSS block in the head custom code for these three selectors.', default: 'Try the style panel; fall back to site CSS.' },
    { id: 'Q021-OQ10', question: 'is-left (home/15) shares the frame, content and button with the family but adds a grid layout and a venue list. Keep it as a modifier or split it into its own unique section?', default: 'Kept as a modifier because the classes and DOM are shared. If the Designer build finds the grid fights the base content, build home/15 as a unique section instead (orchestrator guidance: when unsure, prefer a unique item).' },
  ],
  deviations: [
    { what: 'is-2-images dropped', why: 'home/11 has two image nodes with the same imageRef and the same box; one image renders the same result. Only is-tall is kept.' },
    { what: 'is-left + is-media-center on dining-collection/03 becomes is-media-center plus the optional tabs nav', why: 'The "left" text is the tab labels inside a centred tab bar; the frame and content are not left aligned. The tabs are an optional element, not a variant.' },
    { what: 'is-cream + is-no-image on meetings-collection/03 becomes a base panel with no image', why: 'The crop is a #D9D9D9 placeholder card on the cream page, the same chrome as every base card. Without an image the media background (color-neutral-300) shows; no modifier needed.' },
    { what: 'is-media-center is a snap group start state, not a static layout', why: 'home/04 and dining/03 are the first frame of Home-Animation-1. The modifier sets the start size that scrollEnlargeSnap enlarges.' },
    { what: 'No padding-global or container-*', why: 'The frame is full bleed with a 2.5rem gap (the snap stage padding); a max-width container would stop the enlarge at 80rem.' },
    { what: 'Scrim opacity unified at 0.4', why: 'Figma varies 0.3 to 0.45 per instance with no visible intent; per-instance values are in instances[].figmaScrimOpacity.' },
    { what: 'Modifiers are set on each element they change', why: 'Webflow cannot style descendants from a parent combo class, so is-tall, is-left and is-media-center are applied to the stage, media, content and header elements as listed in variants.' },
  ],
}

fs.mkdirSync('docs/figma/build-plans/Q021', { recursive: true })
fs.writeFileSync('docs/figma/build-plans/Q021/plan.json', JSON.stringify(plan, null, 2) + '\n')
console.log('instances', instances.length, 'assets', assets.length)
