const DEFAULT_MAX_LINES = 50

function getNodeLines(node) {
  if (!node || !node.loc) {
    return 0
  }

  return node.loc.end.line - node.loc.start.line + 1
}

function getFunctionName(node) {
  if (!node) {
    return "anonymous"
  }

  if (node.id && node.id.name) {
    return node.id.name
  }

  return "anonymous"
}

function shouldIgnoreFunction(node) {
  if (!node || !node.loc) {
    return true
  }

  if (node.generator || node.async) {
    return false
  }

  return false
}

export default {
  id: "MAINT-001",
  name: "Long Function",
  severity: "medium",

  enabled(context) {
    return true
  },

  create(astContext, executionContext, report) {
    const maxLines =
      typeof executionContext.maxFunctionLines === "number"
        ? executionContext.maxFunctionLines
        : DEFAULT_MAX_LINES

    function analyzeFunction(path) {
      const node = path.node

      if (shouldIgnoreFunction(node)) {
        return
      }

      const lines = getNodeLines(node)

      if (lines <= maxLines) {
        return
      }

      report({
        node,
        message: `Function exceeds ${maxLines} lines`,
        explanation: `Large functions are harder to understand, test, and maintain. This function spans ${lines} lines.`,
        suggestion: "Split the function into smaller, focused units with clear responsibilities."
      })
    }

    return {
      FunctionDeclaration: analyzeFunction,
      FunctionExpression: analyzeFunction,
      ArrowFunctionExpression: analyzeFunction
    }
  }
}
