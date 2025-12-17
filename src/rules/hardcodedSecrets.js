const SECRET_KEYWORDS = [
  "password",
  "passwd",
  "pwd",
  "secret",
  "apiKey",
  "apikey",
  "token",
  "accessToken",
  "auth",
  "authorization",
  "privateKey"
]

const ENTROPY_THRESHOLD = 3.5
const MIN_SECRET_LENGTH = 8

function calculateEntropy(value) {
  const frequencies = {}
  for (const char of value) {
    frequencies[char] = (frequencies[char] || 0) + 1
  }

  let entropy = 0
  const length = value.length

  for (const char in frequencies) {
    const p = frequencies[char] / length
    entropy -= p * Math.log2(p)
  }

  return entropy
}

function looksLikeSecret(value) {
  if (typeof value !== "string") {
    return false
  }

  if (value.length < MIN_SECRET_LENGTH) {
    return false
  }

  const entropy = calculateEntropy(value)
  return entropy >= ENTROPY_THRESHOLD
}

function identifierMatchesSecret(name) {
  const lower = name.toLowerCase()
  return SECRET_KEYWORDS.some(keyword => lower.includes(keyword))
}

function extractStringValue(node) {
  if (!node) {
    return null
  }

  if (node.type === "StringLiteral") {
    return node.value
  }

  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis[0].value.cooked
  }

  return null
}

function shouldIgnore(node, context) {
  if (!node || !context || !context.filePath) {
    return false
  }

  if (context.filePath.includes("test") || context.filePath.includes("spec")) {
    return true
  }

  return false
}

export default {
  id: "SEC-001",
  name: "Hardcoded Secret",
  severity: "critical",

  create(astContext, executionContext, report) {
    return {
      VariableDeclarator(path) {
        const id = path.node.id
        const init = path.node.init

        if (!id || !init) {
          return
        }

        if (id.type !== "Identifier") {
          return
        }

        if (!identifierMatchesSecret(id.name)) {
          return
        }

        const value = extractStringValue(init)

        if (!value) {
          return
        }

        if (!looksLikeSecret(value)) {
          return
        }

        if (shouldIgnore(path.node, astContext)) {
          return
        }

        report({
          node: init,
          message: "Hardcoded secret detected",
          explanation: "Embedding secrets directly in source code exposes them to leaks, version control history, and unauthorized access.",
          suggestion: "Move the secret to a secure storage solution such as environment variables or a secret manager."
        })
      },

      AssignmentExpression(path) {
        const left = path.node.left
        const right = path.node.right

        if (!left || !right) {
          return
        }

        if (left.type !== "MemberExpression" && left.type !== "Identifier") {
          return
        }

        const identifierName =
          left.type === "Identifier"
            ? left.name
            : left.property && left.property.type === "Identifier"
              ? left.property.name
              : null

        if (!identifierName || !identifierMatchesSecret(identifierName)) {
          return
        }

        const value = extractStringValue(right)

        if (!value) {
          return
        }

        if (!looksLikeSecret(value)) {
          return
        }

        report({
          node: right,
          message: "Hardcoded secret assigned at runtime",
          explanation: "Secrets assigned directly in code can be extracted and abused, even if they appear outside of variable declarations.",
          suggestion: "Use runtime configuration provided by the environment or a dedicated secrets provider."
        })
      }
    }
  }
}