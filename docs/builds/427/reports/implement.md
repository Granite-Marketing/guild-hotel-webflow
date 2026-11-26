# Implement report, build 427

Built the one ticket (#428). Any Dropbox link the client pastes (share link with dl=0, dl=1 or raw=1, old /s/ links, direct links) now turns into the direct video file, everywhere the site takes video links. YouTube, Vimeo and plain file links are unchanged.

A video in a hexagon panel now makes the same settle-in move as the image; panels with a blank or broken link look exactly as today. Tests cover both, at phone and desktop width.

At merge, know that:
- The panels' video fields and the footer link changes are Designer work no ticket covered; filed as #433. Until then nothing changes on the live site.
- Two small product choices are in the assumptions list (other Dropbox link values are kept; the video panel scales its whole frame).
- One older panel test is flaky on main too; filed as #432.
