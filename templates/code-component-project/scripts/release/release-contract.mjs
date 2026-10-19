import { createHash } from 'node:crypto'
import ts from 'typescript'

function major(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(version ?? '')
  return match ? Number(match[1]) : null
}

function compareVersions(left, right) {
  const parse = (value) => /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(value ?? '')?.slice(1, 4).map(Number)
  const leftParts = parse(left)
  const rightParts = parse(right)
  if (!leftParts || !rightParts) return null
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index]
  }
  return 0
}

export function hashComponentProps(contents, fileName = 'component.webflow.tsx') {
  const source = ts.createSourceFile(fileName, contents, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let propsNode = null
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'declareComponent' && node.arguments[1] && ts.isObjectLiteralExpression(node.arguments[1])) {
      const property = node.arguments[1].properties.find((candidate) => candidate.name?.getText(source) === 'props')
      if (property && ts.isPropertyAssignment(property)) propsNode = property.initializer
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (!propsNode) throw new Error(`Unable to find declared props in ${fileName}`)
  const canonical = ts.createPrinter({ removeComments: true }).printNode(ts.EmitHint.Expression, propsNode, source)
  return createHash('sha256').update(canonical).digest('hex')
}

export function compareInventories(previous = [], next = []) {
  const previousByName = new Map(previous.map((component) => [component.name, component]))
  const nextByName = new Map(next.map((component) => [component.name, component]))
  return {
    added: [...nextByName.keys()].filter((name) => !previousByName.has(name)).sort(),
    removed: [...previousByName.keys()].filter((name) => !nextByName.has(name)).sort(),
    changed: [...nextByName.keys()].filter((name) => previousByName.has(name) && previousByName.get(name).propsHash !== nextByName.get(name).propsHash).sort(),
  }
}

export function validateReleaseCandidate(candidate) {
  const errors = []
  const currentMajor = major(candidate.version)
  const previousMajor = major(candidate.previousVersion)
  if (currentMajor === null || previousMajor === null) errors.push('Release and previous versions must use semantic versioning.')
  if (compareVersions(candidate.version, candidate.previousVersion) !== null && compareVersions(candidate.version, candidate.previousVersion) <= 0) errors.push('Release version must be newer than the previous version.')
  if (!candidate.sourceRevision) errors.push('Release requires an immutable source revision.')
  const breaking = (candidate.inventoryChanges?.removed?.length ?? 0) > 0 || (candidate.inventoryChanges?.changed?.length ?? 0) > 0
  if (breaking && currentMajor !== previousMajor + 1) errors.push('Breaking component changes require a major version increment.')
  if (breaking && !candidate.migrationNotes?.trim()) errors.push('Breaking component changes require migration notes.')
  return errors
}

export function validateStagingApproval({ release, changedSinceSource = [], isClean }) {
  if (!release || release.status !== 'candidate') return ['Release must be an unapproved candidate.']
  const errors = []
  if (!isClean) errors.push('Staging approval requires a clean committed repository.')
  const sourceChanges = changedSinceSource.filter((path) => path !== 'project/releases.json')
  if (sourceChanges.length) errors.push(`Source changed after candidate preparation: ${sourceChanges.join(', ')}`)
  return errors
}

export function validateProductionPromotion({ release, currentRevision, changedSinceSource = [], isClean, rollback = false }) {
  if (!release) return ['The requested release does not exist.']
  const errors = []
  if (rollback) {
    if (!['production', 'superseded'].includes(release.status) || !release.productionRevision || !release.productionImportedAt) {
      errors.push('Rollback target must be a previously imported production release with a verified production receipt.')
    }
  } else if (!release.stagingApproved || release.status !== 'staging' || release.stagingReceipt?.sourceRevision !== release.sourceRevision) {
    errors.push('Release must have a same-source Webflow staging smoke receipt before production import.')
  }
  if (!isClean) errors.push('Production import requires a clean committed repository.')
  if (!currentRevision) errors.push('Production import requires a current git revision.')
  const sourceChanges = changedSinceSource.filter((path) => path !== 'project/releases.json')
  if (sourceChanges.length) errors.push(`Source changed after candidate preparation: ${sourceChanges.join(', ')}`)
  return errors
}

export function validatePendingImport({ pending, version, acknowledge = false, confirmation }) {
  if (!pending) return acknowledge ? ['There is no pending production import to acknowledge.'] : []
  if (acknowledge && pending.version === version && confirmation === 'verified') return []
  return [`Production import ${pending.version} has an unresolved pending receipt. Verify Webflow state, then acknowledge that exact version with CONFIRM_WEBFLOW_IMPORT_STATE=verified before retrying.`]
}
