---
title: "Webflow Data API builders work without the Designer"
date: "2026-10-19"
category: "integration-issues"
module: "webflow-mcp"
component: "tooling"
problem_type: "integration_issue"
severity: "medium"
root_cause: "missing_knowledge"
resolution_type: "workflow_improvement"
symptoms:
  - "Native builds were serialised behind one open Designer session"
  - "Unclear whether data_element_builder, data_whtml_builder and data_component_builder need the Designer"
tags:
  - webflow-mcp
  - element-builder
  - whtml-builder
  - component-builder
  - parallel-builds
  - designer
---

# Webflow Data API builders work without the Designer

## Problem

Native components were built one at a time because the build skill drove the Designer. Ledger entry X01 probed whether the headless `data_*` builders (Webflow MCP 2.2.0) can build sections, classes and components with no Designer involvement, so later builds can run in parallel.

## Setup

- Site `6ad6405eae8eac6d7b7c41a3`, on 2026-10-19 between 20:28 and 20:35 UTC.
- Two draft pages, `x01-probe` (`6ad67d5fba7363623522fef3`) and `x01-probe-b` (`6ad67d608726a8a445349dc0`). All classes were prefixed `x01-probe_`.
- No `designer_tool` call was made. The Designer was held by another session (Q001, a token sync) that was working on other pages. This session never opened either probe page in the Designer.
- Every call passed one `session_id` and one `agent_id`. The server says it cannot tell concurrent agents apart without `agent_id`, so each parallel build session needs its own.

## Answers

### 1. Do the builders add elements without the Designer?

Yes. All three builders wrote to pages that no Designer was showing:

- `data_element_builder` built a nested tree in one call: Section > article > header > h2, plus a paragraph, figure > image and footer > button and link. It applied classes, a combo and attributes.
- `data_whtml_builder` inserted the same structure from HTML and CSS.
- `data_component_builder` placed a component instance on the second page.
- The read-back with `data_element_tool > get_all_elements` showed every element.

Which builder fits best:

- **`data_element_builder`** for production sections. Classes are named, image assets are set by id, and nothing gets renamed. It needs the classes created first with `data_style_tool`.
- **`data_whtml_builder`** creates the markup and classes in one call. But it renames classes on conflict (see question 3), drops classes that have no CSS rule (`x01-probe_whtml-link` had none and was not created), and does not resolve `<img src>` to an asset, even with the site's own CDN URL (`partial_success` with `image_warnings`; the image ends up with `assetId: null`). Use it only for brand-new class families, then fix the images with `data_element_tool > set_image_asset`.
- **`data_component_builder`** only inserts instances of components that already exist (by name). It does not build markup.

`BY_CUSTOM_TAG` with `article`, `header`, `figure` and `footer` became Block elements with the right tag. `Button` came back as a `Link` element.

### 2. Breakpoint styles and combo classes?

Yes, through both routes. The read-back with `query_styles` and `include_breakpoints` showed:

- `data_style_tool > create_style` created `x01-probe_card`. `update_style` with `breakpoint_id` `medium`, `small` and `tiny` stored 1.5rem, 1rem and 0.5rem. Each `update_style` response shows only the breakpoint it touched; the full set is visible only on read-back.
- `create_style` with `parent_style_names: ["x01-probe_card"]` created the combo `.x01-probe_card.is-x01-probe-alt`. A `small` override on the combo was also stored.
- WHTML CSS with `@media screen and (max-width: 991px)` and `(max-width: 479px)` became `medium` and `tiny` overrides. A `.a.b` selector became a combo class.

### 3. A class name that already exists?

It depends on the route:

- **`data_style_tool > create_style`** returns an error: `A style at path "x01-probe_card" already exists` (`OPERATION_FAILED`). Nothing is changed. Builders must query first and reuse the class, or call `update_style`.
- **`data_whtml_builder` with different CSS** creates a new class with a suffix. Redefining `.x01-probe_card` with other properties created `x01-probe_card-1`, and the element received that class. This breaks the one-class-family rule without any warning.
- **`data_whtml_builder` with identical CSS** reuses the existing class. A second insert defining `.x01-probe_race2 { margin-top: 3rem; }` got `x01-probe_race2`, with no suffix.
- **`data_element_builder` `set_style`** only references existing names, so it reuses them.

### 4. Two calls create the same new class at the same time?

Two tool calls were sent in parallel in one turn. No duplicate appeared, but the later call either failed or got renamed:

