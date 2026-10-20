# Q043 Contact page build (2026-10-20)

Page `/contact` (`6ad66fd8e0b7968459e18f22`), Body `6ad66fd8e0b7968459e18f28`. Built through the Data API, no Designer. Staging: https://the-guild-hotel-c34e71.webflow.io/contact

## Section order (read back)

| # | Figma section | Built as | Element id |
|---|---|---|---|
| - | nav | Site Nav instance, Variant Dark (`08083309-2be0-2228-878a-7f1c05773f43`) | `f8af5b15-3e32-d32e-4e44-da7da33e8afd` |
| 01 | contact-us | form-split-script-contact instance, Variant Contact (`cb87b4cf-bba7-94cc-e25e-670072dbadea`) | `838a51de-73dd-c9b2-8acd-1135fc7f5e98` |
| 02 | your-request | one-off `section_form-contact-fields` with a Webflow form | `cdc3bcb7-4e88-a35c-26c2-673e4b30d18b` |
| 03 | more-of-the-guild | Card Carousel Header Left instance, Variant Base | `1ceade4d-76fd-2175-5bc6-0d6534125317` |
| - | anchor | DOM div `#faqs` (target of the 05 button) | `6b193690-1112-2b34-8f97-4f1feb077871` |
| 04 | faqs | faq-accordion instance | `605716e1-d6ce-52c6-550b-a931a8176cd5` |
| 05 | cant-find-what-youre-looking-for | one-off `section_cta-script-centered-dark` | `caed1689-0e8b-8b28-5985-97c9563e6cc2` |
| 06 | book-your-escape | CTA Booking Newsletter instance | `8213da0f-83fd-d50c-e2fa-2ed654d96843` |
| 07 | the-hotel | Footer Links instance | `3d81bc8e-a8fc-4d38-9800-6dc4ba289198` |

No placeholders on the page: Q009 now exists, so 03 is a real instance.

## 01: form-split-script-contact changes (shared component)

The component could not show the contact column (four detail groups, caps heading) with its old props, so it was extended. Existing instances keep their render: new props default to the old content and new rows are hidden by default.

- **New props (group Details):** Detail 1 Label (`6b80f13f-54de-a84d-1868-3c15d4089407`, default "email") and Detail 1 Value (`64dae5d6-0db2-6243-c764-23db7aa41612`, default "press@theguildhotel.com") are bound to the existing detail row. Show Detail 2 to 4 (`e04adbbb-4eb0-bfba-32f1-ad941f1f9eb9`, `90cf7380-5dd5-14da-2ab2-eee49d5c099b`, `30fe4f6e-5bbe-a5e0-2431-d2c785b94b88`, default false), Detail 2 Label/Value (`62b0c303-17d4-81c3-a914-e958b5e184cb` / `9fc3c652-b880-489a-6765-1d62a5f10897`), Detail 3 (`d8fe5367-69d6-2197-284b-f2af7584f03d` / `0f9918b7-313c-c102-35ba-104b39e870d1`), Detail 4 (`7efa54c1-edff-5e45-43a1-e48beb141f38` / `01c718c2-b810-b13d-aca9-4d61c810431e`) drive three new DOM rows with the same classes. Legal and corporate (three detail groups) can use them too.
- `form-split-script-contact_detail-value` now has `white-space: pre-line`, so one value can hold a phone line and an email line.
- **New variant Contact** (`cb87b4cf-bba7-94cc-e25e-670072dbadea`): caps heading on `text-style-script` (heading font variable, 2.5rem / 1, weight 900, -0.05em, uppercase; 2.25rem medium, 1.875rem small and tiny); `rotate: 7.5deg` (6deg tiny) on `form-split-script-contact_header` cancels the `is-rotated` combo transform; `align-self: center` on `_content`; `display: none` on `_form-block` (Show Form off hides the inner form but leaves the wrapper as a grid item, which pushed the media to row 2); section `padding-top` 6rem / 5rem / 4rem under the absolute nav.
- Instance props: Heading "contact us", Show Details, Show Links, Show Media on, Show Form off, details from the Figma copy. The media figure already held a real photo (`6ad6701a28c5dc695c82c539`).

## 02: your request (one-off, Figma contact fields)

Fields match `contact/02-your-request`, not the photoshoot form: first name, last name, email address, phone number, organization, how can we assist you? (select), special requirements (textarea), privacy consent checkbox and "send your message".

- Form name "Contact Request". Names: `first-name`, `last-name`, `email` (type email), `phone` (tel), `organization`, `enquiry-type`, `special-requirements`, `privacy-consent`. Required: first and last name, email, consent.
- Visible labels (`FormBlockLabel`, `text-style-eyebrow-caps`) above each line instead of placeholders, because placeholders cannot be set headlessly. Inputs carry `aria-label` too. The new `is-labelled` combo on `form-split-script-contact_input` (and `.is-textarea.is-labelled`) makes Webflow's default "Example Text" placeholder transparent.
- The select is a DOM `select` with seven DOM `option` children (select an option, reservations, groups meetings and events, dining, billing, press, something else), because `FormSelect` options are not settable through the API.
- Reused classes: `form-split-script-contact_fieldset`, `_fieldset-header` (+ `heading-style-h4`), `_fields`, `_field` (`is-full`), `_input` (`is-textarea`), `_message`, `button is-chamfer is-dark`. New family `form-contact-fields_*`: `section_form-contact-fields`, `_component` (same two-column grid as Q022, form in column 2), `_form-block`, `_form`, `_footer`, `_consent`, `_checkbox`, `_checkbox-input`, `_link`.
- "privacy policy" links to `/static-template` (the legal copy page) until a privacy page exists.

## 03: carousel

Base variant, default props (rooms, dining, wellness, meetings and events, arts, history) match the Figma labels. Image 4 defaulted to the placeholder asset `6ad67011134731ad1b928045`; it is now the boardroom photo `6ad67016f8bf4846e80a023a`. All six card images are real photos.

## 05: can't find what you're looking for (one-off)

`section_cta-script-centered-dark` (olive `variable-0e074b1e…` background, cream text), `_component`, `_header` (rotate -7.5deg), `_heading` (Morello variable, 5rem / 1.2, pre-line), `_text`, `_footer`; paragraph `text-size-medium`; button `button is-chamfer is-wide` linking to `#faqs`. `data-animation-general` on the section, `data-animation-order` 0 to 2 on heading, text and footer.

## Gotchas

- `id` is a reserved attribute in `data_element_builder` (the whole call fails and leaves a partial tree). Set ids with `set_settings` key `domId` afterwards.
- `FormSelect` exposes no options setting (`options` returns "not applicable"); a DOM `select` with `option` children and `name` attribute works.
- A `Show Form` boolean bound to the inner form leaves the `w-form` wrapper in the grid; hide the wrapper in the variant.
- CSS `rotate` composes with `transform`, so a variant can cancel a combo's `transform: rotate()` without fighting specificity.
- `section_quote-band-dark` uses a navy variable (`variable-bbb7c022…`), not the olive accent; the olive is `variable-0e074b1e…` (used by `is-olive`).
