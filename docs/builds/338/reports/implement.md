# Implement, fix round 2

- The day and night switch (ticket #339) was already built and merged on the branch; its 18 browser checks pass at 390 and 1440.
- The last attempt failed only because it rebuilt the shipped bundle files, which the pipeline may not touch. Those two files are now back to their main versions.
- Effect: the live bundle does not include the switch until the release step rebuilds it. Filed as https://github.com/Granite-Marketing/guild-hotel-webflow/issues/358.
- Typecheck and factory tests pass.
- At merge: answer the six assumptions (cookie scope, fade speed, nav button attributes, head snippet registration).
