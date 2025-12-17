import traverse from "@babel/traverse"

function normalizeLocation(node) {
  if (!node || !node.loc) {
    return null
  }

  return {
    start: {
      line: node.loc.start.line,
      column: node.loc.start.column
    },
    end: {
      line: node.loc.end.line,
      column: node.loc.end.column
    }
  }
}

function createViolation(rule, payload) {
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    severity: rule.severity,
    message: payload.message,
    explanation: payload.explanation,
    suggestion: payload.suggestion || null,
    location: payload.node ? normalizeLocation(payload.node) : null
  }
}

function shouldRunRule(rule, context) {
  if (typeof rule.enabled === "boolean") {
    return rule.enabled
  }

  if (typeof rule.enabled === "function") {
    return rule.enabled(context)
  }

  return true
}

function executeRuleOnAST(rule, astContext, executionContext) {
  const violations = []

  if (!astContext.ast) {
    return violations
  }

  const visitor = rule.create(astContext, executionContext, result => {
    if (!result || !result.message || !result.explanation) {
      return
    }

    violations.push(createViolation(rule, result))
  })

  traverse(astContext.ast, visitor, undefined, {
    source: astContext.source,
    filePath: astContext.filePath
  })

  return violations
}

export function executeRules(astContext, rules, executionContext) {
  const allViolations = []

  if (astContext.syntaxError) {
    allViolations.push(astContext.syntaxError)
    return allViolations
  }

  for (const rule of rules) {
    if (!shouldRunRule(rule, executionContext)) {
      continue
    }

    try {
      const violations = executeRuleOnAST(rule, astContext, executionContext)
      allViolations.push(...violations)
    } catch (error) {
      allViolations.push({
        ruleId: rule.id || "RULE_ENGINE_FAILURE",
        ruleName: rule.name || "Rule Engine Failure",
        severity: "critical",
        message: "Rule execution failed",
        explanation: error instanceof Error ? error.message : String(error),
        location: null
      })
    }
  }

  return allViolations
}
