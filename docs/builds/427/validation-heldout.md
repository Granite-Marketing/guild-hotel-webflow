head: 6abfd13ace207e9f3eecc61b8f4b33f627832a0e
verdict: pass
attempt: 1

| Done-when | Check | Result | Failure message |
|---|---|---|---|
| V1 Dropbox shapes (scl dl=0/1/raw=1, old /s/, dl.dropboxusercontent.com) become direct link keeping rlkey, dropping dl/raw/st | held-out node test, 5 cases exact URL | pass | |
| V1 YouTube, Vimeo, plain file unchanged | held-out node test, 3 cases | pass | |
| V1 factory test covers every shape | tests/factory/video-link.test.mjs covers all shapes incl. sample link; 62/62 factory pass | pass | |
| V1 video covers frame, scales with image; image-only unchanged | builder's Playwright spec run at 390 and 1440 (6/6) plus diff read (frame is settle target only when link playable) | pass | |
| V1 blank link keeps image | held-out blank parse returns null; Playwright blank/broken case passes | pass | |
| pnpm check, test:factory, build:check pass | run all three | pass | |
| new tests fail before the change | old code: 9 failed, 12 passed; the 12 are unchanged-behaviour regression guards (already true) | pass | |

Known-red on base: none observed.
