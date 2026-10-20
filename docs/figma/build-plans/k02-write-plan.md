# K02 write plan

Generated from `shared-classes.json` and every `Q0xx/plan.json` against a live read on 2026-10-20 (589 styles). Applied through the Data API only, in the order below. Breakpoints: D desktop (`main`), T tablet (`medium`), ML mobile landscape (`small`), MP mobile portrait (`tiny`). Shorthands (`padding`, `border`, `flex`, `gap`, `inset`, `grid-column`) are written as longhands; `var()` values are bound to the variable ID.

## 1. New variables (Primitives)

- Colors/Blue `--_primitives---colors--blue` #489CCA (used by Q014)
- Colors/Tan `--_primitives---colors--tan` #906E58 (used by Q017)
- Colors/Navy `--_primitives---colors--navy` #00263E (used by Q017)

## 2. Live corrections

| Class | Live now | Target |
|---|---|---|
| `padding-global` | D 5% left and right | D 2rem left and right |
| `padding-section-large` | D 7, T 6, ML 4rem | D 7, T 5, ML 3.5, MP 2.5rem |
| `padding-section-medium` | D 5, T 4, ML 3rem | D 5, T 3.5, ML 2.5, MP 2rem |
| `padding-section-small` | D 3, ML 2rem | D 3, T 2, ML 1.5, MP 1rem |
| `text-style-script` | D 3.75rem only | adds T 3.25rem, MP 2.5rem |
| `text-size-large` | D 1.25rem, ML 1.125rem | D 1.375rem, line height 1.6; ML unchanged |

The padding-section values go on the global classes, where the live values sit. The `padding-global.padding-section-*` combos are empty and stay empty.

## 3. SVG uploads

`shared-assets/button-outline-dark.svg` and `button-outline-light.svg` go to the asset library. Their hosted URLs replace `url(shared-assets/...)` in `button.is-chamfer.is-outline` and `button.is-chamfer.is-outline-light`.

## 4. Build pages (draft, not in the nav)

| Entry | Title | Slug |
|---|---|---|
| Q012 | 🧱 cta-booking-newsletter | `build-cta-booking-newsletter` |
| Q013 | 🧱 footer-links | `build-footer-links` |
| Q014 | 🧱 hero-fullbleed-centered | `build-hero-fullbleed-centered` |
| Q015 | 🧱 faq-accordion | `build-faq-accordion` |
| Q016 | 🧱 script-intro-centered | `build-script-intro-centered` |
| Q017 | 🧱 split-image-text-light | `build-split-image-text-light` |
| Q018 | 🧱 gallery-mosaic-captioned | `build-gallery-mosaic-captioned` |
| Q019 | 🧱 map-feature | `build-map-feature` |
| Q020 | 🧱 image-trio-text | `build-image-trio-text` |
| Q021 | 🧱 venue-card-fullbleed | `build-venue-card-fullbleed` |
| Q022 | 🧱 form-split-script-contact | `build-form-split-script-contact` |
| Q023 | 🧱 tab-pills-intro | `build-tab-pills-intro` |
| Q024 | 🧱 image-inset-single | `build-image-inset-single` |
| Q025 | 🧱 article-card-staggered | `build-article-card-staggered` |
| Q026 | 🧱 timeline-scatter-images | `build-timeline-scatter-images` |

## 5. Classes to create (296 paths; none exists live)

Combos are dotted paths. "pseudo" marks hover, focus or placeholder states.

### Shared

- `text-style-caption-tracked` (D; 6 values)
- `text-style-script.is-large` (D/T/ML/MP; 4 values)
- `heading-style-display` (D/T/ML/MP; 8 values)
- `padding-global.padding-section-xlarge` (D/T/ML/MP; 8 values)
- `container-full` (D; 4 values)
- `u-image` (D; 4 values)
- `button.is-chamfer` (D; 27 values)
- `button.is-chamfer.is-wide` (D; 1 values)
- `button.is-chamfer.is-text-burgundy` (D; 1 values)
- `button.is-chamfer.is-dark` (D; 2 values)
- `button.is-chamfer.is-burgundy` (D; 2 values)
- `button.is-chamfer.is-blue` (D; 2 values)
- `button.is-chamfer.is-outline` (D; 6 values)
- `button.is-chamfer.is-outline-light` (D; 6 values)
- `accordion_item` (D; 3 values)
- `accordion_header` (D/ML; 19 values)
- `accordion_question` (D; 1 values)
- `accordion_icon` (D; 6 values)
- `accordion_content-wrapper` (D; 2 values)
- `accordion_content` (D/ML; 4 values)