- `create_style x01-probe_race` (margin 1rem) against `create_style x01-probe_race` (margin 2rem): the first created the class and the second got the "already exists" error. Exactly one class exists, with the first call's values.
- WHTML `.x01-probe_race3 { margin-top: 4rem }` on page A against `.x01-probe_race3 { margin-top: 5rem }` on page B: A got `x01-probe_race3` and B got `x01-probe_race3-1`.

The client may have serialised the two calls. Either way, the server never produced two classes with the same name.

Rule for parallel builds: shared classes (utilities, shared families) must exist before parallel sessions start. Each session creates only its own `section_<component>` family, and never through WHTML CSS for a name another session might also create.

### 5. Convert to a component and place it on another page?

Yes:

- `data_component_tool > transform_element_to_component` turned the element-builder section into "X01 Probe Card" (`174e2cb3-6a1a-3255-0c09-b75c8d3f44c7`, group "X01 Probe") and replaced the source with an instance.
- `data_component_builder` with `insert_in_element` placed an instance on `x01-probe-b`.
- `get_all_elements` with `scope_component_id` showed the full definition: classes, attributes, `assetId` and links.

### 6. Custom attributes, image assets by id, link settings?

- **Attributes:** yes, through `set_attributes` in the builder and `data_element_tool > set_attributes`. `data-animation-general`, `data-animation-order` and `aria-label` all persisted.
- **Image by asset id:** yes in `data_element_builder` (`set_image_asset`, stored as `assetId`). For WHTML images, `data_element_tool > set_image_asset` works afterwards. `set_settings` with key `image` is rejected ("not applicable").
- **Links:**
  - `set_link` with `link_type: "url"` worked.
  - **`set_link` with `link_type: "page"` in `data_element_builder` was silently dropped.** The element was created with no link setting and the call still returned success.
  - Writing it afterwards with `data_element_settings_tool > set_settings`, key `link` and `static_link { mode: "page", to: <pageId>, open_in_new_tab: true }`, worked. It is stored as `{ mode: "page", to: { pageId } }`.

### 7. Does an open Designer see the changes, and does it overwrite them?

The writes did not need the Designer at all. The Q001 session held the Designer on other pages for the whole probe. A re-read of every `x01-probe` class at about 20:36 UTC showed all 11 classes intact. See "Designer coexistence check" below for what was confirmed in the Designer itself.

## Designer coexistence check

- **The Designer sees the changes live.** Stephen looked at the Designer that Q001 had open, without reloading. It listed both probe pages and the "X01 Probe Card" component.
- **A Designer save did not overwrite them.** Q001 saved in the Designer after 20:30 UTC. A Data API re-read after that save showed the full probe intact: the page tree, the component definition, all 11 classes, and the `medium`, `small` and `tiny` values on `x01-probe_card`.
- **Not tested:** a Designer user and a Data API call editing the same element or class at the same moment. Keep each parallel session on its own page and its own class family.

## Cleanup and its gap

- Removed through the MCP: every probe element (`remove_element`), the component (`unregister_component`, after `instanceCount: 0`), and all 11 classes (`remove_style`, combos first). A final `query_styles` for `x01-probe` returned nothing.
- **Pages cannot be deleted headlessly.** `data_pages_tool` has no delete action, and `DELETE /v2/pages/{id}` returns `RouteNotFoundError` (404), while `GET` on the same id returns 200. Page deletion stays a manual Designer step. Parallel builds should therefore build on existing pages, or on pages the plan intends to keep.

## Verdict

Parallel Data API builds: yes. Several sessions can build native sections, classes and components at the same time, with no Designer involved.

These must stay on the Designer, or run before the parallel sessions start:

- Deleting pages.
- Visual checks in the Designer canvas.
- Rich text child styling, which the MCP cannot do.
- Creating shared classes. One session does it first, because parallel creates either fail or come back with a `-1` suffix.

Rules for the build skill:

- Use `data_element_builder` with classes created first through `data_style_tool`.
- Set page links through `data_element_settings_tool` (`static_link`, `mode: "page"`), never through the builder's `set_link` page type.
- Give every session its own `agent_id`.

## Gotchas found in the wave 2 parallel builds (Q015, 2026-10-20)

