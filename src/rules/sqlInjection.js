const SQL_SINK_FUNCTIONS = new Set([
  "query",
  "execute",
  "run",
  "prepare"
])

function isUserControlled(node) {
  if (!node) {
    return false
  }

  if (node.type === "Identifier") {
    return true
  }

  if (node.type === "MemberExpression") {
    return true
  }

  if (node.type === "BinaryExpression") {
    return isUserControlled(node.left) || isUserControlled(node.right)
  }

  if (node.type === "TemplateLiteral") {
    return node.expressions.length > 0
  }

  return false
}

function isSqlString(node) {
  if (!node) {
    return false
  }

  if (node.type === "StringLiteral") {
    return /select|insert|update|delete|where|from/i.test(node.value)
  }

  if (node.type === "TemplateLiteral") {
    return /select|insert|update|delete|where|from/i.test(
      node.quasis.map(q => q.value.cooked).join("")
    )
  }

  return false
}

function isUnsafeConcatenation(node) {
  if (!node || node.type !== "BinaryExpression") {
    return false
  }

  if (node.operator !== "+") {
    return false
  }

  return isSqlString(node.left) && isUserControlled(node.right)
}

function isUnsafeTemplateLiteral(node) {
  if (!node || node.type !== "TemplateLiteral") {
    return false
  }

  const sqlText = node.quasis.map(q => q.value.cooked).join("")
  if (!/select|insert|update|delete|where|from/i.test(sqlText)) {
    return false
  }

  return node.expressions.some(expr => isUserControlled(expr))
}

function isQueryCall(node) {
  if (!node || node.type !== "CallExpression") {
    return false
  }

  if (node.callee.type === "Identifier") {
    return SQL_SINK_FUNCTIONS.has(node.callee.name)
  }

  if (node.callee.type === "MemberExpression" && node.callee.property.type === "Identifier") {
    return SQL_SINK_FUNCTIONS.has(node.callee.property.name)
  }

  return false
}

export default {
  id: "SEC-002",
  name: "Potential SQL Injection",
  severity: "critical",

  create(astContext, executionContext, report) {
    return {
      CallExpression(path) {
        const node = path.node

        if (!isQueryCall(node)) {
          return
        }

        const argument = node.arguments[0]

        if (!argument) {
          return
        }

        if (isUnsafeConcatenation(argument) || isUnsafeTemplateLiteral(argument)) {
          report({
            node: argument,
            message: "Potential SQL injection detected",
            explanation: "Building SQL queries through string concatenation or interpolation with user-controlled data can lead to SQL injection vulnerabilities.",
            suggestion: "Use parameterized queries or prepared statements provided by the database driver."
          })
        }
      }
    }
  }
}