### Q012

- `section_cta-booking-newsletter` (D; 4 values)
- `cta-booking-newsletter_background` (D; 11 values)
- `cta-booking-newsletter_background-image` (D; 5 values)
- `cta-booking-newsletter_overlay` (D; 8 values)
- `cta-booking-newsletter_component` (D/T/ML; 13 values)
- `cta-booking-newsletter_columns` (D/T/ML; 11 values)
- `cta-booking-newsletter_column` (D/T/ML; 7 values)
- `cta-booking-newsletter_divider` (D/ML; 6 values)
- `cta-booking-newsletter_header` (D; 3 values)
- `cta-booking-newsletter_actions` (D; 3 values)
- `cta-booking-newsletter_form-block` (D; 3 values)
- `cta-booking-newsletter_form` (D/MP; 4 values)
- `cta-booking-newsletter_input` (D; 26 values ; pseudo placeholder)
- `cta-booking-newsletter_form-message` (D; 24 values)
- `cta-booking-newsletter_brand` (D; 5 values)
- `cta-booking-newsletter_logo-wrapper` (D/MP; 6 values)
- `cta-booking-newsletter_logo` (D; 3 values)

### Q013

- `section_footer-links` (D/T; 8 values)
- `footer-links_background` (D; 10 values)
- `footer-links_background-image` (D; 5 values)
- `footer-links_overlay` (D; 7 values)
- `padding-global.footer-links_padding` (D; 5 values)
- `footer-links_component` (D/T/ML/MP; 17 values)
- `footer-links_columns` (D/T/ML; 9 values)
- `footer-links_column` (D/ML; 4 values)
- `footer-links_column-header` (D; 4 values)
- `footer-links_column-heading` (D; 3 values)
- `footer-links_list` (D; 9 values)
- `footer-links_list-item` (D; 8 values)
- `footer-links_link` (D/MP; 5 values ; pseudo hover)
- `footer-links_bottom` (D/ML; 7 values)
- `footer-links_legal` (D; 1 values)
- `footer-links_logo` (D/ML; 8 values)
- `footer-links_logo-image` (D; 3 values)
- `footer-links_credit` (D/ML; 4 values)
- `footer-links_text` (D; 2 values)
- `footer-links_credit-link` (D; 3 values)

### Q014

- `section_hero-fullbleed-centered` (D/MP; 9 values)
- `hero-fullbleed-centered_figure` (D; 10 values)
- `hero-fullbleed-centered_image` (D; 4 values)
- `hero-fullbleed-centered_logo-wrapper` (D/T/MP; 12 values)
- `hero-fullbleed-centered_logo` (D; 3 values)
- `hero-fullbleed-centered_component` (D; 7 values)
- `hero-fullbleed-centered_header` (D/MP; 5 values)
- `hero-fullbleed-centered_footer` (D; 2 values)
- `hero-fullbleed-centered_text` (D; 2 values)
- `section_hero-fullbleed-centered.is-text-dark` (D; 1 values)
- `hero-fullbleed-centered_component.is-left` (D/ML; 4 values)

### Q015

- `section_faq-accordion` (D; 2 values)
- `faq-accordion_component` (D/T/ML; 9 values)
- `faq-accordion_header` (D/T/ML/MP; 10 values)
- `faq-accordion_list` (D; 2 values)

### Q016

- `section_script-intro-centered` (D; 3 values)
- `script-intro-centered_component` (D/ML; 6 values)
- `script-intro-centered_back` (D/T/ML; 3 values)
- `script-intro-centered_back-link` (D; 5 values)
- `script-intro-centered_back-icon` (D; 6 values)
- `script-intro-centered_figure` (D/T/ML; 8 values)
- `script-intro-centered_image` (D; 3 values)
- `script-intro-centered_header` (D; 1 values)
- `script-intro-centered_heading` (D/T/ML/MP; 11 values)
- `script-intro-centered_text` (D; 2 values)
- `script-intro-centered_paragraph` (D; 3 values)
- `section_script-intro-centered.is-tall` (D/T/ML; 3 values)
- `script-intro-centered_text.is-wide` (D; 1 values)
- `script-intro-centered_figure.is-bottom` (D/T/ML; 6 values)

### Q017

