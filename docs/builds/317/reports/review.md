# Review stage report (round 1)

Verdict: fix first. The three code tickets are mostly right, with two real problems to fix before merge.

1. The Offers slider now shows its arrows and a wrong counter when a CMS list is empty. Before this change they were hidden. The new test locks in the wrong behaviour.
2. When the hero has a video, the video covers the image straight away, so the zoom-in on load is invisible, and YouTube links flash their player controls. The fix is to show the video only once it is playing.

Smaller points: the runtime reference doc is missing the new video module and the slider's new rules; two category lists on one page would fight over one tab bar; every video loads at once; YouTube and Vimeo links have no test.

Nothing here needs a decision from Stephen. All nine findings are in docs/builds/317/review.md for the fix stage.
