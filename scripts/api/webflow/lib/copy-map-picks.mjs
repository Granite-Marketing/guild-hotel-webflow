// Applies the upload's committed picks (docs/specs/guild-content/catalogue/picks.json) to a built copy map.
// accept keeps the row, reject turns it into "not on site" with the note as reason, retarget overrides row fields.
// Every pick is recorded on its row as `pick`. Pure: no I/O.
export function applyPicks(rows, picks) {
  const byId = new Map(rows.map((row) => [row.id, row]))
  for (const { id, pick, note, set } of picks) {
    const row = byId.get(id)
    if (!row) throw new Error(`pick for unknown row ${id}`)
    if (pick === 'reject') Object.assign(row, { status: 'not on site', targetKind: 'not-on-site', target: null, reason: note })
    else if (pick === 'retarget' || set) Object.assign(row, set)
    row.pick = { decision: pick, note }
    row.needsConfirm = false
  }
  for (const row of rows) row.conflictsWith = row.conflictsWith.filter((other) => byId.get(other)?.status !== 'not on site')
  const open = rows.filter((row) => row.needsConfirm).map((row) => row.id)
  if (open.length) throw new Error(`rows to confirm with no pick: ${open.join(', ')}`)
  return rows
}
