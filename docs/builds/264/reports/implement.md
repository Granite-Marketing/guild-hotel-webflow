# Implement (attempt 3, fix round 2)

All six tickets (#265 to #270) were already merged on the build branch and passed validation; nothing in them changed.
The only fix: the build had rebuilt the published script bundle, which the pipeline may not touch. It is now back to the main version.
What this means for Stephen: the new animations and fixes are in the source, but the live site only gets them once the bundle is rebuilt and released after merge. That step is filed as follow-up https://github.com/Granite-Marketing/guild-hotel-webflow/issues/286.
Type check passes. Three taste assumptions (fade pacing, subnav rise, hero zoom) wait for his eye at merge.
