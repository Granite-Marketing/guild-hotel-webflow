All six tickets are built and merged on the build branch; tests and type checks pass.
Repair: the compiled bundle files are off limits during a build, so they were put back to how main has them.
At merge: the new code reaches the live site only after the bundle is rebuilt and released, tracked in https://github.com/Granite-Marketing/guild-hotel-webflow/issues/252.
One older test failure exists on main too and is tracked separately (#251).
Nine assumptions are listed for review at merge.