- **Class stacks need their combo style to exist.** `data_element_builder` `set_style` with `["heading-style-h2", "text-weight-normal"]` drops every class silently when `.heading-style-h2.text-weight-normal` does not exist. The element comes back with no classes, and the call still reports success. `data_element_tool > set_style` returns `One or more styles not found`. Create the combo chain first (`create_style` with `parent_style_names`, the two-class level before the three-class level). Then read back `styleNames` on every element.
- **No native `<button>`.** `BY_CUSTOM_TAG` with `button` becomes a Webflow Link holding "Button Text". `type` is a reserved attribute name, and using it rejects the call. Use a Link Block with `href="#"` for JS triggers.
- **A rejected builder call leaves a partial tree.** Elements created before the error stay on the page. Read the page back and remove the partial elements before retrying.
- **TextBlock text:** the builder's `set_text` on a `TextBlock` is ignored, and `data_element_tool > set_text` says "This element doesn't support text". Write it with `data_element_settings_tool > set_settings`, key `text`, `static_text.value`.
- **HtmlEmbed code:** create the embed empty, then write it with `set_settings`, key `code`, `static_text.value`. The code and links survive `transform_element_to_component`.
- **RichText seeds sample content (Q020).** `data_element_builder` `RichText` always creates Webflow's 16-element style-guide sample (H1 to H6, lorem, blockquote, lists, link, inline styles) ahead of any children you pass. Replace it in one write with `data_element_settings_tool > set_settings`, key `richText`, `static_text.rich_text_inner_text`; that leaves plain paragraphs only.
- **Bullets inside RichText (Q020).** Set `richText` to a placeholder, then append `BY_CUSTOM_TAG ul` with `li` children. The List seeds three empty ListItems first, and `set_text` on the `li` children is dropped. Write each item with `set_settings`, key `text`, `static_text.value`, then remove the three seeded items and the placeholder paragraph.

## Gotchas found building forms and slots (Q022, 2026-10-20)

- **`Form` seeds a default form.** The builder's `Form` type creates a FormWrapper with a FormForm holding Name and Email labels and inputs, a FormButton, and success and error messages. Remove the labels and inputs, restyle the rest, and move the FormButton into your `footer` wrapper with `move_element`.
- **Input settings, not attributes.** `name`, `type` (text, email, tel, number) and `required` are settings on FormTextInput (`set_settings`). New inputs default to `required: true`. The form's `name` and the button's `buttonText` and `loadingText` are settings too.
- **`placeholder` cannot be set headlessly.** The builder rejects it as a reserved attribute (and rejects the whole call, leaving a partial tree), `set_attributes` returns an internal error, and there is no placeholder setting. Set placeholders in the Designer.
- **No slots through the API.** `create_prop` has no slot type. A builder `ComponentSlot` inside a definition creates a `Slot` element (a wrapping div), but `move_element` into it fails with an internal error. Use Show booleans and leave slots to the Designer.
## Gotchas found in the Q016 build (2026-10-20)

- **Image props:** `create_prop` takes no image default, and binding an image's `assetId` to the prop clears the definition's image. On an instance, `set_component_instance_prop_values` has no image type; pass the asset id as `type: "string"`. It reads back as the asset id.
- **Link props:** prop defaults and instance values accept only `url`, `email`, `phone`, `popover` or `modal`; `page` is rejected. Use a url such as `/rooms`.
- **LinkBlock text:** the LinkBlock exposes a `text` setting; bind the inner span's `text` instead, so the icon child is kept. A `DOM` span takes its text through `set_settings` key `text`.
- **Optional wrappers:** bind each wrapper's `visibility` to a boolean prop; an empty text prop does not hide its wrapper.
- **Heading newlines:** `set_text` and text props keep `\n`, so `white-space: pre-line` headings work without a line-break element.

## Visual checks (Q020, 2026-10-20)

- **Visual check by publishing to staging (Q020).** The Designer canvas can render Data API builds wrongly. On Q020 the eyebrow h3s showed at h3 tag size (about 40px) while the published page computed 18px as planned. Check the published page instead: build pages are created as drafts, so set `draft: false` with `data_pages_tool > update_page_settings`, then `data_sites_tool > publish_site` with `publishToWebflowSubdomain: true` and no custom domains. Read computed styles on `<site>.webflow.io/<slug>` in a browser. Stephen approved staging publishes for this project on 2026-10-20 (not shared with the client yet).
- **Designer drops some API-created utility combos (Q020).** On the card titles, the API and the published HTML both had `image-trio-text_item-heading text-style-eyebrow-caps`, but the Designer showed only `image-trio-text_item-heading` and rendered the h3 at tag size. For a family element whose only job is one text style, put the style values on the family class itself instead of stacking a global utility through an empty combo.