- `section_split-image-text-light` (D; 3 values)
- `section_split-image-text-light.is-olive` (D; 2 values)
- `section_split-image-text-light.is-tan` (D; 2 values)
- `section_split-image-text-light.is-blue` (D; 2 values)
- `split-image-text-light_component` (D/T/MP; 11 values)
- `split-image-text-light_media` (D/T; 14 values)
- `split-image-text-light_media.is-start-1` (D; 2 values)
- `split-image-text-light_media.is-end` (D/T; 5 values)
- `split-image-text-light_media.is-end-half` (D/T; 5 values)
- `split-image-text-light_media.is-wide` (D/T; 5 values)
- `split-image-text-light_media.is-secondary` (D/T/MP; 10 values)
- `split-image-text-light_media.is-overlap` (D/T; 5 values)
- `split-image-text-light_media.is-chamfer` (D/MP; 2 values)
- `split-image-text-light_image` (D; 4 values)
- `split-image-text-light_content` (D/T; 10 values)
- `split-image-text-light_content.is-start-2` (D; 2 values)
- `split-image-text-light_content.is-start-4` (D; 2 values)
- `split-image-text-light_content.is-start-7` (D; 2 values)
- `split-image-text-light_content.is-start-9` (D; 2 values)
- `split-image-text-light_content.is-bottom` (D/T; 2 values)
- `split-image-text-light_content.is-below` (D/T; 5 values)
- `split-image-text-light_content.is-wide-text` (D/T; 2 values)
- `split-image-text-light_header` (D; 4 values)
- `split-image-text-light_header.is-outdent` (D/T; 6 values)
- `split-image-text-light_eyebrow` (D; 4 values)
- `split-image-text-light_heading` (D; 4 values)
- `split-image-text-light_body` (D; 3 values)
- `split-image-text-light_footer` (D; 3 values)
- `split-image-text-light_caption` (D/T; 10 values)
- `split-image-text-light_stamp` (D/T/MP; 15 values)

### Q018

- `section_gallery-mosaic-captioned` (D; 3 values)
- `gallery-mosaic-captioned_header` (D/T/ML; 11 values)
- `gallery-mosaic-captioned_heading` (D; 3 values)
- `gallery-mosaic-captioned_grid` (D/ML; 5 values)
- `gallery-mosaic-captioned_figure` (D/ML; 9 values)
- `gallery-mosaic-captioned_figure.is-wide` (D/ML; 6 values)
- `gallery-mosaic-captioned_image` (D; 4 values)
- `gallery-mosaic-captioned_feature-header` (D/T/ML; 10 values)
- `gallery-mosaic-captioned_feature-title` (D; 3 values)
- `gallery-mosaic-captioned_caption` (D/T/ML; 15 values)
- `gallery-mosaic-captioned_caption-index` (D; 5 values)

### Q019

- `section_map-feature` (D; 4 values)
- `map-feature_component` (D; 2 values)
- `map-feature_content` (D/T; 8 values)
- `map-feature_header` (D/T/ML; 7 values)
- `map-feature_aside` (D/T; 10 values)
- `map-feature_text` (D; 2 values)
- `map-feature_footer` (D; 2 values)
- `map-feature_list` (D; 6 values)
- `map-feature_item` (D; 9 values)
- `map-feature_item-row` (D; 4 values)
- `map-feature_link` (D; 3 values)
- `map-feature_figure` (D/T/ML; 11 values)
- `map-feature_image` (D; 4 values)
- `map-feature_pins` (D; 6 values)
- `map-feature_pin` (D; 8 values)
- `map-feature_pin.is-pin-1` (D; 2 values)
- `map-feature_pin.is-pin-2` (D; 2 values)
- `map-feature_pin.is-pin-3` (D; 2 values)
- `map-feature_pin.is-pin-4` (D; 2 values)
- `section_map-feature.is-image-bg` (D/T; 3 values)
- `map-feature_content.is-image-bg` (D/T/ML; 23 values)
- `map-feature_header.is-image-bg` (D; 3 values)
- `map-feature_aside.is-image-bg` (D; 3 values)
- `map-feature_figure.is-image-bg` (D/T; 18 values)
- `map-feature_image.is-image-bg` (D; 2 values)
- `map-feature_content.is-centered` (D/T; 5 values)
- `map-feature_header.is-centered` (D/T; 5 values)
- `map-feature_aside.is-centered` (D; 3 values)
- `map-feature_figure.is-centered` (D/T; 4 values)
- `map-feature_image.is-centered` (D; 3 values)

