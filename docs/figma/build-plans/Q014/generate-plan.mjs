// Generates plan.json from the figma/ snapshot specs and the asset manifest. Run from the repo root:
// node docs/figma/build-plans/Q014/generate-plan.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const C = 'hero-fullbleed-centered'
const spec = (id) => {
  const [page, section] = id.split('/')
  return JSON.parse(readFileSync(`figma/pages/${page}/sections/${section}/spec.json`, 'utf8'))
}
const manifest = JSON.parse(readFileSync('assets/asset-manifest.json', 'utf8')).assets
const assetFor = (ref) => manifest.find((a) => a.figmaImageRef === ref)

const instanceIds = `home/01-the-bold-handsome-heart-of-san dining-collection/01-a-taste-of-the-guild rooms-collection/01-rooms-suites wellness-collection/01-wellness-at-the-guild meetings-collection/01-meetings-events-at-the-guild history/01-a-bold-promise guidelines/01-photoshoot-guidelines rooms-individual/01-deluxe-king-suite rooms-individual/05-etiam-imperdiet-sodales-dui-a-vestibulum press/01-press gallery/01-gallery arts/01-art-collection arts/04-etiam-imperdiet-sodales-dui-a-vestibulum neighborhood/01-a-city-at-your-fingertips dining-zuma/01-zuma-san-diego dining-gardenterrace/01-garden-terrace dining-lobbybar/01-lobby-bar dining-poollounge/01-pool-lounge legal/01-retreat-for-corporate-teams corporate/01-retreat-for-corporate-teams happenings-collection/01-happenings blog-collection/01-blog happenings-indiv/01-locals-night-at-rodeo-bar blog-indiv/01-locals-night-at-rodeo-bar`.split(' ')

const instances = instanceIds.map((id) => {
  const s = spec(id)
  const [page] = id.split('/')
  const heading = s.texts.find((t) => t.styleName === 'H2-CAPS')
  const body = s.texts.find((t) => t.fontFamily === 'Gatch Test')
  const eyebrow = s.texts.find((t) => t.styleName === 'EYEBROW-CAPS')
  const button = s.texts.find((t) => /Button|CAPS-CAPTION-16/.test(t.styleName || ''))
  const image = s.images[0]
  const modifiers = []
  if (heading && heading.fill === '#262118') modifiers.push({ class: 'is-text-dark', on: `section_${C}` })
  if (eyebrow && eyebrow.textAlignHorizontal === 'LEFT') modifiers.push({ class: 'is-left', on: `${C}_component` })
  const content = {}
  if (eyebrow) content.eyebrow = eyebrow.characters
  if (heading) content.heading = heading.characters
  if (body) content.text = body.characters
  if (button) content.buttonText = button.characters
  if (button) {
    content.buttonColor = s.colors.find((c) => c.hex === '#489CCA')
      ? 'is-blue'
      : s.colors.find((c) => c.hex === '#4A1217')
        ? 'is-burgundy'
        : 'cream (no colour modifier)'
  }
  if (page === 'dining-zuma') content.logo = 'figma/vectors/group-270989670-416x101-250-1958.svg'
  if (image) {
    const asset = assetFor(image.imageRef)
    content.image = { imageRef: image.imageRef, webflowAssetId: asset.webflowAssetId, local: asset.localPath }
  }
  return {
    page,
    section: id,
    variant: modifiers.length ? modifiers.map((m) => m.class).join(' + ') : 'base',
    modifiers,
    content,
  }
})

const size = (desktop, rest = {}) => ({ desktop, tablet: {}, mobileLandscape: {}, mobilePortrait: {}, ...rest })

