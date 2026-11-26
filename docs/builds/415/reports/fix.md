# Fix stage report

Both blocking review findings are fixed in the copy check.

- A row now counts as done only when its own target shows the new text. Before, the same words anywhere on the page counted, so a heading still showing the old text (Guild Neighborhood line 55) read as done.
- Copies of slides made by the slider no longer count either.
- Rows with no way to find their target still count as done when the new text is anywhere on the page, as before.
- Six new tests cover these cases; all copy check tests and the type check pass.

Nothing new for Stephen at merge.
