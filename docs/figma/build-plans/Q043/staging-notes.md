# Q043 staging check: /contact (the-guild-hotel-c34e71.webflow.io)

Checked at 1440x900 and 390x844 with Playwright. Crops compared are the Figma 1600px frames, so Figma px are about 1.11x staging px.
Screenshots: staging-<section>-1440.png (7 files) and staging-full-390.png in this folder.
Note: the fixed nav bar is captured over the top of some element screenshots; that is a screenshot artefact, not a defect.

## Checks
1. Images: PASS. 14 img elements, all naturalWidth > 0, none are placeholder.svg or grey placeholders. Hero, carousel (Rooms, Dining) and Bonvoy/booking background all show real photos.
2. Input placeholders: FAIL. first-name, last-name, email, phone, organization and special-requirements all still carry placeholder="Example Text" in the DOM. It is not visible on screen (floating labels sit above empty lines) but is exposed to autofill hints and assistive tech. The newsletter email input has an empty placeholder. Text "Example Text" is not rendered anywhere in body text.
3. Select: PASS. 7 options: select an option, reservations, groups meetings & events, dining, billing, press, something else (6 real plus the prompt).
4. Mobile overflow: PASS. scrollWidth at 390 is 390.

## Per-section mismatches vs crop
### 01 contact-us (.section_form-split-script-contact)
- Heading "CONTACT US" is larger, lighter weight and in dark brown; Figma is a heavier, tracked, dark-green display face. Heading sits higher (about y 270 vs Figma about y 350 scaled to 315), so the text block is not vertically centred like the crop.
- Left inset is 80px; Figma is about 36px (40 at 1600). Image column starts at 643, close to Figma 655 scaled to 590, so the gutter is tighter than design.
- Image is wider and shorter than the crop frame (717x575 vs about 815x653 scaled); crop shows a grey placeholder, staging shows the real photo, which is expected.
- Background cream is slightly warmer/yellower (F5EFE0-ish) than the crop's greener cream.
- Contact detail text, labels and Instagram/Facebook underlined links match in size and order.

### 02 your-request (.section_form-contact-fields)
- Fields use a label above an empty rule; Figma shows the label sitting on the rule. Staging row pitch is about 84px vs about 52px in Figma (58 at 1600), so the form is taller (724 vs 562 scaled).
- Select renders its value in the system sans ("select an option") instead of the uppercase label face, and the Figma arrow-down icon is replaced by the native chevron.
- Checkbox is a plain native white box; Figma uses a custom filled dark square. Consent text has extra gap before "PRIVACY POLICY".
- Send button matches (dark octagon pill, same label).

### 03 more-of-the-guild (.section_card-carousel-header-left)
- Heading and copy match. Heading is higher in staging (y 240 vs scaled about 260 relative to cards) and arrows sit higher (y 743 vs scaled 790), consistent with a shorter section.
- Only Rooms and Dining show; Wellness peek is missing (Swiper not initialised, accepted). Left arrow is dimmed, Figma shows both at full strength.

### 04 faqs (.section_faq-accordion)
- First item is collapsed in staging; Figma shows it open with the answer paragraph and an up chevron. Needs default-open state or confirm it is a runtime behaviour.
- Question text is underlined in staging (link underline leaking); Figma has no underline.
- Eyebrow "FAQS" and heading match. Row pitch matches closely.

### 05 cant-find (.section_cta-script-centered-dark)
- Close match: dark green, script heading, cream pill button.
- Body copy breaks into three hard lines (one sentence per line, 3 lines of 540px) whereas Figma wraps a run-on paragraph over 3 centred lines. Likely line breaks or narrower max width in the source copy.
- Heading is slightly smaller and sits further left of centre than the crop.

### 06 book-your-escape (.section_cta-booking-newsletter)
- Layout, script headings, buttons, divider and Bonvoy lockup match.
- Newsletter email input has no visible "*EMAIL" label or placeholder; Figma shows "*EMAIL" at the left of the rule.
- Divider is a brighter, thicker line than the faint hairline in Figma.
- Join Us button is slightly smaller than the crop.

### 07 the-hotel (.section_footer-links)
- Very close. Left inset is 32px vs about 36px scaled; column x positions differ by up to about 35px (Experience at 297 vs scaled 300 OK, Social at 894 vs scaled 909).
- "Brand & website by Studio Circa" is not underlined in staging; Figma underlines "STUDIO CIRCA".
- Webflow "Made in Webflow" badge overlaps the bottom right (staging only badge).
