# Fix final notes (W02, 2026-10-20)

Webflow session `ses_3KyjleEmEwkwXdHxuj4MmpfM97K`, agent `opus-5.5|claude-code|fxfin7`. Published once to the webflow.io subdomain only (customDomains []).

## Dinings Template 02 split: navy for Zuma, olive for the other three
Done.
- The API can bind visibility to a CMS Switch but cannot negate it ("is not set") and the Variant prop cannot be CMS-bound, so two Switch fields were added to `🍴 Dinings` `6ad67d7316e13e66c2b760d7`:
  - `split-navy` (Split navy) `0d16375ae105c812898c1414b164396c`: on for dining-zuma only.
  - `split-olive` (Split olive) `02fc9fa8ec20d434468f0a6d0f8c3c92`: on for gardenterrace, lobbybar, poollounge.
  Help text says to keep them opposite.
- Two plain wrapper divs (no class) placed before `section_text-columns-info`:
  - `b593bcb7-ed60-d71a-f66b-582b745d038d` "Split 02 navy (CMS: Split navy)", visibility bound to split-navy, holds the existing Blue instance `e0471a1c-0f53-a890-8460-fbddb329850e` (moved in, props intact).
  - `0cb03fde-8f59-6a1f-e6a9-98f9a13d8318` "Split 02 olive (CMS: Split olive)", visibility bound to split-olive, holds new instance `0f87c04b-e622-8542-b5b9-e63fcb77ed4b` (Variant Olive `654bb362-ab8e-2b17-8c1c-352117770874`, same Heading and Body, Image bound to `intro-image`).
- DRESS CODE fix (fix-d `section_text-columns-info` padding) untouched and works for both.

## Live verification (1440x900, Playwright)
- dining-zuma: Blue variant, bg rgb(0,38,62).
- dining-gardenterrace, dining-lobbybar, dining-poollounge: Olive variant, bg rgb(41,49,12).
- Only one section 02 split renders per page. On all four, media bottom 1803px, DRESS CODE top 2052px (about 249px gap, no overlap).
- Screenshots: scratchpad/fixes/verify-final/*.png.

## For webflow-ids.md (orchestrator)
Dinings fields split-navy, split-olive (ids above); template wrappers and new olive instance ids above. The webflow-ids row "Split Olive `e0471a1c...`" is now the navy instance inside the navy wrapper.

## Optional Designer tidy for Stephen
To drop the redundant split-olive field: Dinings Template > Navigator > "Split 02 olive" div > Settings > Visibility > Conditional > Split navy "is not set"; then delete field Split olive in CMS > Dinings > Settings.