### Q020

- `section_image-trio-text` (D; 4 values)
- `image-trio-text_component` (D/ML; 5 values)
- `image-trio-text_header` (D/ML; 8 values)
- `image-trio-text_heading` (D; 3 values)
- `image-trio-text_paragraph` (D; 2 values)
- `image-trio-text_list` (D/ML; 11 values)
- `image-trio-text_item` (D/ML; 5 values)
- `image-trio-text_figure` (D; 9 values)
- `image-trio-text_image` (D; 4 values)
- `image-trio-text_item-content` (D/ML; 5 values)
- `image-trio-text_item-header` (no styles; 0 values)
- `image-trio-text_item-heading` (D; 3 values)
- `image-trio-text_item-text` (D; 1 values)
- `image-trio-text_footer` (D; 2 values)
- `image-trio-text_link` (D; 4 values)
- `section_image-trio-text.is-left` (D; 1 values)
- `image-trio-text_header.is-left` (D; 1 values)
- `image-trio-text_list.is-left` (D/T/ML; 8 values)
- `image-trio-text_figure.is-left` (D; 1 values)
- `image-trio-text_item.is-offset` (D/T/ML; 3 values)

### Q021

- `section_venue-card-fullbleed` (D; 2 values)
- `venue-card-fullbleed_intro` (D/T/MP; 11 values)
- `venue-card-fullbleed_stage` (D/MP; 8 values)
- `venue-card-fullbleed_media` (D/ML/MP; 9 values)
- `venue-card-fullbleed_item` (D; 5 values)
- `venue-card-fullbleed_figure` (D; 9 values)
- `venue-card-fullbleed_image` (D; 4 values)
- `venue-card-fullbleed_content` (D/MP; 20 values)
- `venue-card-fullbleed_header` (D; 5 values)
- `venue-card-fullbleed_logo-wrapper` (D/MP; 7 values)
- `venue-card-fullbleed_logo` (D; 3 values)
- `venue-card-fullbleed_text` (D; 2 values)
- `venue-card-fullbleed_footer` (D; 2 values)
- `venue-card-fullbleed_tabs` (D/T/ML; 25 values)
- `venue-card-fullbleed_tab` (D; 7 values)
- `venue-card-fullbleed_list` (D/MP; 7 values)
- `venue-card-fullbleed_list-link` (D/MP; 11 values)
- `venue-card-fullbleed_stage.is-media-center` (D; 4 values)
- `venue-card-fullbleed_media.is-media-center` (D/ML; 5 values)
- `venue-card-fullbleed_stage.is-tall` (D; 4 values)
- `venue-card-fullbleed_media.is-tall` (D/ML; 4 values)
- `venue-card-fullbleed_header.is-tall` (D; 2 values)
- `venue-card-fullbleed_stage.is-left` (D; 3 values)
- `venue-card-fullbleed_media.is-left` (D/ML; 4 values)
- `venue-card-fullbleed_content.is-left` (D/ML; 11 values)
- `venue-card-fullbleed_header.is-left` (D; 2 values)
- `venue-card-fullbleed_tab.is-active` (D; 2 values)
- `venue-card-fullbleed_list-link.is-active` (D; 1 values)

### Q022

- `section_form-split-script-contact` (D; 3 values)
- `form-split-script-contact_component` (D/T/ML; 7 values)
- `form-split-script-contact_content` (D/T; 6 values)
- `form-split-script-contact_content.is-centered` (D/T; 2 values)
- `form-split-script-contact_header` (D; 2 values)
- `form-split-script-contact_header.is-rotated` (D/MP; 4 values)
- `form-split-script-contact_paragraph` (D; 2 values)
- `form-split-script-contact_details` (D/MP; 6 values)
- `form-split-script-contact_detail` (D; 3 values)
- `form-split-script-contact_detail-label` (D; 1 values)
- `form-split-script-contact_detail-value` (D; 1 values)
- `form-split-script-contact_links` (D; 4 values)
- `form-split-script-contact_link` (D; 3 values)
- `form-split-script-contact_form-block` (D/T; 4 values)
- `form-split-script-contact_form-block.is-offset` (D/T; 2 values)
- `form-split-script-contact_form` (D; 3 values)
- `form-split-script-contact_fieldsets` (D/T/MP; 5 values)
- `form-split-script-contact_fieldset` (D/MP; 4 values)
- `form-split-script-contact_fieldset-header` (D; 1 values)
- `form-split-script-contact_fields` (D/ML; 5 values)
- `form-split-script-contact_field` (D; 3 values)
- `form-split-script-contact_field.is-full` (D; 2 values)
- `form-split-script-contact_input` (D; 28 values ; pseudo placeholder, focus)
- `form-split-script-contact_input.is-textarea` (D/MP; 5 values)
- `form-split-script-contact_footer` (D; 2 values)
- `form-split-script-contact_message` (D; 7 values)
- `form-split-script-contact_media` (D; 8 values)
- `section_form-split-script-contact.is-tall` (D/T/ML; 6 values)

