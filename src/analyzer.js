import fs from "fs/promises"
import path from "path"
import { glob } from "glob"
import { parseSource } from "./parser.js"
import { executeRules } from "./ruleEngine.js"
import rules from "./rules/index.js"

const SEVERITY_ORDER = ["low", "medium", "high", "critical"]

function isJavaScriptFile(filePath) {
  return filePath.endsWith(".js") || filePath.endsWith(".mjs") || filePath.endsWith(".cjs")
}

function normalizeSeverity(severity) {
  return severity.toLowerCase()
}

function severityAllowed(severity, minimum) {
  return SEVERITY_ORDER.indexOf(severity) >= SEVERITY_ORDER.indexOf(minimum)
}

async function collectFiles(targetPath) {
  const stats = await fs.stat(targetPath)

  if (stats.isFile()) {
    return isJavaScriptFile(targetPath) ? [targetPath] : []
  }

  if (stats.isDirectory()) {
    const pattern = path.join(targetPath, "**/*.{js,mjs,cjs}")
    return glob(pattern, { nodir: true, absolute: true })
  }

  return []
}

async function analyzeFile(filePath, context) {
  const source = await fs.readFile(filePath, "utf-8")
  const ast = parseSource(source, filePath)
  const violations = executeRules(ast, rules, {
    filePath,
    source,
    context
  })

  return violations.map(v => ({
    ...v,
    filePath,
    severity: normalizeSeverity(v.severity)
  }))
}

export async function analyzeProject(targetPath, context) {
  const files = await collectFiles(targetPath)

  const analysis = {
    meta: {
      analyzedAt: context.timestamp,
      target: targetPath,
      filesScanned: files.length
    },
    violations: []
  }

  for (const file of files) {
    try {
      const fileViolations = await analyzeFile(file, context)
      const filtered = fileViolations.filter(v =>
        severityAllowed(v.severity, context.minSeverity)
      )
      analysis.violations.push(...filtered)
    } catch (error) {
      analysis.violations.push({
        ruleId: "ANALYZER_FAILURE",
        ruleName: "Analyzer Failure",
        severity: "critical",
        message: "File analysis failed unexpectedly",
        explanation: error instanceof Error ? error.message : String(error),
        filePath: file,
        location: null
      })
    }
  }

  analysis.summary = {
    totalViolations: analysis.violations.length,
    bySeverity: SEVERITY_ORDER.reduce((acc, level) => {
      acc[level] = analysis.violations.filter(v => v.severity === level).length
      return acc
    }, {})
  }

  return analysis
}