## Gotchas found in the Q023 build (2026-10-20)

- **Attribute bound to a text prop keeps its line breaks.** Binding a heading's `aria-label` (`set_settings` key `attributes`, `value_binding` to a `textContent` prop) works, and the attribute resolves to the prop value including its `\n`. Use a separate string prop if the label must be one line.
- **Binding `attributes` replaces the whole list.** Re-include every static attribute (for example `data-*` hooks) in the same write. The nav and heading in Q023 had only `aria-label`, so nothing was lost.
- **Text and link on a TextLink bind together.** One `set_settings` operation with keys `text` and `link` (both `binding` to props) applied cleanly, and the static `data-*` attributes on the link survived.
- **Three-class combos for a state class.** A first tab with `tab_x text-style-eyebrow-caps is-active` needs `.tab_x.text-style-eyebrow-caps.is-active` to exist, even when `.tab_x.is-active` already carries the styles. Create it empty; the published CSS for `.tab_x.is-active` still matches the element.

## Component variants (V01, 2026-10-20)

Probe on Hero Fullbleed Centered (`f91dcf8c-5c66-6cf4-32b6-a2f2427f7bfa`) and `/build-hero-fullbleed-centered`. Two variants were created to match the `is-text-dark` and `is-left` reference sections: Text Dark (`c5755984-9207-f25b-c049-f99910c92943`) and Left (`75108921-8bef-ba10-2260-5af2990c9e7d`). Two new instances use them, below the reference sections.

### 1. Create a variant, and what can differ?

- `data_component_variants_tool > create_variant` works on an existing component. It returns the variant id. The variant has no styles until you add them.
- A variant only holds **styles**. `set_variant_styles` takes `variant_id`, `style_name` (a class used inside the component), `breakpoint_id` and `pseudo`, and it accepts variables (`variable_as_value`). Text Dark sets `color` on `section_hero-fullbleed-centered`. Left sets `align-items`, `max-width` and `text-align` on `hero-fullbleed-centered_component` at `main`, and `max-width: none` at `small`.
- A variant cannot add or swap classes or combos, and it cannot change text, images, links or visibility settings. Those stay props. A variant can hide an element with `display: none` on that element's class, but this probe did not test it. Use a Show boolean prop.
- Breakpoint ids: `main` is desktop and `small` is mobile landscape (the published CSS puts `small` under `max-width: 767px`).
- **Combos cannot be named (V02, Q014).** `style_name` takes one class name and resolves the first style with that name, site-wide. `is-wide` resolved to an unrelated `is-wide` (max-width 46.5rem); `.button.is-chamfer.is-wide`, a space-separated path and a style id all return "Style not found". So a variant style lands on the element's first class (`.button:where(.w-variant-…)`, specificity 0,1,0), and any combo on the same element (`.button.is-chamfer`, 0,2,0) wins for the properties it sets. Workaround used for the blue and burgundy hero buttons: set a property the combo does not set (a solid `background-image: linear-gradient(var(--colour), var(--colour))` over the combo's `background-color`), and put text colour on a child class with no combo (`text-style-button`). The gradient reads back as a bare variable id but publishes as the full gradient.

### 2. Can an instance select a variant through the Data API?

Yes. Creating the first variant adds a prop of type `variant`, named Variant, with default `base` (`69451566-4154-e6c8-a0db-695c14d9c0af` here). Neither `data_component_builder` nor `data_element_settings_tool` selects a variant: the instance returns "Element does not support settings". To select one, insert the instance, then call `set_component_instance_prop_values` with `type: "string"` and `string_value` set to the variant id. The schema has no `variant` type. `string` is accepted, and the variant id reads back.

### 3. Do props keep working per instance?

Yes. The Text Dark instance has Heading "V01 text dark". The Left instance has Image, Show Image, Show Eyebrow and Eyebrow set, and Show Heading, Show Text and Show Button off, all in the same call as the Variant prop. Each instance read back its own values, and the published page renders each one.

### 4. Does creating a variant change existing instances?

No. The instance that already existed reads `Variant: base` with all 15 props unchanged, and it publishes with the base styles. The Base variant's styles for both classes read back the same as before.

### 5. Same on read-back and in the Designer?

