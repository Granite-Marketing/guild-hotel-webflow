verdict: ship

What this change does: Four fixes. (176) The page no longer freezes while loading: text is split into lines only when it is near the screen, and the Google Maps script is fetched after load while the browser is idle. (177) A new `data-reveal-start` attribute sets where a scroll reveal begins, with a safe fallback. (178) Dialogs now stack, so Back returns to the dialog beneath. (179) All button outlines share one thickness variable and the diagonal edges are smoother.

Must fix: none found.

Should fix: none found. The risky logic (dialog stack, lazy text split, reveal-start parsing, outline fixtures) has fixtures or tests that fail if it breaks.

Nice to have:
1. **Brief flash on a fast jump** (`src/utils/lineMaskReveal.ts`, `flushSplitQueue` / `ensureAllSplit`)
   - What this is: Far-away text stays unsplit and plain until it comes within one screen of the viewport.
   - Problem: A jump by anchor link or fast fling can bring unsplit text on screen before it is split. It shows for a moment, then hides, then reveals.
   - Fix: None needed unless Stephen sees it. If so, hide far text in CSS until split.
   - If we skip it: A rare one-frame flicker on long jumps.
2. **Overlay not restored when going back** (`src/utils/modals.ts`, `popTo`)
   - What this is: Going back to a dialog beneath re-shows it.
   - Problem: If the dialog above had `data-modal-no-overlay` and the one beneath wants the overlay, the overlay stays hidden after Back. No current dialog mixes these.
   - Fix: Re-apply the overlay state for the revealed dialog in `popTo`.
   - If we skip it: Only matters if such a mix is added later.
3. **Maps script loads on every map page** (`src/utils/map.ts`, `warmUpApi`)
   - What this is: The script is now fetched after load even if the visitor never scrolls to the map.
   - Problem: Extra download on map pages. No map load is billed, since the map is still built only near the viewport.
   - If we skip it: Slightly more data, a deliberate trade for smooth scrolling.

Verdict: Ship.
Lean: no lean findings.
Not checked: live scroll behaviour on the four pages and real-device performance; I read the code and diff only.
