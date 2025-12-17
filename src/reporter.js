import pc from "picocolors"
import { formatViolation } from "./personality.js"

const SEVERITY_STYLES = {
  low: pc.cyan,
  medium: pc.yellow,
  high: pc.red,
  critical: text => pc.bgRed(pc.white(text))
}

function severityLabel(severity) {
  const style = SEVERITY_STYLES[severity] || pc.white
  return style(severity.toUpperCase())
}

function formatLocation(location) {
  if (!location || !location.start) {
    return "unknown location"
  }

  return `line ${location.start.line}, column ${location.start.column}`
}

function groupByFile(violations) {
  return violations.reduce((acc, v) => {
    acc[v.filePath] = acc[v.filePath] || []
    acc[v.filePath].push(v)
    return acc
  }, {})
}

function renderSummary(summary) {
  const lines = []
  lines.push(pc.bold("\nSummary\n"))

  for (const [severity, count] of Object.entries(summary.bySeverity)) {
    const style = SEVERITY_STYLES[severity] || pc.white
    lines.push(`${style(severity.padEnd(10))}: ${count}`)
  }

  lines.push(`\nTotal violations: ${summary.totalViolations}\n`)
  return lines.join("\n")
}

function renderConsole(results, context) {
  const grouped = groupByFile(results.violations)

  console.log(pc.bold("\nPolice of Code Report\n"))
  console.log(`Scanned files: ${results.meta.filesScanned}`)
  console.log(`Analyzed at : ${results.meta.analyzedAt}`)
  console.log(`Mode        : ${context.mode}\n`)

  for (const [file, violations] of Object.entries(grouped)) {
    console.log(pc.underline(file))

    for (const violation of violations) {
      const formatted = formatViolation(violation, context.mode)
      const label = severityLabel(violation.severity)
      const location = formatLocation(violation.location)

      console.log(`  ${label} ${formatted.message}`)
      console.log(`    Rule       : ${violation.ruleId} (${violation.ruleName})`)
      console.log(`    Location   : ${location}`)
      console.log(`    Explanation: ${formatted.explanation}`)

      if (formatted.suggestion) {
        console.log(`    Suggestion : ${formatted.suggestion}`)
      }

      console.log("")
    }
  }

  console.log(renderSummary(results.summary))
}

function renderJson(results) {
  const payload = {
    meta: results.meta,
    summary: results.summary,
    violations: results.violations
  }

  process.stdout.write(JSON.stringify(payload, null, 2))
}

export function reportResults(results, context) {
  if (context.format === "json") {
    renderJson(results)
    return
  }

  renderConsole(results, context)
}
