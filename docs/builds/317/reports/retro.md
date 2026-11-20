Retrospective written for build 317; nothing needs a decision at merge.
Cost: about $107 total, two thirds in implement, which took six fix rounds.
Most rounds were gate friction (missing dependencies, validator files breaking the typecheck, rebuilt bundle dirtying the tree), not code faults.
Four candidate rules are queued for your approval: seed dependencies in new worktrees, keep held-out checks out of src, let the gate ignore the protected bundle, point visual checks at fixtures for code-only specs.
Detail: docs/builds/317/retrospective.md