### Q023

- `section_tab-pills-intro` (D; 3 values)
- `tab-pills-intro_component` (D/T/ML/MP; 8 values)
- `tab-pills-intro_header` (D/T/ML/MP; 8 values)
- `tab-pills-intro_heading` (D; 2 values)
- `tab-pills-intro_text` (D; 1 values)
- `tab-pills-intro_stage` (D/MP; 10 values)
- `tab-pills-intro_frame` (D; 4 values)
- `tab-pills-intro_tabs` (D/T/MP; 20 values)
- `tab-pills-intro_tab` (D; 7 values)
- `tab-pills-intro_component.is-media` (D/T/ML/MP; 8 values)
- `tab-pills-intro_header.is-media` (D/T/ML; 3 values)
- `tab-pills-intro_stage.is-media` (D/MP; 10 values)
- `tab-pills-intro_frame.is-media` (D/ML/MP; 9 values)
- `tab-pills-intro_tabs.is-media` (D/MP; 6 values)
- `tab-pills-intro_tab.is-active` (D; 4 values)

### Q024

- `section_image-inset-single` (D; 1 values)
- `image-inset-single_figure` (D; 8 values)
- `image-inset-single_image` (D; 4 values)
- `image-inset-single_figure.is-small` (D; 2 values)

### Q025

- `section_article-card-staggered` (D; 2 values)
- `article-card-staggered_component` (D/T/ML; 15 values)
- `article-card-staggered_header` (D/T/ML; 9 values)
- `article-card-staggered_intro` (D/ML; 2 values)
- `article-card-staggered_list` (D/T/ML/MP; 6 values)
- `article-card-staggered_item` (D/ML; 6 values)
- `article-card-staggered_figure` (D; 8 values)
- `article-card-staggered_content` (D/ML; 6 values)
- `article-card-staggered_text` (D/ML; 2 values)
- `article-card-staggered_component.is-right` (D/ML; 3 values)
- `article-card-staggered_component.is-tall` (D/T/ML/MP; 19 values)
- `article-card-staggered_header.is-tall` (D/ML; 2 values)
- `article-card-staggered_list.is-tall` (D/T/ML/MP; 4 values)
- `article-card-staggered_item.is-tall` (D/ML; 2 values)
- `article-card-staggered_figure.is-tall` (D; 1 values)
- `article-card-staggered_text.is-tall` (D; 1 values)

### Q026

- `section_timeline-scatter-images` (D; 1 values)
- `timeline-scatter-images_component` (D; 1 values)
- `timeline-scatter-images_header` (D/ML; 8 values)
- `timeline-scatter-images_heading` (D; 4 values)
- `timeline-scatter-images_list` (D/ML; 5 values)
- `timeline-scatter-images_item` (D; 9 values)
- `timeline-scatter-images_image-wrap` (D; 5 values)
- `timeline-scatter-images_image` (D; 3 values)
- `timeline-scatter-images_caption` (D; 9 values)
- `section_timeline-scatter-images.is-tall` (no styles; 0 values)
- `timeline-scatter-images_header.is-tall` (D/ML; 5 values)
- `timeline-scatter-images_heading.is-tall` (D; 1 values)
- `timeline-scatter-images_list.is-tall` (D/ML; 2 values)
- `timeline-scatter-images_caption.is-tall` (D; 1 values)
- `timeline-scatter-images_item.is-xsmall` (D/ML; 2 values)
- `timeline-scatter-images_item.is-small` (D/ML; 2 values)
- `timeline-scatter-images_item.is-medium` (D/ML; 2 values)
- `timeline-scatter-images_item.is-large` (D/ML; 2 values)
- `timeline-scatter-images_item.is-xlarge` (D/ML; 2 values)
- `timeline-scatter-images_item.is-inset` (D/ML; 2 values)
- `timeline-scatter-images_item.is-center` (D/ML; 2 values)
- `timeline-scatter-images_item.is-end` (D; 1 values)
- `timeline-scatter-images_item.is-lift` (D/ML; 2 values)
- `timeline-scatter-images_image-wrap.is-xsmall` (D; 1 values)
- `timeline-scatter-images_image-wrap.is-small` (D; 1 values)
- `timeline-scatter-images_image-wrap.is-medium` (D; 1 values)
- `timeline-scatter-images_image-wrap.is-large` (D; 1 values)
- `timeline-scatter-images_image-wrap.is-xlarge` (D; 1 values)

