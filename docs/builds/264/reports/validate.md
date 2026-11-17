Checked 14 of 14 Done-when items against the code changes: all 14 pass, none fail.
The checks read the built source for the expected behaviour (fades, staggers, docking, new-tab links, tilt, focus ring).
They do not run the live pages in a browser, because the repo has no browser-job command for validation.
The repo's own visual tests were added by the build but not run here.
For Stephen at merge: the on-screen feel (scroll jump at the footer, hero zoom, menu easing) is only proven in code, so glance at staging on a phone.
No escalation needed.
