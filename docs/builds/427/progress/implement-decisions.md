# Implement decisions

- Build #428 in the lead session on the build branch, no ticket worktree or implementer subagent; alternatives: one Sonnet implementer in a nested worktree; why: one small ticket, two source files, a handoff costs more than the work; landed: build branch
- Dropbox lives in parseVideoUrl (embedVideo.ts), returning a file source; alternatives: a separate normaliser called by each module; why: every video link already flows through parseVideoUrl, so hero, gallery, history and panels get it at once; landed: src/utils/embedVideo.ts
- A snap panel whose image frame has a playable video link scales the frame (image and video together) instead of the image; alternatives: run mediaVideo before scrollEnlargeSnap (breaks Swiper clones), mirror the image transform onto the video each tick; why: the video is added after the timeline is built, and the frame fills the panel so the move looks identical; landed: src/utils/scrollEnlargeSnap.ts
