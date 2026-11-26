# Ad hoc tasks, 26 Nov 2026 (Stephen)

Stephen's words, quoted:

- **Font:** "We're going to have to upload the latest version of the font to Webflow. I think right now we only have a preview version." Done in the planning session: the purchased Gatch Regular and Medium files replaced the files behind the existing "Gatchtest" 400 and 500 fonts (Stephen chose to keep the name so no style changes). Live after the next staging publish.
- **V1 (hexagon video):** "For the hexagonal vertical scroll mask sections ... we need to also make these be able to double as a video, same as the hero sections, same as the items inside of the arts and gallery dynamic scroller ... We're going to be using Dropbox for that ... We need to make sure the client is able to upload the URL in multiple formats so they don't have to think about it. It should just be super seamless for them."
  Sample link: https://www.dropbox.com/scl/fi/z504c8xp3us619nullzpt/sora-video-comp.mp4?rlkey=1g6iykbanj51s8nie06wzsev2&st=lznctb23&dl=0
  Finding: a Dropbox share link opens a web page, not the file. Swapping the host to `dl.dropboxusercontent.com` (keeping `rlkey`) or adding `raw=1` returns the MP4 itself with byte ranges, so a plain video element plays it. No custom element is needed.
- **F1 (footer):** "remove the services, amenities, and in-room dining from the leftmost menu underneath the hotel." The Hotel column holds Services and Amenities; In-room Dining sits in the Dining column. Reading: remove all three links wherever they are.
- **F2 (footer):** "add legal and trial teams under corporate, just below the tag that says corporate." Legal goes in now. Trial Teams waits: Stephen will ask the client where it should point (26 Nov).