- **Read-back:** `get_variant_styles` returns exactly the values set, per breakpoint. `get_component` with `includeVariants` lists Base, Text Dark and Left.
- **Published (webflow.io staging):** the root of each instance carries `data-wf--hero-fullbleed-centered--variant="<slug of the variant name>"`. Each element whose class has variant styles gets an extra class, `w-variant-<variant id>`. The CSS is `.section_hero-fullbleed-centered:where(.w-variant-…)`. Webflow merged it into the same rule as the matching combo (`, .section_hero-fullbleed-centered.is-text-dark`). The computed colour and alignment match the reference sections.
- **Specificity:** `:where()` adds nothing, so a variant rule has single-class specificity (0,1,0), and a later rule on the same class can override it. Avoid combos on the same element that set the same property.
- **Designer:** Stephen confirmed on 2026-10-20 that the canvas shows both instances correctly. The Text Dark instance has dark text, and the Left instance is left-aligned with the image and the eyebrow only, each matching its reference section.
- `get_component` with `includeSelectedVariant`, or with several options combined, returns an internal error. Ask for one option per action.

### Verdict

Per-instance variants through the Data API: yes (styles only; content and visibility stay props).

**Recommended route for the other components with reference-section variants (Q014, Q017, Q019, Q020, Q021, Q023, Q024, Q025, Q026):** for each `is-` combo in the plan's `variants`, create a variant named after the modifier. Then call `set_variant_styles` on the same base class and breakpoints, with the values read from the combo through `query_styles`. Page builds insert the instance and set the Variant prop by variant id as `type: "string"`. Two cases stay out of variants:
- A modifier that changes structure or content (for example an image instead of the placeholder) stays a Show boolean or an image prop.
- A modifier on a class used outside the component needs its variant style checked on every class it touches. The variant only applies inside instances.

### Variant styles attach through the first class only (V02, Q017)

A variant style set on a class that sits in a combo position on the element (for example `padding-section-large` on `padding-global padding-section-large`, or `heading-style-h4` on `split-image-text-light_heading heading-style-h4`) reads back fine and publishes as `.padding-section-large:where(.w-variant-…)`, but never applies: Webflow adds the `w-variant-<id>` class only to elements whose **first** class has variant styles. Set the variant style on the element's first class instead (`padding-global`, `split-image-text-light_heading`). Single-class elements such as `container-large` work as expected. Even on the first class, a variant rule (`.padding-global:where(.w-variant-…)`, specificity 0,1,0) loses to another class on the same element that sets the same property later in the stylesheet (`.padding-section-large`). Q017 Compact gets its smaller section padding from negative vertical margins on the container instead. Draft build pages are skipped by a staging publish; un-draft the page to check it on webflow.io.

Keep the combo classes and reference sections until each component's variants are verified on staging. Then remove the reference sections after Stephen's yes.
## Gotchas found in the Q026 build (2026-10-20)

- **Text elements with semantic tags:** a builder `DOM` element with `set_dom_config` `figcaption` and `settings` `[{ key: "text", static_text: { value } }]` creates a real `<figcaption>` with its text in one call, and its `text` setting binds to a text prop after conversion. Use it where `BY_CUSTOM_TAG` would give a Block that takes no text.
- **Modifier stacks of three or four classes** (`_item is-large is-end is-lift`) apply only after each level exists as an empty combo; the published CSS of each two-class combo (`.x_item.is-lift`) still matches, so the deeper levels need no properties.

## Gotchas found assembling the first page (Q042, 2026-10-20)

Page `/static-template` (`6ad66fd802cc199b55b924be`): Site Nav (Dark), one one-off section, CTA Booking Newsletter, Footer Links. Order of work that worked: create the one-off family with `data_style_tool`, insert the nav, build the one-off section, then append the shared instances, all as children of the Body.