const plan = {
  entry: 'Q014',
  component: C,
  buildOn: { page: 'home', pageId: '6ad64060ae8eac6d7b7c4241', section: 'home/01-the-bold-handsome-heart-of-san' },
  reusedClasses: ['padding-global', 'padding-section-small', 'container-large', 'heading-style-h2', 'text-size-large', 'text-size-regular', 'button'],
  familyClasses: [
    {
      name: `section_${C}`,
      styles: size(
        {
          position: 'relative',
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-end',
          'min-height': '100vh',
          overflow: 'hidden',
          'background-color': 'var(--color-neutral-300)',
          color: 'var(--color-neutral-100)',
        },
        { mobilePortrait: { 'min-height': '100svh' } },
      ),
    },
    {
      name: `${C}_figure`,
      styles: size({ position: 'absolute', inset: '0', 'z-index': '0', margin: '0' }),
    },
    {
      name: `${C}_image`,
      styles: size({ display: 'block', width: '100%', height: '100%', 'object-fit': 'cover' }),
    },
    {
      name: `${C}_logo-wrapper`,
      styles: size(
        { position: 'absolute', top: '50%', left: '50%', 'z-index': '1', width: '26rem', margin: '0', transform: 'translate(-50%, -50%)' },
        { tablet: { width: '20rem' }, mobilePortrait: { width: '14rem' } },
      ),
    },
    {
      name: `${C}_logo`,
      styles: size({ display: 'block', width: '100%', height: 'auto' }),
    },
    {
      name: `${C}_component`,
      styles: size({
        position: 'relative',
        'z-index': '2',
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'row-gap': '1.75rem',
        'text-align': 'center',
      }),
    },
    {
      name: `${C}_header`,
      styles: size({
        display: 'flex',
        'flex-direction': 'column',
        'row-gap': '1.75rem',
        'max-width': '56.25rem',
      }, { mobilePortrait: { 'row-gap': '1.25rem' } }),
    },
    {
      name: `${C}_footer`,
      styles: size({ display: 'flex', 'justify-content': 'center' }),
    },
    {
      name: `${C}_text`,
      styles: size({ 'max-width': '53.375rem', 'line-height': '1.6' }),
    },
    {
      name: 'is-text-dark',
      comboOf: `section_${C}`,
      styles: size({ color: 'var(--color-neutral-900)' }),
    },
    {
      name: 'is-left',
      comboOf: `${C}_component`,
      styles: size({ 'align-items': 'flex-start', 'max-width': '44rem', 'text-align': 'left' }, { mobileLandscape: { 'max-width': 'none' } }),
    },
  ],
  proposedShared: [
    {
      name: 'text-style-eyebrow-caps',
      on: 'text-size-regular',
      why: 'EYEBROW-CAPS style (Sackers 18/21.6, lowercase input rendered as caps); also proposed by Q013. Combo per the brief token mapping.',
      styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '1.125rem', 'line-height': '1.2', 'letter-spacing': '-0.03em', 'text-transform': 'lowercase' } },
    },
    {
      name: 'text-style-button',
      on: 'text-size-regular',
      why: 'Sackers Heavy Gothic / Label / Button (95 uses site-wide): every button label.',
      styles: { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '1rem', 'line-height': '1', 'letter-spacing': '0', 'text-transform': 'lowercase' } },
    },
    {
      name: 'is-octagon',
      on: 'button',
      why: 'Guild button shape (figma/vectors/vector-25-194x37-236-8217.svg, chamfered corners); used by every CTA button in the design, not only this hero.',
      styles: {
        desktop: {
          display: 'inline-flex',
          'justify-content': 'center',
          'align-items': 'center',
          'min-width': '12.125rem',
          'min-height': '2.3125rem',
          padding: '0.65625rem 1.25rem',
          border: '0',
          'border-radius': '0',
          'background-color': 'var(--color-neutral-100)',
          color: 'var(--color-neutral-900)',
          'text-decoration': 'none',
          'clip-path': 'polygon(0 67.1%, 0 32.4%, 0.6875rem 0, calc(100% - 0.7334rem) 0, 100% 32.4%, 100% 67.1%, calc(100% - 0.7334rem) 100%, 0.6875rem 100%)',
        },
      },
    },
    {
      name: 'is-burgundy',
      on: 'button',
      why: 'Burgundy button fill (#4A1217) on dining venue heroes; generic colour modifier for any button.',
      styles: { desktop: { 'background-color': 'var(--color-brand-4a1217)', color: 'var(--color-secondary)' } },
    },
    {
      name: 'is-blue',
      on: 'button',
      why: 'Zuma blue button fill (#489CCA); generic colour modifier for any button.',
      styles: { desktop: { 'background-color': 'var(--color-brand-489cca)', color: 'var(--color-secondary)' } },
    },
  ],
  variables: [
    'color-neutral-100',
    'color-neutral-900',
    'color-neutral-300',
    'color-secondary',
    'color-brand-4a1217',
    'color-brand-489cca',
    'font-style-heading',
    'font-style-body',
  ],
  tree: [
    {
      tag: 'section',
      classes: [`section_${C}`],
      attributes: {},
      children: [
        {
          tag: 'figure',
          classes: [`${C}_figure`],
          optional: 'image', attributes: {},
          children: [{ tag: 'img', classes: [`${C}_image`], attributes: { src: '{image}', alt: '', loading: 'eager', 'data-eager': '' }, children: [] }],
        },
        {
          tag: 'figure',
          classes: [`${C}_logo-wrapper`],
          optional: 'logo', attributes: {},
          children: [{ tag: 'img', classes: [`${C}_logo`], attributes: { src: '{logo}', alt: '{logoAlt}' }, children: [] }],
        },
        {
          tag: 'div',
          classes: ['padding-global', 'padding-section-small'],
          attributes: {},
          children: [
            {
              tag: 'div',
              classes: ['container-large'],
              attributes: {},
              children: [
                {
                  tag: 'article',
                  classes: [`${C}_component`],
                  attributes: {},
                  children: [
                    {
                      tag: 'header',
                      classes: [`${C}_header`],
                      attributes: {},
                      children: [
                        {
                          tag: 'div',
                          classes: ['text-size-regular', 'text-style-eyebrow-caps'],
                          optional: 'eyebrow', attributes: {},
                          children: [{ tag: 'p', classes: [], attributes: {}, text: '{eyebrow}', children: [] }],
                        },
                        { tag: 'h1', classes: ['heading-style-h2'], optional: 'heading', attributes: {}, text: '{heading}', children: [] },
                        {
                          tag: 'div',
                          classes: [`${C}_text`, 'text-size-large'],
                          optional: 'text', attributes: {},
                          children: [{ tag: 'p', classes: [], attributes: {}, text: '{text}', children: [] }],
                        },
                      ],
                    },
                    {
                      tag: 'footer',
                      classes: [`${C}_footer`],
                      optional: 'button', attributes: {},
                      children: [
                        {
                          tag: 'a',
                          classes: ['button', 'is-octagon'],
                          attributes: { href: '{buttonLink}' },
                          children: [
                            { tag: 'div', classes: ['text-size-regular', 'text-style-button'], attributes: {}, text: '{buttonText}', children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  variants: [
    {
      modifier: 'base',
      on: `section_${C}`,
      description: 'Light text (color-neutral-100), centred, no image: the placeholder fill shows. 15 of 21 brief base instances.',
      styleDeltas: {},
      crop: 'figma/pages/press/sections/01-press/section.webp',
    },
    {
      modifier: 'is-text-dark',
      on: `section_${C}`,
      description: 'Dark text (color-neutral-900). Split out of the brief base: 6 instances, including the reference home/01.',
      styleDeltas: { desktop: { color: 'var(--color-neutral-900)' } },
      crop: 'figma/pages/home/sections/01-the-bold-handsome-heart-of-san/section.webp',
    },
    {
      modifier: 'is-image-bg + is-1-image',
      on: `section_${C}`,
      description: 'Brief variant. No modifier class needed: the image prop fills _figure; the layout is base.',
      styleDeltas: {},
      crop: 'figma/pages/arts/sections/01-art-collection/section.webp',
    },
    {
      modifier: 'is-left',
      on: `${C}_component`,
      description: 'Brief variant is-image-bg + is-left + is-1-image. Only is-left carries styles, as a combo on _component (Webflow cannot style descendants of a section combo): left-aligned caption, eyebrow only.',
      styleDeltas: { desktop: { 'align-items': 'flex-start', 'max-width': '44rem', 'text-align': 'left' }, mobileLandscape: { 'max-width': 'none' } },
      crop: 'figma/pages/rooms-individual/sections/05-etiam-imperdiet-sodales-dui-a-vestibulum/section.webp',
    },
  ],
  props: [
    { name: 'image', type: 'image', element: `${C}_image`, optional: true, visibility: 'hide _figure when empty' },
    { name: 'imageAlt', type: 'text', element: `${C}_image`, optional: true },
    { name: 'logo', type: 'image', element: `${C}_logo`, optional: true, visibility: 'hide _logo-wrapper when empty' },
    { name: 'logoAlt', type: 'text', element: `${C}_logo`, optional: true },
    { name: 'eyebrow', type: 'text', element: 'text-style-eyebrow-caps', optional: true },
    { name: 'heading', type: 'text', element: 'heading-style-h2', optional: true },
    { name: 'text', type: 'text', element: `${C}_text`, optional: true },
    { name: 'buttonText', type: 'text', element: 'text-style-button', optional: true, visibility: 'hide _footer when empty' },
    { name: 'buttonLink', type: 'link', element: 'button', optional: true },
  ],
  assets: [
    ...[...new Set(instances.filter((i) => i.content.image).map((i) => i.content.image.imageRef))].map((ref) => {
      const a = assetFor(ref)
      const used = instances.filter((i) => i.content.image?.imageRef === ref).map((i) => i.section)
      return { slot: 'image', webflowAssetId: a.webflowAssetId, webflowUrl: a.webflowUrl, local: a.localPath, usedBy: used }
    }),
    {
      slot: 'logo',
      webflowAssetId: null,
      local: 'figma/vectors/group-270989670-416x101-250-1958.svg',
      usedBy: ['dining-zuma/01-zuma-san-diego'],
      note: 'Zuma wordmark SVG is not in the Webflow asset library yet; upload it before the dining-zuma page entry.',
    },
    {
      slot: 'button shape reference',
      webflowAssetId: null,
      local: 'figma/vectors/vector-25-194x37-236-8217.svg',
      usedBy: ['all instances with a button'],
      note: 'Reference only: the shape is drawn by is-octagon clip-path, not uploaded.',
    },
  ],
  instances,
  openQuestions: [
    'Base background: every no-image instance shows the Figma #D9D9D9 placeholder. The plan fills it with color-neutral-300 (#D1D1D1) until hero photos arrive. Stephen: are photos coming for all 21, or is a solid colour intended for some?',
    'Text colour split: 6 instances use dark text (#262118), 15 use cream. The plan adds is-text-dark (not in the brief) instead of baking colour into base. Confirm, or say which colour is final once photos are in.',
    'Paragraph line height: dark-text instances use 22/28.6 (1.3), cream ones 22/35.2 (1.6). The plan uses 1.6 on _text for all. If Q001 sets text-size-large line-height, check that _text still wins (both are single-class selectors; Webflow order decides).',
    'Button label style: home uses CAPS-CAPTION-16 (lh 1.2, -0.03em), dining pages use Label / Button (lh 1, 0). The plan uses text-style-button for both.',
    'clip-path for is-octagon: if the Webflow style panel cannot set clip-path, K01 should move it to the global styles embed or use the vector as a background mask.',
    'Gutter: Figma places the is-left eyebrow and the nav at x=40 on a 1600 frame. container-large (80rem) puts the eyebrow at x=80 at 1440 and x=160 at 1600. K01: decide whether full-bleed captions skip the container or the site gutter changes to 2.5rem.',
    'Variable names color-brand-4a1217 and color-brand-489cca are tokens.json suggestions; D01 confirms #4A1217 gets its own variable but does not name it, and #489CCA is not covered. K01 reconciles with Q001.',
    'Optional element gatch-24 listed in components.md does not appear in any of the 24 specs; no slot is planned for it.',
    'heroTextReveal ([data-hero-title], [data-hero-reveal]) fits this hero but no animation note asks for it; attributes left off. Add on request.',
  ],
  deviations: [
    'Brief modifiers is-image-bg and is-1-image are not created: image presence is a prop (optional _figure), so the classes would carry no styles. is-left is the only image-variant class.',
    'is-text-dark added (6 instances) and base is the cream-text version; the brief listed one base for all 21.',
    'Heading is an h1 (page hero) styled with heading-style-h2, per the H2-CAPS token.',
    'Figma overlaps on dining pages (button over paragraph at y832) are not reproduced: the footer sits 1.75rem below the text, as on home/01.',
    'Invisible background groups (Group 270990042, 270990050, 270990202) reported in some specs are off-canvas or zero-opacity leftovers; not built.',
    'arts/04 and rooms-individual/05 have identical text but different images (6f611716 vs d7332204), so they are two instances of one variant, not one reused instance.',
  ],
}

mkdirSync('docs/figma/build-plans/Q014', { recursive: true })
writeFileSync('docs/figma/build-plans/Q014/plan.json', JSON.stringify(plan, null, 2) + '\n')
console.log('instances', instances.length, instances.map((i) => i.section + ' ' + i.variant).join('\n'))
