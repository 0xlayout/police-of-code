import { parse } from "@babel/parser"

const DEFAULT_PARSER_OPTIONS = {
  sourceType: "unambiguous",
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
  errorRecovery: true,
  plugins: [
    "jsx",
    "typescript",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "dynamicImport",
    "optionalChaining",
    "nullishCoalescingOperator",
    "objectRestSpread",
    "topLevelAwait",
    "decorators-legacy"
  ]
}

function buildSyntaxError(error, filePath) {
  return {
    ruleId: "SYNTAX_ERROR",
    ruleName: "Syntax Error",
    severity: "critical",
    message: "Source code contains invalid syntax",
    explanation: error.message,
    filePath,
    location: error.loc
      ? {
          line: error.loc.line,
          column: error.loc.column
        }
      : null
  }
}

export function parseSource(sourceCode, filePath) {
  try {
    const ast = parse(sourceCode, {
      ...DEFAULT_PARSER_OPTIONS,
      sourceFilename: filePath
    })

    return {
      ast,
      sourceType: ast.sourceType,
      tokens: ast.tokens || [],
      comments: ast.comments || [],
      filePath
    }
  } catch (error) {
    const syntaxViolation = buildSyntaxError(error, filePath)

    return {
      ast: null,
      sourceType: null,
      tokens: [],
      comments: [],
      filePath,
      syntaxError: syntaxViolation
    }
  }
}