- **Nothing can be placed `before` or `after` a component instance.** `data_element_builder` with an instance as `parent_element_id` and `creation_position: "after"` fails with "Cannot insert elements directly into a component instance", even though the target is a sibling position. Build page sections top to bottom with `append` on the Body (id `{component: <pageId>, element: <body id>}` from `get_all_elements` depth 0). If something must go between two instances later, insert it `after` a plain element, or `move_element` it.
- **Instances go in as children of the Body with `data_component_builder` `insert_in_element` `append`**, by component name (`Site Nav`, `CTA Booking Newsletter`, `Footer Links`). Then set the Variant prop with `set_component_instance_prop_values` (`type: "string"`, variant id). The read-back shows `hasOverride: true` on the Variant, and the published root carries `data-wf--site-nav--variant="dark"`.
- **The Site Nav is absolute over the first section.** The first section on every page carries its own top padding for the bar (here 24rem desktop to match the Figma heading at y 388; 12rem medium, 8rem small). Hero sections already sit under it.
- **List items you pass come after the three seeded ones.** `BY_CUSTOM_TAG ul` with ten `li` children gives thirteen ListItems: the first three (consecutive ids ending in the ul id plus 1, 2, 3) are the seeded empties, then yours in order. Write each of yours with `set_settings` key `text`, then remove the first three.
- **Legal or long copy: native elements, not RichText.** Headings inside a RichText take the tag styles (h2 at 2.5rem), and their size cannot be set headlessly. Native `h2.heading-style-h5`, paragraphs and a classed `ul` publish with the right styles. Paragraph text keeps `\n`; a family class with `white-space: pre-line` renders the line breaks, so a block of short lines can be one Paragraph.
- **Publishing is site-wide and rate limited across sessions.** `publish_site` returns 429 ("at most once per minute") when another session published in the last minute. Any full-site publish by another session also publishes your page, so after a 429 check the staging URL with `curl` for your classes before retrying.

## Notes from the History page (Q036, 2026-10-20)

- **A whole one-off section goes in one `data_element_builder` call.** The history timeline (about 80 elements, 11 KB of schema) built in one append with every class stack and attribute intact. Generate the schema with a short script rather than by hand.
- **Presence-only data attributes get a value.** The A04 contract checks presence (`[data-history-sticky-year]`); the builder was given `value: "true"` rather than an empty string, which it may reject.
- **Grey Figma placeholders become empty figures.** When the snapshot has only #D9D9D9 rectangles and no asset, build an empty `figure` with the size and aspect ratio on its class, a #d9d9d9 fill, and `data-image-placeholder="<what goes here>"`, so the image slots are findable later.
- **Placeholders for unbuilt Q005 to Q011 pieces** use the shared `section_placeholder` class (created by Q036) plus `data-placeholder="Q0xx"`.
- **Builder calls can fail with `init-multiplayer-connection returned 429` (`RATE_LIMITED`)** when several page sessions write at once (Q040). Nothing is written; re-send the same call a little later and read the page back to confirm.

## Gotchas found assembling Home (Q031, 2026-10-20)

- **Pages from the Relume starter keep a shell.** Home has `.page-wrapper` > Global Styles embed + `main.main-wrapper`, unlike the K02/Q004 pages where sections sit on the Body. `data_component_builder` `prepend` into `.page-wrapper` puts the Site Nav first (before the embed), and every section then goes in with `append` on `main.main-wrapper`. Read depth 0 to 2 before choosing the parent.
- **Instance internals are invisible to page queries.** `query_elements` on the page with `attribute_name` finds nothing inside an instance (A02 attributes in Image Trio Text came back empty). Query with `scope_component_id` set to the component to verify attributes in a definition.
- **Two styles named `section_placeholder` exist** (ids `34766799-7ade-616b-875e-1e8d19002c96` grey fill and `9333d82a-f287-e5ad-35b6-253c516b6c05` dashed border). `set_style` by name picks one; either reads as a placeholder, so it is fine for marked slots, but do not create a third.
- **One-off sections built in one call.** A full section (section > component > header, footer, media with figure and four LinkBlock > figure > img) went in with one `data_element_builder` action, including `set_link` url, `set_image_asset` with alt text and `data-*` attributes. A copy of a plain section from a build page (the 04 to 09 snap group, about 50 elements) also went in as one nested schema.

## Gotchas found building the first CMS template (Q027, 2026-10-20)

- **Instance props bind to CMS fields on a template page.** `set_component_instance_prop_values` with `type: "bindable"`, `binding_source_type: "cms"`, the collection id and the field id works for text props (Hero Heading and Text) and for image props (Split Image to an Image field). The published page renders each item's value, and an image prop bound to an empty Image field publishes `<img src="">`.
- **Native text binds with `set_settings` key `text`** and a `cms` binding (headings, paragraphs, a Blockquote).
- **Visibility binds only to a boolean field.** Binding `visibility` to a PlainText field returns "Element is not inside a CMS context", even on the template page. Add a Switch field and bind `visibility` to it through `set_settings` key `visibility` (`set_visibility` with a binding gave the same error). Hidden sections are left out of the published HTML.
- **Draft items do not render on staging.** Template pages publish only items that are not drafts; set `isDraft: false` with `update_collection_items` before the webflow.io publish.
- **A variant cannot follow the item.** The Variant prop takes a variant id, with no CMS binding, so per-item looks need a Switch and two conditionally shown instances.