## 6. Empty chain paths (13)

These plans stack combos in an order no defined style path covers. The empty path lets the element builder resolve the class list without creating anything. Empty styles emit no CSS; the defined combos still apply in the browser.

- `button.is-chamfer.is-text-burgundy.is-wide` (Q012)
- `script-intro-centered_heading.text-style-script.is-large` (Q016)
- `split-image-text-light_content.is-start-4.is-below` (Q017)
- `split-image-text-light_heading.text-style-script.is-large` (Q017)
- `split-image-text-light_content.is-start-9.is-bottom` (Q017)
- `split-image-text-light_content.is-start-7.is-wide-text` (Q017)
- `split-image-text-light_content.is-start-7.is-below` (Q017)
- `split-image-text-light_content.is-start-2.is-bottom` (Q017)
- `split-image-text-light_content.is-start-2.is-bottom.is-wide-text` (Q017)
- `split-image-text-light_content.is-start-7.is-bottom` (Q017)
- `split-image-text-light_content.is-start-7.is-bottom.is-wide-text` (Q017)
- `split-image-text-light_media.is-start-1.is-chamfer` (Q017)
- `tab-pills-intro_heading.text-style-script.is-large` (Q023)

## 7. Not expressible as class styles

- `accordion_icon` state `accordion_header.is-active` (rotate 0deg) is a parent-state selector. Not written. The Q015 build needs one CSS rule, for example in an embed: `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }`.
- Q020 `is-left` styles descendants of the section (`.section_image-trio-text.is-left .image-trio-text_header` and so on). Written as `image-trio-text_header.is-left`, `image-trio-text_list.is-left` and `image-trio-text_figure.is-left`, so the Q020 build applies `is-left` to those three elements as well as the section.

## 8. Result (applied 2026-10-20 after Stephen's yes)

- Variables: Colors/Blue `variable-f1330699-c5fe-75bc-bcf8-630b5a4086eb`, Colors/Tan `variable-cdc4b0e2-ec6d-8afb-20be-e56ed7d3047f`, Colors/Navy `variable-bbb7c022-7587-5697-05f4-9fa10672c409`.
- SVGs: dark `6ad712867471777f5f7e40b1`, light `6ad7128647118d6eef7696f1` (both 200 on the CDN).
- Corrections: all six applied and read back.
- Build pages: 15 created as drafts; IDs in `docs/reference/webflow-ids.md`.
- Classes: 296 created, 0 skipped (none existed), 0 mismatches. A full `get_styles` read-back with every breakpoint and pseudo state matches every plan value. Live total is 901 styles.
- Empty chain paths: 13 created. The three `<heading>.text-style-script.is-large` paths needed an empty parent `<heading>.text-style-script` first (the create failed with "Parent style not found"), so 3 extra empty combos exist: `script-intro-centered_heading.text-style-script`, `split-image-text-light_heading.text-style-script`, `tab-pills-intro_heading.text-style-script`.
- One value changed on write: Webflow turned `accordion_item` `border-bottom-color: color-mix(in srgb, var(--neutral-darkest) 30%, transparent)` into a plain binding to Neutral Darkest, dropping the 30% mix. Corrected to `rgba(38, 33, 24, 0.3)` (the same colour, unbound). Avoid `color-mix()` with a variable in Data API style writes.

## 9. Later cleanup (not done; plans approved as they are)

- Six family image classes have styles identical to `u-image` (block, 100% by 100%, cover): `hero-fullbleed-centered_image`, `split-image-text-light_image`, `gallery-mosaic-captioned_image`, `image-trio-text_image`, `venue-card-fullbleed_image`, `image-inset-single_image`.
- Four logo classes are identical (block, width 100%, height auto): `cta-booking-newsletter_logo`, `footer-links_logo-image`, `hero-fullbleed-centered_logo`, `venue-card-fullbleed_logo`. A shared `u-logo` (or `u-image is-contain`) could replace them.
