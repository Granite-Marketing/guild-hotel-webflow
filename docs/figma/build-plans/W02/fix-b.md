# fix-b: form-split-script-contact labels (component 2f0cac24-8156-b0d7-520c-f5128139d6b0)

## Root cause
Done (diagnosed). The inputs had no placeholder, so Webflow rendered its default "Example Text". The Data API cannot set placeholders ("placeholder" is a reserved attribute name), and the group 2 heading "shoot details" was hardcoded text.

## Component change (definition)
Done. I followed the Q043 contact-form pattern:
- Added a visible `FormBlockLabel` (class `text-style-eyebrow-caps`) before each of the 11 inputs. Label ids: 21f93365-e83f-7d4d-f2e6-25937076a00a, 813ac587-8219-35ca-e5ad-b35d50f332e7, db205d92-8a15-459c-90d9-69f878eea4b7, a6b08b4a-81d2-d724-34da-0a725f3e9a9c, 68c91f55-1fac-e76c-237a-0e65f7f41273, 015de9f1-ba81-2bfb-f995-80b1212dd8a3, bd689508-7aad-3d03-d282-1c67c77f4def, ed585265-7f22-f74a-2e91-5536053a2783, 452036b8-6316-4682-f9b2-7376a8f25b65, 98fb4cb1-bb76-2ca3-9c0a-80e7f521ca42, faa3d514-2114-47ea-3cbd-8ab4c7903469.
- Each input now uses the existing `is-labelled` combo, which makes the placeholder transparent. The textarea uses `is-textarea is-labelled`.
- Each label's text and its input's `aria-label` are bound to a new prop.
- New props, all in group "Form":
  - Group 1 Heading cbb793f7-58e6-9118-7771-0fbc80047f05
  - Field 1 to 5 Label: 5c3e62e3-c654-79e0-fc87-7cdcdb4ba735, b71c129e-ebb2-a926-e8a5-f9e761c6758c, 75a59ab2-b54f-654d-620a-57948e69aa4e, b180d76c-049f-e8c8-4fd6-797980c004a8, 34ef4609-8791-3f66-8f34-a79c75275f07
  - Show Field 5 ff417378-acbb-572e-75a3-1a24087408e8
  - Show Group 2 Heading d10a2477-c226-a8b8-cefd-2a018f5b36dd
  - Group 2 Heading b020bb37-3095-4bea-01aa-97f03b17124d
  - Field 6 Label 9c6f9f5e-b4ef-27bc-68e7-09efb71caf17, Show Field 6 fc110b12-230b-0a63-69d0-cb0bfcb2335a
  - Field 7 Label c2da002d-df09-cc70-1324-8f8b6fe2140f
  - Field 8 Label 615146da-5a64-d2c4-edee-0402283d4b3d, Show Field 8 462d864e-4976-c1ac-6dd5-3e2238c90552
  - Field 9 Label 5910644d-3ed3-4507-cae8-b1ea99f8018f, Show Field 9 d22057d4-932f-1c41-6196-c0f27af426b5
  - Field 10 Label 2c7e6c3f-e2d8-2deb-59ba-27432b461699, Show Field 10 036fd4e3-ae7d-195b-589b-4272c24fc165
  - Field 11 Label bf475d36-40e7-a213-4a1a-d529cf77fa07
- The defaults are the Guidelines photoshoot labels.
- Styles:
  - `form-split-script-contact_fieldsets` row-gap is now 1.8125rem at every breakpoint. It was 6.6875rem, with 4.5rem at medium and 3.5rem at tiny.
  - New combo `form-split-script-contact_fieldset-header.is-spaced` (3e945dfb-8cc9-ca07-c950-de03d31b7ba3) is on the group 2 header. It sets margin-top 4.875rem, 2.6875rem at medium and 1.6875rem at tiny, so the gap between the groups is unchanged.
  - When Show Group 2 Heading is off, the two groups read as one list with normal row spacing.
- The contact page does not use `_fieldsets`, so it is unaffected. The Contact variant hides the form block.

## Instances
Done.
- Guidelines 402516c8-cd6b-d060-14aa-9d368b87e7e6: uses the defaults, no overrides.
- Press 4d9cd303-a520-4f77-54c4-d40f1e244df2:
  - Fields 5, 6, 8 and 10 are hidden, and so is the group 2 heading.
  - Field 7 is "Organization", field 9 is "Expected publish date" (they share a row) and field 11 is "Details".
- Meetings bf2d85be-cad9-4f76-7939-f3ae9f16f6a0 (Tall):
  - Group 2 heading is "event details".
  - Field 6 is hidden and field 7 is "Event Date". The rest of the defaults match Figma.
- Legal Corporates Template 47eef706-d84f-ed20-87ae-22873f1031f2:
  - Fields 5 and 6 are hidden, and so is the group 2 heading.
  - Fields 7 to 10 are "Law firm / Company", "Team size", "Check-in date" and "Check-out date". Field 11 is "Special requirements".
  - These are static values. The collection has no form-label fields, so legal and corporate share them.

## Gaps
- Input `name` cannot be bound or changed per instance (canBind false). Submissions on press, meetings and legal therefore use the photoshoot names:
  - Press: "Organization" submits as shoot-date and "Expected publish date" as start-time.
  - Legal: "Law firm / Company" submits as shoot-date, "Check-in date" as start-time and "Check-out date" as end-time.
  - Fixing this needs a Designer pass or slotted forms.
- When the group 2 heading is hidden, fieldset 2 still has role=group with an aria-labelledby that points to the removed heading. This is minor.
- Labels sit above the input line, as on Contact, not on the line as in Figma. Row pitch is a little taller than the crop.
- Designer step for Stephen (optional): set real placeholders, or clear the "Example Text" placeholder, on the 11 inputs in the component. In the Designer: Components panel, open form-split-script-contact, select each input, then Element settings, Placeholder.
- Not published.
